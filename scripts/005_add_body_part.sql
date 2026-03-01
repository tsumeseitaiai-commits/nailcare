-- Phase 1: body_part カラムを nail_cases テーブルに追加
-- 爪診断 = 'nail', かかと診断 = 'heel'

ALTER TABLE nail_cases
ADD COLUMN IF NOT EXISTS body_part TEXT DEFAULT 'nail';

-- 既存データはすべて nail として設定
UPDATE nail_cases SET body_part = 'nail' WHERE body_part IS NULL;

-- インデックスを追加（管理画面でのフィルタリング用）
CREATE INDEX IF NOT EXISTS idx_nail_cases_body_part ON nail_cases(body_part);
