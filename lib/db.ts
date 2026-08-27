import { DatabaseItem } from './types';

const LS_KEY = 'amway_db_v3';

// ─── LocalStorage ─────────────────────────────────
function lsLoad(): DatabaseItem[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function lsSave(items: DatabaseItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('localStorage write failed:', e);
  }
}

// ─── Cloud API ────────────────────────────────────
async function cloudLoad(): Promise<DatabaseItem[] | null> {
  try {
    const res = await fetch('/api/items', { cache: 'no-store' });
    if (!res.ok) return null; // 503 = Supabase unavailable → don't overwrite localStorage
    const body = await res.json();
    if (body?.ok && Array.isArray(body.data)) return body.data;
    return null;
  } catch {
    return null;
  }
}

async function cloudSave(items: DatabaseItem[]): Promise<boolean> {
  try {
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    });
    const body = await res.json().catch(() => ({}));
    return !!body?.ok;
  } catch {
    return false;
  }
}

// ─── Public API ───────────────────────────────────

/**
 * 載入邏輯：
 * 1. 先讀 Supabase（雲端最新）
 * 2. 若 Supabase 無法存取 → 用 localStorage（本機快取）
 * 3. 若兩者都空 → 回傳 []（空陣列，不塞假資料）
 */
export async function loadItems(): Promise<DatabaseItem[]> {
  if (typeof window === 'undefined') return [];

  // 嘗試雲端
  const cloud = await cloudLoad();
  if (cloud !== null) {
    lsSave(cloud); // 同步到本機快取
    return cloud;
  }

  // Supabase 不可用 → 用本機快取
  const local = lsLoad();
  if (local !== null) {
    console.warn('[DB] Supabase unavailable, using localStorage cache');
    return local;
  }

  // 完全空白（第一次使用，無快取）
  return [];
}

/**
 * 儲存邏輯：
 * 1. 立即寫入 localStorage（確保不丟失）
 * 2. 非同步同步至 Supabase
 * 3. 回傳同步結果（true = 雲端成功，false = 僅本機）
 */
export async function saveItems(items: DatabaseItem[]): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // 先存本機（立即，不等雲端）
  lsSave(items);

  // 再存雲端
  const ok = await cloudSave(items);
  if (!ok) {
    console.warn('[DB] Cloud save failed — data safe in localStorage');
  }
  return ok;
}

export function exportDataJSON(items: DatabaseItem[]) {
  const json = JSON.stringify(items, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `安麗萬能資料庫_備份_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
