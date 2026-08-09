import { NextResponse } from 'next/server';
import { INITIAL_ITEMS } from '@/lib/initialData';
import { DatabaseItem } from '@/lib/types';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data_store.json');

// Supabase REST 查詢 (若提供金鑰則直接與 Supabase 永久雲端資料庫雙向同步)
async function fetchFromSupabase(url: string, key: string): Promise<DatabaseItem[] | null> {
  try {
    const res = await fetch(`${url}/rest/v1/amway_items?select=*&order=updatedAt.desc`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data as DatabaseItem[];
      }
    }
  } catch (err) {
    console.error('Supabase fetch error:', err);
  }
  return null;
}

async function saveToSupabase(url: string, key: string, items: DatabaseItem[]): Promise<boolean> {
  try {
    const res = await fetch(`${url}/rest/v1/amway_items`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify(items),
    });
    return res.ok;
  } catch (err) {
    console.error('Supabase save error:', err);
    return false;
  }
}

function getLocalFileItems(): DatabaseItem[] {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('File read error:', e);
  }
  return INITIAL_ITEMS;
}

function saveLocalFileItems(items: DatabaseItem[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(items, null, 2), 'utf-8');
  } catch (e) {
    console.error('File write error:', e);
  }
}

export async function GET(request: Request) {
  const supabaseUrl = request.headers.get('x-supabase-url') || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = request.headers.get('x-supabase-key') || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    const cloudItems = await fetchFromSupabase(supabaseUrl, supabaseKey);
    if (cloudItems) {
      return NextResponse.json(cloudItems);
    }
  }

  const localItems = getLocalFileItems();
  return NextResponse.json(localItems);
}

export async function POST(request: Request) {
  try {
    const items = (await request.json()) as DatabaseItem[];
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const supabaseUrl = request.headers.get('x-supabase-url') || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = request.headers.get('x-supabase-key') || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      await saveToSupabase(supabaseUrl, supabaseKey, items);
    }

    saveLocalFileItems(items);
    return NextResponse.json({ success: true, count: items.length });
  } catch (err) {
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}
