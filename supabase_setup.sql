-- ============================================================
-- 安麗萬能資料庫 - Supabase 建表 SQL
-- 請到 Supabase Dashboard > SQL Editor 執行此檔案
-- ============================================================

-- 1. 建立 amway_items 資料表
CREATE TABLE IF NOT EXISTS public.amway_items (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL DEFAULT '',
  category      TEXT NOT NULL DEFAULT 'nutrition',
  subcategory   TEXT NOT NULL DEFAULT '',
  tags          JSONB NOT NULL DEFAULT '[]',
  summary       TEXT NOT NULL DEFAULT '',
  content       TEXT NOT NULL DEFAULT '',
  highlights    JSONB DEFAULT '[]',
  qa            JSONB DEFAULT '[]',
  links         JSONB DEFAULT '[]',
  attachments   JSONB DEFAULT '[]',
  "imageUrl"    TEXT DEFAULT NULL,
  "isFavorite"  BOOLEAN DEFAULT FALSE,
  "updatedAt"   TEXT NOT NULL DEFAULT ''
);

-- 2. 開啟 Row Level Security
ALTER TABLE public.amway_items ENABLE ROW LEVEL SECURITY;

-- 3. 允許任何人讀取（公開筆記）
CREATE POLICY IF NOT EXISTS "allow_public_read"
  ON public.amway_items
  FOR SELECT
  USING (true);

-- 4. 允許任何人新增
CREATE POLICY IF NOT EXISTS "allow_public_insert"
  ON public.amway_items
  FOR INSERT
  WITH CHECK (true);

-- 5. 允許任何人更新
CREATE POLICY IF NOT EXISTS "allow_public_update"
  ON public.amway_items
  FOR UPDATE
  USING (true);

-- 6. 允許任何人刪除
CREATE POLICY IF NOT EXISTS "allow_public_delete"
  ON public.amway_items
  FOR DELETE
  USING (true);

-- 完成後可用此指令確認 table 存在：
-- SELECT * FROM public.amway_items LIMIT 5;
