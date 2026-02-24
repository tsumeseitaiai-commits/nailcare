# データベース設計 / Database Design

爪整体AI診断サイトのデータベース設計書

---

## 🎯 使用技術

- **Supabase** (PostgreSQL)
- **Supabase Storage** (画像保存)

---

## 📊 テーブル設計

### 1. `nail_cases` - 診断ケーステーブル

AI学習用のデータを蓄積するメインテーブル

```sql
CREATE TABLE nail_cases (
  -- 基本情報
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 画像情報
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,  -- Supabase Storage内のパス
  
  -- 爪の状態（構造化データ）
  nail_condition JSONB NOT NULL,
  /*
  例:
  {
    "dryness": "mild",      // none, mild, moderate, severe
    "vertical_lines": true,
    "horizontal_lines": false,
    "discoloration": "none", // none, yellow, white, brown
    "thickness": "normal",   // thin, normal, thick
    "surface": "smooth",     // smooth, rough, ridged
    "shape": "normal"        // normal, curved, spoon, clubbed
  }
  */
  
  -- 体調データ（構造化データ）
  health_data JSONB,
  /*
  例:
  {
    "sleep": "不足",         // 十分, やや不足, 不足
    "stress": "高",          // 低, 中, 高
    "diet": "偏り",          // バランス良好, やや偏り, 偏り
    "exercise": "不足",      // 十分, やや不足, 不足
    "hydration": "不足"      // 十分, やや不足, 不足
  }
  */
  
  -- AI診断結果
  ai_diagnosis TEXT NOT NULL,
  health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
  
  -- 検出された問題点
  detected_issues TEXT[],
  /*
  例: ['軽度の乾燥', '縦線あり', '表面がやや粗い']
  */
  
  -- 改善アドバイス
  recommendations TEXT[],
  /*
  例: ['保湿クリームを毎日塗布', 'ビタミンE摂取', '十分な睡眠']
  */
  
  -- メタデータ
  model_version TEXT DEFAULT 'gemini-1.5-pro',
  locale TEXT DEFAULT 'ja',  -- ja, en, ar
  user_consent BOOLEAN DEFAULT false,  -- データ使用同意
  
  -- インデックス用
  diagnosis_date DATE GENERATED ALWAYS AS (created_at::DATE) STORED
);

-- インデックス作成
CREATE INDEX idx_nail_cases_created_at ON nail_cases(created_at DESC);
CREATE INDEX idx_nail_cases_health_score ON nail_cases(health_score);
CREATE INDEX idx_nail_cases_nail_condition ON nail_cases USING GIN (nail_condition);
CREATE INDEX idx_nail_cases_health_data ON nail_cases USING GIN (health_data);
CREATE INDEX idx_nail_cases_diagnosis_date ON nail_cases(diagnosis_date);
```

---

### 2. `diagnosis_sessions` - 診断セッションテーブル

ユーザーの診断履歴を追跡（将来的な機能拡張用）

```sql
CREATE TABLE diagnosis_sessions (
  -- 基本情報
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- セッション情報
  session_id TEXT UNIQUE NOT NULL,  -- フロントエンドで生成
  ip_address INET,
  user_agent TEXT,
  
  -- 診断結果へのリンク
  nail_case_id UUID REFERENCES nail_cases(id) ON DELETE SET NULL,
  
  -- 診断完了フラグ
  completed BOOLEAN DEFAULT false,
  
  -- 言語設定
  locale TEXT DEFAULT 'ja'
);

CREATE INDEX idx_diagnosis_sessions_session_id ON diagnosis_sessions(session_id);
CREATE INDEX idx_diagnosis_sessions_created_at ON diagnosis_sessions(created_at DESC);
```

---

### 3. `ai_model_performance` - AIモデルパフォーマンステーブル

AI診断の精度を追跡（将来的な改善用）

