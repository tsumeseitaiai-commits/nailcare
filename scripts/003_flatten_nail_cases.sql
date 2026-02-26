-- ============================================================
-- Migration 003: nail_cases フラット化
-- ビッグデータ分析用に全項目を独立カラムへ
-- Supabase Dashboard > SQL Editor で実行
-- ============================================================

-- ── 爪の自覚症状（boolean）──────────────────────────
ALTER TABLE nail_cases
  ADD COLUMN IF NOT EXISTS nail_color_change    boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS nail_brittle         boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS nail_pain            boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS nail_growth_change   boolean DEFAULT false;

-- ── 足・体の形態 ────────────────────────────────────
ALTER TABLE nail_cases
  ADD COLUMN IF NOT EXISTS height              numeric(5,1),
  ADD COLUMN IF NOT EXISTS weight              numeric(5,1),
  ADD COLUMN IF NOT EXISTS dominant_foot       varchar(10),
  ADD COLUMN IF NOT EXISTS arch_type           varchar(20),
  ADD COLUMN IF NOT EXISTS callus_locations    jsonb DEFAULT '[]';

-- ── ライフスタイル ──────────────────────────────────
ALTER TABLE nail_cases
  ADD COLUMN IF NOT EXISTS sports_history      numeric(4,1),
  ADD COLUMN IF NOT EXISTS practice_frequency  varchar(30),
  ADD COLUMN IF NOT EXISTS nail_care_style     varchar(20),
  ADD COLUMN IF NOT EXISTS nail_care_frequency varchar(20),
  ADD COLUMN IF NOT EXISTS uses_insole         boolean DEFAULT false;

-- ── 既存の問診項目をJSONBから独立カラムへ ─────────────
ALTER TABLE nail_cases
  ADD COLUMN IF NOT EXISTS sport               varchar(50),
  ADD COLUMN IF NOT EXISTS age                 integer,
  ADD COLUMN IF NOT EXISTS gender              varchar(10),
  ADD COLUMN IF NOT EXISTS curved_nail         varchar(20),
  ADD COLUMN IF NOT EXISTS hallux_valgus       varchar(20),
  ADD COLUMN IF NOT EXISTS toe_grip            integer,
  ADD COLUMN IF NOT EXISTS grip_confidence     integer,
  ADD COLUMN IF NOT EXISTS balance             integer,
  ADD COLUMN IF NOT EXISTS ankle_sprain        varchar(20),
  ADD COLUMN IF NOT EXISTS current_pain_areas  jsonb DEFAULT '[]';

-- ── スコア内訳を独立カラムへ ────────────────────────
ALTER TABLE nail_cases
  ADD COLUMN IF NOT EXISTS nail_score          integer,
  ADD COLUMN IF NOT EXISTS quiz_score          integer,
  ADD COLUMN IF NOT EXISTS nail_findings       jsonb DEFAULT '[]';

-- ============================================================
-- インデックス
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_nail_cases_health_score  ON nail_cases (health_score);
CREATE INDEX IF NOT EXISTS idx_nail_cases_nail_score    ON nail_cases (nail_score);
CREATE INDEX IF NOT EXISTS idx_nail_cases_quiz_score    ON nail_cases (quiz_score);
CREATE INDEX IF NOT EXISTS idx_nail_cases_created_at    ON nail_cases (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nail_cases_sport         ON nail_cases (sport);
CREATE INDEX IF NOT EXISTS idx_nail_cases_age           ON nail_cases (age);
CREATE INDEX IF NOT EXISTS idx_nail_cases_gender        ON nail_cases (gender);
CREATE INDEX IF NOT EXISTS idx_nail_cases_curved_nail   ON nail_cases (curved_nail);
CREATE INDEX IF NOT EXISTS idx_nail_cases_hallux_valgus ON nail_cases (hallux_valgus);
CREATE INDEX IF NOT EXISTS idx_nail_cases_ankle_sprain  ON nail_cases (ankle_sprain);
CREATE INDEX IF NOT EXISTS idx_nail_cases_arch_type     ON nail_cases (arch_type);
CREATE INDEX IF NOT EXISTS idx_nail_cases_toe_grip      ON nail_cases (toe_grip);
CREATE INDEX IF NOT EXISTS idx_nail_cases_balance       ON nail_cases (balance);
CREATE INDEX IF NOT EXISTS idx_nail_cases_nail_pain     ON nail_cases (nail_pain);
CREATE INDEX IF NOT EXISTS idx_nail_cases_nail_brittle  ON nail_cases (nail_brittle);
CREATE INDEX IF NOT EXISTS idx_nail_cases_uses_insole   ON nail_cases (uses_insole);

-- ============================================================
-- 既存データの移行（health_data / nail_condition から）
-- ============================================================
UPDATE nail_cases SET
  sport            = (health_data->>'sport'),
  age              = NULLIF(health_data->>'age', '')::integer,
  gender           = (health_data->>'gender'),
  curved_nail      = (health_data->>'curved_nail'),
  hallux_valgus    = (health_data->>'hallux_valgus'),
  toe_grip         = NULLIF(health_data->>'toe_grip', '')::integer,
  grip_confidence  = NULLIF(health_data->>'grip_confidence', '')::integer,
  balance          = NULLIF(health_data->>'balance', '')::integer,
  ankle_sprain     = (health_data->>'ankle_sprain'),
  nail_score       = NULLIF(nail_condition->>'nail_score', '')::integer,
  quiz_score       = NULLIF(nail_condition->>'quiz_score', '')::integer,
  nail_findings    = COALESCE(nail_condition->'nail_findings', '[]'::jsonb)
WHERE health_data IS NOT NULL;
