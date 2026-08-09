import { NextResponse } from 'next/server';
import { INITIAL_ITEMS } from '@/lib/initialData';
import { DatabaseItem } from '@/lib/types';
import fs from 'fs';
import path from 'path';

// 定義伺服器端資料檔案路徑
const dataFilePath = path.join(process.cwd(), 'data_store.json');

function getStoredItems(): DatabaseItem[] {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading data_store.json:', err);
  }
  return INITIAL_ITEMS;
}

function saveStoredItems(items: DatabaseItem[]): boolean {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(items, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing data_store.json:', err);
    return false;
  }
}

export async function GET() {
  const items = getStoredItems();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const newItems = (await request.json()) as DatabaseItem[];
    if (Array.isArray(newItems)) {
      saveStoredItems(newItems);
      return NextResponse.json({ success: true, count: newItems.length });
    }
    return NextResponse.json({ error: 'Invalid items payload' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update items' }, { status: 500 });
  }
}