```sql
CREATE TABLE ai_model_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- モデル情報
  model_version TEXT NOT NULL,
  
  -- パフォーマンス指標
  average_score DECIMAL(5,2),
  total_diagnoses INTEGER DEFAULT 0,
  
  -- 月次データ
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  
  UNIQUE(model_version, year, month)
);
```

---

### 4. `feedback` - ユーザーフィードバックテーブル

診断結果に対するユーザーの評価（将来的な改善用）

```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 診断ケースへのリンク
  nail_case_id UUID REFERENCES nail_cases(id) ON DELETE CASCADE,
  
  -- フィードバック内容
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  helpful BOOLEAN,
  comment TEXT,
  
  -- メタデータ
  locale TEXT DEFAULT 'ja'
);

CREATE INDEX idx_feedback_nail_case_id ON feedback(nail_case_id);
CREATE INDEX idx_feedback_rating ON feedback(rating);
```

---

## 🗂️ Supabase Storage バケット設計

### `nail-images` バケット

```javascript
// バケット設定
{
  name: 'nail-images',
  public: false,  // プライベート
  fileSizeLimit: 5242880,  // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
}

// ストレージ構造
nail-images/
  ├── cases/
  │   ├── 2026/
  │   │   ├── 02/
  │   │   │   ├── {uuid}.jpg
  │   │   │   └── {uuid}.jpg
  │   │   └── 03/
  │   └── 2027/
  └── thumbnails/  // 将来的にサムネイル用
      └── ...
```

---

## 🔐 Row Level Security (RLS) ポリシー

### `nail_cases` テーブル

```sql
-- RLSを有効化
ALTER TABLE nail_cases ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザーはデータ挿入のみ可能（同意がある場合）
CREATE POLICY "Allow anonymous insert with consent"
ON nail_cases
FOR INSERT
TO anon
WITH CHECK (user_consent = true);

-- 管理者のみ全データ閲覧可能
CREATE POLICY "Allow admin full access"
ON nail_cases
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');
```

### Storage ポリシー

```sql
-- 匿名ユーザーはアップロードのみ可能
CREATE POLICY "Allow anonymous upload"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'nail-images');

-- アップロードした画像の読み取りは24時間のみ許可
CREATE POLICY "Allow temporary read access"
ON storage.objects
FOR SELECT
TO anon
USING (
  bucket_id = 'nail-images' AND
  created_at > NOW() - INTERVAL '24 hours'
);
```

---

## 📈 データ分析用ビュー

### 月次統計ビュー

```sql
CREATE VIEW monthly_diagnosis_stats AS
SELECT
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS total_diagnoses,
  AVG(health_score) AS average_health_score,
  COUNT(CASE WHEN health_score >= 80 THEN 1 END) AS high_score_count,
  COUNT(CASE WHEN health_score < 50 THEN 1 END) AS low_score_count
FROM nail_cases
WHERE user_consent = true
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

### よくある問題点ビュー

```sql
CREATE VIEW common_issues AS
SELECT
  issue,
  COUNT(*) AS occurrence_count,
  ROUND(COUNT(*)::DECIMAL / (SELECT COUNT(*) FROM nail_cases) * 100, 2) AS percentage
FROM nail_cases,
  LATERAL UNNEST(detected_issues) AS issue
WHERE user_consent = true
GROUP BY issue
ORDER BY occurrence_count DESC
LIMIT 20;
```

---

## 🔄 データライフサイクル

### データ保持期間

```sql
-- 同意のないデータは24時間後に削除
CREATE OR REPLACE FUNCTION delete_old_unconsented_data()
RETURNS void AS $$
BEGIN
  DELETE FROM nail_cases
  WHERE user_consent = false
    AND created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- 毎日実行するCron設定（Supabase Edge Functions）
