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
const BACKUP_HISTORY_KEY = 'backup_history';
const MAX_SNAPSHOTS = 14; // 保留最近 14 次備份快照

interface BackupSnapshot {
  id: string;
  created_at: string;
  item_count: number;
  data: unknown[];
}

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

    const currentItems = rows[0].data;
    const now = new Date().toISOString();
    const newSnapshot: BackupSnapshot = {
      id: `backup-${Date.now()}`,
      created_at: now,
      item_count: currentItems.length,
      data: currentItems,
    };

    // 2. 讀取現有的備份快照歷史
    const historyRes = await supabaseFetch(`/${STORE_TABLE}?key=eq.${BACKUP_HISTORY_KEY}&select=data`);
    let history: BackupSnapshot[] = [];
    if (historyRes.ok) {
      const hRows = await historyRes.json();
      if (Array.isArray(hRows) && hRows.length > 0 && Array.isArray(hRows[0].data)) {
        history = hRows[0].data;
      }
    }

    // 加入最新快照，並最多保留 MAX_SNAPSHOTS 份
    const updatedHistory = [newSnapshot, ...history].slice(0, MAX_SNAPSHOTS);

    // 3. 存入 amway_store (key='backup_history')
    const saveRes = await supabaseFetch(`/${STORE_TABLE}`, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({
        key: BACKUP_HISTORY_KEY,
        data: updatedHistory,
        updated_at: now,
      }),
    });

    if (!saveRes.ok) {
      const err = await saveRes.text();
      return NextResponse.json({ error: 'Failed to save backup snapshot', detail: err }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      backed_up_at: now,
      item_count: currentItems.length,
      total_snapshots: updatedHistory.length,
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
    // 讀取備份歷史
    const historyRes = await supabaseFetch(`/${STORE_TABLE}?key=eq.${BACKUP_HISTORY_KEY}&select=data`);
    if (!historyRes.ok) {
      return NextResponse.json({ error: 'Failed to read backup history' }, { status: 502 });
    }
    const rows = await historyRes.json();
    if (!Array.isArray(rows) || rows.length === 0 || !Array.isArray(rows[0].data)) {
      return NextResponse.json({ error: 'No backups found' }, { status: 404 });
    }

    const history = rows[0].data as BackupSnapshot[];
    const target = history.find((s) => s.id === backupId);

    if (!target || !Array.isArray(target.data)) {
      return NextResponse.json({ error: `Backup with id ${backupId} not found` }, { status: 404 });
    }

    // 還原至 key='items'
    const updateRes = await supabaseFetch(`/${STORE_TABLE}`, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({
        key: 'items',
        data: target.data,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.text();
      return NextResponse.json({ error: 'Failed to restore', detail: err }, { status: 502 });
    }

    return NextResponse.json({ success: true, restored_count: target.data.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
