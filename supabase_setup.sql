-- ============================================================
-- 安麗萬能資料庫 - Supabase 建表 SQL（簡化版 KV 格式）
-- 請到 Supabase Dashboard > SQL Editor 貼上執行
-- ============================================================

-- 1. 主要資料表（KV 格式，一列存所有資料）
CREATE TABLE IF NOT EXISTS public.amway_store (
  key         TEXT PRIMARY KEY,
  data        JSONB NOT NULL DEFAULT '[]',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 開啟 Row Level Security
ALTER TABLE public.amway_store ENABLE ROW LEVEL SECURITY;

-- 3. RLS 允許任何人讀寫（公開筆記）
CREATE POLICY IF NOT EXISTS "allow_all_read"   ON public.amway_store FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "allow_all_insert" ON public.amway_store FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "allow_all_update" ON public.amway_store FOR UPDATE USING (true);

-- 4. 備份快照表（記錄每次儲存時的版本）
CREATE TABLE IF NOT EXISTS public.amway_backups (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  item_count  INTEGER NOT NULL DEFAULT 0,
  data        JSONB NOT NULL DEFAULT '[]'
);

ALTER TABLE public.amway_backups ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "allow_backup_read"   ON public.amway_backups FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "allow_backup_insert" ON public.amway_backups FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "allow_backup_delete" ON public.amway_backups FOR DELETE USING (true);

-- ============================================================
-- 確認執行成功後可查詢：
-- SELECT key, updated_at, jsonb_array_length(data) as item_count
-- FROM public.amway_store;
-- ============================================================
