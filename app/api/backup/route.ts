import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const ITEMS_TABLE = 'amway_items';
const BACKUP_TABLE = 'amway_backups';
const KEEP_DAYS = 7;

async function supabaseFetch(path: string, options: RequestInit = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    },
  });
}

export async function GET() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  try {
    // 1. 讀取目前所有資料
    const itemsRes = await supabaseFetch(`/${ITEMS_TABLE}?select=*&order=updatedAt.desc`);
    if (!itemsRes.ok) {
      const err = await itemsRes.text();
      return NextResponse.json({ error: 'Failed to read items', detail: err }, { status: 502 });
    }
    const items = await itemsRes.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'No items to backup' });
    }

    const now = new Date().toISOString();

    // 2. 寫入備份快照
    const insertRes = await supabaseFetch(`/${BACKUP_TABLE}`, {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        created_at: now,
        item_count: items.length,
        data: items,
      }),
    });

    if (!insertRes.ok) {
      const err = await insertRes.text();
      return NextResponse.json({ error: 'Failed to save backup', detail: err }, { status: 502 });
    }

    // 3. 清除 7 天以前的舊備份
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - KEEP_DAYS);
    await supabaseFetch(
      `/${BACKUP_TABLE}?created_at=lt.${cutoff.toISOString()}`,
      { method: 'DELETE' }
    );

    return NextResponse.json({
      success: true,
      backed_up_at: now,
      item_count: items.length,
    });
  } catch (err) {
    console.error('Backup error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// 允許手動觸發還原：POST /api/backup?restore=true&backup_id=xxx
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const backupId = searchParams.get('backup_id');

  if (!backupId) {
    return NextResponse.json({ error: 'backup_id required' }, { status: 400 });
  }

  try {
    // 讀取指定備份
    const res = await supabaseFetch(`/${BACKUP_TABLE}?id=eq.${backupId}&select=data`);
    if (!res.ok) {
      return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
    }
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
    }

    const items = rows[0].data;

    // 清除現有資料，還原備份
    await supabaseFetch(`/${ITEMS_TABLE}?id=neq.null`, { method: 'DELETE' });
    await supabaseFetch(`/${ITEMS_TABLE}`, {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify(items),
    });

    return NextResponse.json({ success: true, restored_count: items.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
