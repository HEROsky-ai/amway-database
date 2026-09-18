import { NextResponse } from 'next/server';

const HARDCODED_URL = 'https://lmcftpaujhdmmbiczbcu.supabase.co';
const HARDCODED_KEY = 'sb_publishable_eTT-XDiMSqrLd0H-RqJy2w_QiJyN26c';

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  HARDCODED_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  HARDCODED_KEY;

const STORE_TABLE = 'amway_store';
const BACKUP_TABLE = 'amway_backups';
const KEEP_DAYS = 7;

async function supabaseFetch(path: string, options: RequestInit = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    },
  });
}

export async function GET() {
  try {
    // 1. 讀取目前 amway_store 中 key='items' 的最新資料
    const itemsRes = await supabaseFetch(`/${STORE_TABLE}?key=eq.items&select=data`);
    if (!itemsRes.ok) {
      const err = await itemsRes.text();
      return NextResponse.json({ error: 'Failed to read items from store', detail: err }, { status: 502 });
    }
    const rows = await itemsRes.json();

    if (!Array.isArray(rows) || rows.length === 0 || !Array.isArray(rows[0].data) || rows[0].data.length === 0) {
      return NextResponse.json({ message: 'No items to backup' });
    }

    const items = rows[0].data;
    const now = new Date().toISOString();

    // 2. 寫入備份快照至 amway_backups
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

// 允許手動觸發還原：POST /api/backup?backup_id=xxx
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

    // 更新回 amway_store
    const updateRes = await supabaseFetch(`/${STORE_TABLE}`, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ key: 'items', data: items, updated_at: new Date().toISOString() }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.text();
      return NextResponse.json({ error: 'Failed to restore to store', detail: err }, { status: 502 });
    }

    return NextResponse.json({ success: true, restored_count: items.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
