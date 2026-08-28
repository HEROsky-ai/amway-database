import { NextResponse } from 'next/server';
import { DatabaseItem } from '@/lib/types';

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY =
  process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 使用 KV 表格：一列存所有資料（最簡單、最可靠）
// SQL: CREATE TABLE amway_store (key text PRIMARY KEY, data jsonb, updated_at timestamptz DEFAULT now());
const TABLE = 'amway_store';
const ROW_KEY = 'items';

function headers(extra: Record<string, string> = {}) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

async function readFromSupabase(): Promise<DatabaseItem[] | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?key=eq.${ROW_KEY}&select=data`,
      { headers: headers(), cache: 'no-store' }
    );
    if (!res.ok) {
      console.error('Supabase GET error:', res.status, await res.text());
      return null;
    }
    const rows = await res.json();
    // table exists but no data yet → return empty array (not null)
    if (Array.isArray(rows)) {
      if (rows.length === 0) return [];
      if (Array.isArray(rows[0].data)) return rows[0].data as DatabaseItem[];
    }
    return null;
  } catch (err) {
    console.error('Supabase read failed:', err);
    return null;
  }
}

async function writeToSupabase(items: DatabaseItem[]): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: headers({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({ key: ROW_KEY, data: items, updated_at: new Date().toISOString() }),
    });
    if (!res.ok) {
      console.error('Supabase write error:', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase write failed:', err);
    return false;
  }
}

export async function GET() {
  const items = await readFromSupabase();
  if (items !== null) {
    return NextResponse.json({ ok: true, source: 'supabase', data: items });
  }
  // ← 重要：Supabase 失敗時回傳 503，不回傳假資料
  return NextResponse.json(
    { ok: false, source: 'unavailable', data: null },
    { status: 503 }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = (Array.isArray(body) ? body : body?.items) as DatabaseItem[];
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const ok = await writeToSupabase(items);
    if (!ok) {
      return NextResponse.json(
        { ok: false, error: 'Supabase save failed — check table exists' },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: true, count: items.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
