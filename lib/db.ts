import { INITIAL_ITEMS } from './initialData';
import { DatabaseItem } from './types';

const LOCAL_STORAGE_KEY = 'amway_omni_db_items_v2';
const SUPABASE_URL_KEY = 'amway_supabase_url';
const SUPABASE_KEY_KEY = 'amway_supabase_key';

const DEFAULT_SUPABASE_URL = 'https://lmcftpaujhdmmbiczbcu.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_eTT-XDiMSqrLd0H-RqJy2w_QiJyN26c';

export interface SupabaseConfig {
  url: string;
  key: string;
  tableName?: string;
}

export const getCloudCredentials = (): SupabaseConfig => {
  if (typeof window === 'undefined') {
    return { url: DEFAULT_SUPABASE_URL, key: DEFAULT_SUPABASE_KEY };
  }

  return {
    url: localStorage.getItem(SUPABASE_URL_KEY) || process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL,
    key: localStorage.getItem(SUPABASE_KEY_KEY) || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY,
  };
};

export const setCloudCredentials = (url: string, key: string) => {
  if (typeof window === 'undefined') return;

  if (!url.trim() || !key.trim()) {
    localStorage.removeItem(SUPABASE_URL_KEY);
    localStorage.removeItem(SUPABASE_KEY_KEY);
    return;
  }

  localStorage.setItem(SUPABASE_URL_KEY, url.trim());
  localStorage.setItem(SUPABASE_KEY_KEY, key.trim());
};

export const getSupabaseConfig = getCloudCredentials;

export const saveSupabaseConfig = (config: SupabaseConfig | null) => {
  if (!config) setCloudCredentials('', '');
  else setCloudCredentials(config.url, config.key);
};

export const loadItems = async (): Promise<DatabaseItem[]> => {
  if (typeof window === 'undefined') return INITIAL_ITEMS;

  try {
    const creds = getCloudCredentials();
    const headers: Record<string, string> = {};

    if (creds.url && creds.key) {
      headers['x-supabase-url'] = creds.url;
      headers['x-supabase-key'] = creds.key;
    }

    const res = await fetch('/api/items', { headers, cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        } catch (err) {
          console.warn('Local cache skipped because the dataset is too large.', err);
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('Cloud load failed; falling back to local data.', err);
  }

  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Local data load failed.', err);
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
  return INITIAL_ITEMS;
};

export const saveItems = async (items: DatabaseItem[]): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Local save failed.', err);
  }

  try {
    const creds = getCloudCredentials();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    if (creds.url && creds.key) {
      headers['x-supabase-url'] = creds.url;
      headers['x-supabase-key'] = creds.key;
    }

    const res = await fetch('/api/items', {
      method: 'POST',
      headers,
      body: JSON.stringify(items),
    });

    return res.ok;
  } catch (err) {
    console.error('Cloud save failed.', err);
    return false;
  }
};

export const exportDataJSON = (items: DatabaseItem[]) => {
  const jsonStr = JSON.stringify(items, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = `amway_notes_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
