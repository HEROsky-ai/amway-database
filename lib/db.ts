import { DatabaseItem } from './types';
import { INITIAL_ITEMS } from './initialData';

const LOCAL_STORAGE_KEY = 'amway_omni_db_items_v2';
const SUPABASE_URL_KEY = 'amway_supabase_url';
const SUPABASE_KEY_KEY = 'amway_supabase_key';

// 取得本機或雲端設定
export const getCloudCredentials = () => {
  if (typeof window === 'undefined') return { url: '', key: '' };
  return {
    url: localStorage.getItem(SUPABASE_URL_KEY) || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    key: localStorage.getItem(SUPABASE_KEY_KEY) || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  };
};

export const setCloudCredentials = (url: string, key: string) => {
  if (typeof window === 'undefined') return;
  if (!url || !key) {
    localStorage.removeItem(SUPABASE_URL_KEY);
    localStorage.removeItem(SUPABASE_KEY_KEY);
  } else {
    localStorage.setItem(SUPABASE_URL_KEY, url.trim());
    localStorage.setItem(SUPABASE_KEY_KEY, key.trim());
  }
};

// 載入資料 (優先從 API / Supabase 讀取，確保永久雲端數據)
export const loadItems = async (): Promise<DatabaseItem[]> => {
  if (typeof window === 'undefined') return INITIAL_ITEMS;

  // 1. 嘗試透過雲端 /api/items 讀取
  try {
    const creds = getCloudCredentials();
    const headers: Record<string, string> = {};
    if (creds.url && creds.key) {
      headers['x-supabase-url'] = creds.url;
      headers['x-supabase-key'] = creds.key;
    }

    const res = await fetch('/api/items', {
      headers,
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('雲端資料讀取失敗，切換至本機快取:', err);
  }

  // 2. 本機快取
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('LocalStorage 讀取失敗:', e);
  }

  // 3. 預設雛形資料
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
  return INITIAL_ITEMS;
};

// 永久存檔寫入 (同時寫入 Supabase 雲端與 LocalStorage)
export const saveItems = async (items: DatabaseItem[]): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  // 1. 寫入 LocalStorage 快取
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('LocalStorage 寫入失敗:', e);
  }

  // 2. 寫入 永久雲端 API / Supabase
  try {
    const creds = getCloudCredentials();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (creds.url && creds.key) {
      headers['x-supabase-url'] = creds.url;
      headers['x-supabase-key'] = creds.key;
    }

    await fetch('/api/items', {
      method: 'POST',
      headers,
      body: JSON.stringify(items),
    });
    return true;
  } catch (err) {
    console.error('雲端資料同步失敗:', err);
    return false;
  }
};

export const exportDataJSON = (items: DatabaseItem[]) => {
  const jsonStr = JSON.stringify(items, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `安麗萬能資料庫_永久備份_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
