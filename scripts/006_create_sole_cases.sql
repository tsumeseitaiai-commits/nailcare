-- 足裏診断データ専用テーブル
-- nail_cases から分離して sole_cases に保存する

CREATE TABLE IF NOT EXISTS sole_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  locale TEXT DEFAULT 'ja',
  model_version TEXT,
  image_url TEXT,
  image_path TEXT,
  user_consent BOOLEAN DEFAULT true,

  -- 問診フィールド
  heel_severity TEXT,    -- mild / moderate / severe
  heel_moisture TEXT,    -- daily / weekly / rarely
  heel_footwear TEXT,    -- heels / flats / sneakers / barefoot
  heel_standing TEXT,    -- under2 / 2to5 / over5

  -- 診断結果
  health_score INTEGER,
  sole_score INTEGER,
  context_score INTEGER,
  sole_findings JSONB DEFAULT '[]',
  detected_issues JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  self_care_steps JSONB DEFAULT '[]',
  practitioner_points JSONB DEFAULT '[]',
  severity TEXT,
  ai_diagnosis TEXT,

  health_data JSONB DEFAULT '{}',
  messages_count INTEGER
);

-- conversation_logs に sole_case_id カラムを追加
ALTER TABLE conversation_logs
  ADD COLUMN IF NOT EXISTS sole_case_id UUID REFERENCES sole_cases(id) ON DELETE CASCADE;

-- インデックス
CREATE INDEX IF NOT EXISTS idx_sole_cases_created_at ON sole_cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_logs_sole_case_id ON conversation_logs(sole_case_id);

-- RLS ポリシー（nail_cases と同様の設定）
ALTER TABLE sole_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do everything on sole_cases"
  ON sole_cases FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
