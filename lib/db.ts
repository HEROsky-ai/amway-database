import { DatabaseItem } from './types';
import { INITIAL_ITEMS } from './initialData';

const LOCAL_STORAGE_KEY = 'amway_omni_db_items_v1';
const SUPABASE_CONFIG_KEY = 'amway_omni_supabase_config_v1';

export interface SupabaseConfig {
  url: string;
  key: string;
  tableName: string;
}

// 取得 Supabase 配置
export const getSupabaseConfig = (): SupabaseConfig | null => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(SUPABASE_CONFIG_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// 儲存 Supabase 配置
export const saveSupabaseConfig = (config: SupabaseConfig | null) => {
  if (typeof window === 'undefined') return;
  if (!config) {
    localStorage.removeItem(SUPABASE_CONFIG_KEY);
  } else {
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
  }
};

// 取得本機/伺服器資料庫項目
export const loadItems = async (): Promise<DatabaseItem[]> => {
  if (typeof window === 'undefined') return INITIAL_ITEMS;

  // 1. 嘗試從 /api/items 端點讀取 (若有共享雲端)
  try {
    const res = await fetch('/api/items', { cache: 'no-store' });
    if (res.ok) {
      const serverItems = await res.json();
      if (Array.isArray(serverItems) && serverItems.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverItems));
        return serverItems;
      }
    }
  } catch (err) {
    console.log('Server fetch fallback to local:', err);
  }

  // 2. 備用：LocalStorage
  try {
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read LocalStorage:', e);
  }

  // 3. 第一次使用：預載 INITIAL_ITEMS
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
  return INITIAL_ITEMS;
};

// 儲存資料（同時同步至 LocalStorage 與 /api/items）
export const saveItems = async (items: DatabaseItem[]): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  // 1. 寫入 LocalStorage
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }

  // 2. 嘗試同步寫入 /api/items (若部署於 Vercel/Server)
  try {
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    });
    return true;
  } catch (err) {
    console.warn('API sync warning:', err);
    return true; // LocalStorage 已儲存成功
  }
};

// 匯出 JSON
export const exportDataJSON = (items: DatabaseItem[]) => {
  const jsonStr = JSON.stringify(items, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `安麗萬能資料庫_備份_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