SELECT cron.schedule(
  'delete-old-data',
  '0 2 * * *',  -- 毎日午前2時
  $$SELECT delete_old_unconsented_data()$$
);
```

### 画像ファイルのクリーンアップ

```javascript
// Edge Function: cleanup-orphaned-images
// 参照されていない画像を削除
const { data: orphanedImages } = await supabase
  .storage
  .from('nail-images')
  .list('cases', {
    limit: 1000,
    offset: 0
  });

// nail_casesテーブルに存在しないパスを持つ画像を削除
```

---

## 🚀 初期セットアップSQL

```sql
-- 1. テーブル作成
-- （上記のCREATE TABLE文を実行）

-- 2. RLS有効化
-- （上記のRLSポリシーを実行）

-- 3. Storage バケット作成
INSERT INTO storage.buckets (id, name, public)
VALUES ('nail-images', 'nail-images', false);

-- 4. サンプルデータ挿入（開発用）
INSERT INTO nail_cases (
  image_url,
  image_path,
  nail_condition,
  health_data,
  ai_diagnosis,
  health_score,
  detected_issues,
  recommendations,
  user_consent
) VALUES (
  'https://example.com/sample.jpg',
  'cases/2026/02/sample.jpg',
  '{"dryness": "mild", "vertical_lines": true}',
  '{"sleep": "不足", "stress": "高"}',
  '軽度の乾燥と縦線が確認できます。',
  75,
  ARRAY['軽度の乾燥', '縦線あり'],
  ARRAY['保湿クリーム使用', '十分な睡眠'],
  true
);
```

---

## 📊 推定データ量

### 月間1,000診断の場合

```
テーブルサイズ:
- nail_cases: 約 500KB/月
- diagnosis_sessions: 約 100KB/月
- feedback: 約 50KB/月

ストレージ:
- 画像ファイル: 約 2GB/月（1画像2MB × 1,000件）
```

### 年間予測

```
1年後:
- データベース: 約 8MB
- ストレージ: 約 24GB

5年後:
- データベース: 約 40MB
- ストレージ: 約 120GB
```

**→ Supabase無料プラン（500MB DB + 1GB Storage）では不足**
**→ Pro プラン推奨（$25/月）: 8GB DB + 100GB Storage**

---

## 🔧 Supabaseプロジェクト設定

### 環境変数

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # サーバーサイドのみ
```

### TypeScript型定義

```typescript
// types/database.ts
export interface NailCase {
  id: string;
  created_at: string;
  image_url: string;
  image_path: string;
  nail_condition: {
    dryness: 'none' | 'mild' | 'moderate' | 'severe';
    vertical_lines: boolean;
    horizontal_lines: boolean;
    discoloration: 'none' | 'yellow' | 'white' | 'brown';
    thickness: 'thin' | 'normal' | 'thick';
    surface: 'smooth' | 'rough' | 'ridged';
    shape: 'normal' | 'curved' | 'spoon' | 'clubbed';
  };
  health_data?: {
    sleep: '十分' | 'やや不足' | '不足';
    stress: '低' | '中' | '高';
    diet: 'バランス良好' | 'やや偏り' | '偏り';
    exercise: '十分' | 'やや不足' | '不足';
    hydration: '十分' | 'やや不足' | '不足';
  };
  ai_diagnosis: string;
  health_score: number;
  detected_issues: string[];
  recommendations: string[];
  model_version: string;
  locale: 'ja' | 'en' | 'ar';
  user_consent: boolean;
}
```

---

## 🎯 実装優先順位

### Phase 1: 基本データ保存
1. ✅ Supabaseプロジェクト作成
2. ✅ `nail_cases` テーブル作成
3. ✅ Storage バケット作成
4. ✅ 環境変数設定

### Phase 2: AI診断統合
5. ⏭️ 画像アップロード機能
6. ⏭️ Gemini API診断
7. ⏭️ 診断結果をDBに保存

### Phase 3: データ活用
8. ⏭️ 類似ケース検索機能
9. ⏭️ AI診断精度向上
10. ⏭️ 統計ダッシュボード（管理者用）

---

## 📚 参考リンク

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
