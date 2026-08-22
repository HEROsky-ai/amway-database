import { NextResponse } from 'next/server';
import { INITIAL_ITEMS } from '@/lib/initialData';
import { DatabaseItem } from '@/lib/types';

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY =
  process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const TABLE = 'amway_items';

function getCredentials(request: Request) {
  return {
    url: request.headers.get('x-supabase-url') || SUPABASE_URL,
    key: request.headers.get('x-supabase-key') || SUPABASE_KEY,
  };
}

async function fetchFromSupabase(url: string, key: string): Promise<DatabaseItem[] | null> {
  if (!url || !key) return null;
  try {
    const res = await fetch(
      `${url}/rest/v1/${TABLE}?select=*&order=updatedAt.desc`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        cache: 'no-store',
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data as DatabaseItem[];
    } else {
      const err = await res.text();
      console.error('Supabase GET error:', res.status, err);
    }
  } catch (err) {
    console.error('Supabase fetch error:', err);
  }
  return null;
}

async function upsertToSupabase(
  url: string,
  key: string,
  items: DatabaseItem[]
): Promise<{ ok: boolean; error?: string }> {
  if (!url || !key) return { ok: false, error: 'Missing credentials' };
  try {
    // Delete all then re-insert to guarantee sync state
    await fetch(`${url}/rest/v1/${TABLE}?id=neq.null`, {
      method: 'DELETE',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });

    const res = await fetch(`${url}/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(items),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Supabase POST error:', res.status, errText);
      return { ok: false, error: errText };
    }
    return { ok: true };
  } catch (err) {
    console.error('Supabase upsert error:', err);
    return { ok: false, error: String(err) };
  }
}

export async function GET(request: Request) {
  const { url, key } = getCredentials(request);
  const cloudItems = await fetchFromSupabase(url, key);
  if (cloudItems) {
    return NextResponse.json(cloudItems);
  }
  // Supabase unavailable — return initial data so UI doesn't break
  return NextResponse.json(INITIAL_ITEMS);
}

export async function POST(request: Request) {
  try {
    const items = (await request.json()) as DatabaseItem[];
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { url, key } = getCredentials(request);
    const result = await upsertToSupabase(url, key, items);

    if (!result.ok) {
      return NextResponse.json(
        { error: 'Supabase save failed', detail: result.error },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, count: items.length });
  } catch (err) {
    console.error('POST /api/items error:', err);
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}
