-- ============================================================
-- 既存データ移行：health_data JSONB → フラットカラム
-- Supabase Dashboard > SQL Editor で実行
-- ============================================================

UPDATE nail_cases SET
  sport            = COALESCE(sport, health_data->>'sport'),
  age              = COALESCE(age,   NULLIF(health_data->>'age', '')::integer),
  gender           = COALESCE(gender, health_data->>'gender'),
  curved_nail      = COALESCE(curved_nail, health_data->>'curved_nail'),
  hallux_valgus    = COALESCE(hallux_valgus, health_data->>'hallux_valgus'),
  toe_grip         = COALESCE(toe_grip,        NULLIF(health_data->>'toe_grip', '')::integer),
  grip_confidence  = COALESCE(grip_confidence, NULLIF(health_data->>'grip_confidence', '')::integer),
  balance          = COALESCE(balance,         NULLIF(health_data->>'balance', '')::integer),
  ankle_sprain     = COALESCE(ankle_sprain, health_data->>'ankle_sprain'),
  nail_score       = COALESCE(nail_score,  NULLIF(nail_condition->>'nail_score', '')::integer),
  quiz_score       = COALESCE(quiz_score,  NULLIF(nail_condition->>'quiz_score', '')::integer),
  nail_findings    = COALESCE(nail_findings, nail_condition->'nail_findings', '[]'::jsonb)
WHERE health_data IS NOT NULL
  AND health_data != '{}'::jsonb;

-- 確認クエリ（実行後にデータが入ったか確認）
SELECT id, sport, age, toe_grip, balance, nail_score, quiz_score
FROM nail_cases
ORDER BY created_at DESC
LIMIT 10;
