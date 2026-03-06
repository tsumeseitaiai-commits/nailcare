-- research_cases テーブル作成
CREATE TABLE IF NOT EXISTS research_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  locale TEXT DEFAULT 'ja',

  -- 基本情報
  age INTEGER,
  gender TEXT,
  height NUMERIC(5,1),
  weight NUMERIC(5,1),
  country TEXT,
  sport TEXT,

  -- 競技情報
  position TEXT,
  dominant_hand TEXT,
  dominant_foot TEXT,
  sports_history NUMERIC(4,1),

  -- トレーニング
  weekly_sessions TEXT,
  session_duration TEXT,
  monthly_matches INTEGER,
  training_intensity INTEGER,
  weekly_rest_days INTEGER,

  -- コンディション
  fatigue_level INTEGER,
  sleep_hours NUMERIC(3,1),
  sleep_quality INTEGER,
  stress_level INTEGER,
  body_pain TEXT,

  -- 爪・足の状態
  nail_cut_frequency TEXT,
  days_before_match TEXT,
  deep_nail_habit TEXT,
  toe_grip_sense INTEGER,
  hallux_valgus TEXT,
  toe_pain INTEGER,

  -- ケガ歴
  injury_count_year INTEGER,
  major_injury_site TEXT,
  recovery_period TEXT,
  injury_recurrence TEXT,

  -- 画像パス (JSON array of {type, path, url})
  images JSONB DEFAULT '[]',

  -- メタ
  user_consent BOOLEAN DEFAULT true,
  image_count INTEGER DEFAULT 0
);

-- RLS (nail_cases と同じパターン)
ALTER TABLE research_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon insert research_cases" ON research_cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select research_cases" ON research_cases FOR SELECT USING (true);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_research_cases_created_at ON research_cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_research_cases_sport ON research_cases(sport);
CREATE INDEX IF NOT EXISTS idx_research_cases_gender ON research_cases(gender);
CREATE INDEX IF NOT EXISTS idx_research_cases_age ON research_cases(age);
CREATE INDEX IF NOT EXISTS idx_research_cases_country ON research_cases(country);
CREATE INDEX IF NOT EXISTS idx_research_cases_hallux_valgus ON research_cases(hallux_valgus);
CREATE INDEX IF NOT EXISTS idx_research_cases_major_injury_site ON research_cases(major_injury_site);
CREATE INDEX IF NOT EXISTS idx_research_cases_fatigue_level ON research_cases(fatigue_level);
CREATE INDEX IF NOT EXISTS idx_research_cases_toe_grip_sense ON research_cases(toe_grip_sense);
