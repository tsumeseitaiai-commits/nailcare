# AI診断機能仕様 / AI Diagnosis Specification

Claude APIを使用した爪の画像診断機能の詳細仕様

## 🎯 機能概要

ユーザーが爪の写真をアップロードすると、Claude APIが画像を分析し、健康状態の評価と改善アドバイスを提供する。

---

## 📋 ユーザーフロー

```
1. AI診断ページにアクセス
   ↓
2. 撮影ガイドラインを確認
   ↓
3. 爪の写真をアップロード (ドラッグ&ドロップ or ファイル選択)
   ↓
4. プライバシーポリシーに同意
   ↓
5. 「診断開始」ボタンをクリック
   ↓
6. ローディング表示 (分析中...)
   ↓
7. 診断結果を表示
   - 健康スコア (0-100)
   - 検出された問題点
   - 改善アドバイス
   ↓
8. PDF形式でダウンロード可能
```

---

## 🖼️ 画像アップロード仕様

### アップロード方法
- ドラッグ&ドロップ
- ファイル選択ダイアログ
- モバイル: カメラ直接撮影

### ファイル制約
```typescript
const uploadConstraints = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  minWidth: 800,             // 最低800px
  minHeight: 600,            // 最低600px
  aspectRatio: null,         // 制約なし
};
```

### バリデーション
```typescript
function validateImage(file: File): string | null {
  // ファイルサイズチェック
  if (file.size > 5 * 1024 * 1024) {
    return 'ファイルサイズは5MB以下にしてください';
  }
  
  // MIME Typeチェック
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return '対応形式: JPEG, PNG, WebP';
  }
  
  return null; // バリデーション成功
}
```

---

## 📸 撮影ガイドライン

### ユーザー向け表示内容
```
✅ 良い撮影方法:
- 明るい場所で撮影
- 爪全体が写るように
- ピントを合わせる
- 自然光が推奨

❌ 避けるべき撮影:
- 暗い場所
- ブレた画像
- 爪の一部だけ
- フィルター加工済み画像
```

### 実装例
```tsx
<div className="bg-blue-50 p-4 rounded-lg mb-4">
  <h3 className="font-bold mb-2">📸 撮影ガイドライン</h3>
  <ul className="space-y-1 text-sm">
    <li>✅ 明るい場所で撮影してください</li>
    <li>✅ 爪全体が写るように撮影してください</li>
    <li>✅ ピントを合わせてください</li>
    <li>❌ フィルター加工は避けてください</li>
  </ul>
</div>
```

---

## 🤖 Claude API連携

### API呼び出し仕様

**エンドポイント:**
```
POST /api/diagnose
```

**リクエスト:**
```typescript
interface DiagnoseRequest {
  image: string;      // Base64エンコードされた画像
  locale: 'ja' | 'en' | 'ar';  // 言語設定
}
```

**レスポンス:**
```typescript
interface DiagnoseResponse {
  success: boolean;
  result?: {
    healthScore: number;          // 0-100
    detectedIssues: string[];     // 検出された問題点
    recommendations: string[];    // 改善アドバイス
    analysis: string;             // 詳細分析テキスト
  };
  error?: string;
}
```

---

## 💬 Claude APIプロンプト設計

### システムプロンプト (日本語)
```typescript
const systemPrompt = `
あなたは爪の健康状態を分析する専門家です。
アップロードされた爪の画像を分析し、以下の形式でJSON形式の回答を提供してください:

{
  "healthScore": 85,
  "detectedIssues": [
    "軽度の乾燥が見られます",
    "爪の表面に細かい縦線があります"
  ],
  "recommendations": [
    "保湿クリームを毎日塗布してください",
    "ビタミンEを含む食品を摂取することをおすすめします",
    "爪切りは爪やすりの使用を検討してください"
  ],
  "analysis": "全体的に健康な状態ですが、軽度の乾燥と表面の縦線が確認できます..."
}

注意事項:
- 医学的診断は行わないでください
- 深刻な症状が疑われる場合は、医療機関の受診を推奨してください
- 健康スコアは0-100の範囲で評価してください
- 問題点は具体的かつ簡潔に記述してください
- 改善アドバイスは実践可能なものを3-5個提供してください
`;
```

### ユーザープロンプト
```typescript
const userPrompt = `
この爪の画像を分析して、健康状態を評価してください。
JSON形式で回答してください。
`;
```

---

## 📊 診断結果表示

### UI構成

#### 1. 健康スコア表示
```tsx
<div className="relative w-32 h-32 mx-auto">
  <svg className="transform -rotate-90">
    <circle
      cx="64"
      cy="64"
      r="56"
      stroke="#E5E7EB"
      strokeWidth="8"
      fill="none"
    />
    <circle
      cx="64"
      cy="64"
      r="56"
      stroke="#2C5F2D"
      strokeWidth="8"
      fill="none"
      strokeDasharray={`${healthScore * 3.52} 352`}
    />
  </svg>
  <div className="absolute inset-0 flex items-center justify-center">
    <span className="text-3xl font-bold">{healthScore}</span>
  </div>
</div>
```

#### 2. 検出された問題点
```tsx
<div className="space-y-2">
  <h3 className="font-bold">検出された問題点</h3>
  <ul className="space-y-1">
    {detectedIssues.map((issue, i) => (
      <li key={i} className="flex items-start gap-2">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <span>{issue}</span>
      </li>
    ))}
  </ul>
</div>
```

#### 3. 改善アドバイス
```tsx
<div className="space-y-2">
  <h3 className="font-bold">改善アドバイス</h3>
  <ul className="space-y-1">
    {recommendations.map((rec, i) => (
      <li key={i} className="flex items-start gap-2">
        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
        <span>{rec}</span>
      </li>
    ))}
  </ul>
</div>
```

---

## 📄 PDF生成機能

### 実装ライブラリ
```bash
npm install jspdf
```

### PDF内容
```
┌─────────────────────────────────┐
│  爪健康診断レポート               │
│  Nail Health Diagnosis Report   │
├─────────────────────────────────┤
│                                 │
│  診断日: 2026-02-19             │
│                                 │
│  健康スコア: 85 / 100           │
│  ████████████████░░░░           │
│                                 │
│  【検出された問題点】             │
│  • 軽度の乾燥が見られます         │
│  • 爪の表面に細かい縦線があります  │
│                                 │
│  【改善アドバイス】               │
│  • 保湿クリームを毎日塗布         │
│  • ビタミンE含む食品を摂取        │
│  • 爪やすりの使用を検討           │
│                                 │
│  【詳細分析】                    │
│  全体的に健康な状態ですが...      │
│                                 │
└─────────────────────────────────┘
```

### 実装例
```typescript
import jsPDF from 'jspdf';

function generatePDF(result: DiagnoseResult) {
  const doc = new jsPDF();
  
  // タイトル
  doc.setFontSize(18);
  doc.text('爪健康診断レポート', 20, 20);
  
  // 診断日
  doc.setFontSize(12);
  doc.text(`診断日: ${new Date().toLocaleDateString('ja-JP')}`, 20, 35);
  
  // 健康スコア
  doc.text(`健康スコア: ${result.healthScore} / 100`, 20, 50);
  
  // 検出された問題点
  doc.text('【検出された問題点】', 20, 70);
  result.detectedIssues.forEach((issue, i) => {
    doc.text(`• ${issue}`, 25, 80 + i * 10);
  });
  
  // 改善アドバイス
  const yOffset = 80 + result.detectedIssues.length * 10 + 10;
  doc.text('【改善アドバイス】', 20, yOffset);
  result.recommendations.forEach((rec, i) => {
    doc.text(`• ${rec}`, 25, yOffset + 10 + i * 10);
  });
  
  // PDFを保存
  doc.save(`nail-diagnosis-${Date.now()}.pdf`);
}
```

---

## 🔒 プライバシー・セキュリティ

### 画像の取り扱い
```typescript
const privacyPolicy = {
  storage: 'アップロードされた画像は診断後すぐに削除されます',
  retention: '画像は保存されません',
  usage: '診断目的のみに使用されます',
  sharing: '第三者への共有は一切行いません',
};
```

### プライバシー同意UI
```tsx
<label className="flex items-start gap-2 cursor-pointer">
  <input
    type="checkbox"
    checked={agreedToPrivacy}
    onChange={(e) => setAgreedToPrivacy(e.target.checked)}
    className="mt-1"
  />
  <span className="text-sm">
    アップロードした画像は診断後すぐに削除され、保存されないことに同意します
  </span>
</label>
```

---

## ⚠️ エラーハンドリング

### エラーケース

```typescript
enum DiagnoseErrorType {
  INVALID_IMAGE = 'INVALID_IMAGE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

const errorMessages = {
  ja: {
    INVALID_IMAGE: '画像形式が無効です。JPEG、PNG、WebPのみ対応しています。',
    FILE_TOO_LARGE: 'ファイルサイズが大きすぎます。5MB以下にしてください。',
    API_ERROR: '診断中にエラーが発生しました。もう一度お試しください。',
    NETWORK_ERROR: 'ネットワークエラーが発生しました。接続を確認してください。',
    UNKNOWN_ERROR: '予期しないエラーが発生しました。',
  },
  en: {
    INVALID_IMAGE: 'Invalid image format. Only JPEG, PNG, WebP are supported.',
    FILE_TOO_LARGE: 'File size is too large. Please use files under 5MB.',
    API_ERROR: 'An error occurred during diagnosis. Please try again.',
    NETWORK_ERROR: 'Network error occurred. Please check your connection.',
    UNKNOWN_ERROR: 'An unexpected error occurred.',
  },
  ar: {
    INVALID_IMAGE: 'تنسيق الصورة غير صالح. فقط JPEG و PNG و WebP مدعومة.',
    FILE_TOO_LARGE: 'حجم الملف كبير جدًا. يرجى استخدام ملفات أقل من 5 ميجابايت.',
    API_ERROR: 'حدث خطأ أثناء التشخيص. يرجى المحاولة مرة أخرى.',
    NETWORK_ERROR: 'حدث خطأ في الشبكة. يرجى التحقق من اتصالك.',
    UNKNOWN_ERROR: 'حدث خطأ غير متوقع.',
  },
};
```

---

## 🧪 テスト計画

### ユニットテスト
- ファイルバリデーション
- Base64エンコーディング
- エラーハンドリング

### 統合テスト
- API呼び出し
- レスポンスパース
- PDF生成

### E2Eテスト
- 画像アップロード → 診断 → 結果表示
- 多言語対応確認
- エラーシナリオ

---

## 💰 コスト試算

### Claude API利用料金
```
1回の診断あたり:
- 画像: 約1,600 tokens
- プロンプト: 約200 tokens
- レスポンス: 約500 tokens
合計: 約2,300 tokens

コスト:
Input: (1,600 + 200) × $3.00 / 1M = $0.0054
Output: 500 × $15.00 / 1M = $0.0075
合計: 約$0.013 (約2円) / 1診断

月間100診断: 約$1.30 (約200円)
月間1,000診断: 約$13.00 (約2,000円)
```

### Vercel無料プランの制約
- 関数実行時間: 10秒/リクエスト (Hobby)
- Claude APIレスポンス時間: 約3-5秒 → **十分に余裕あり**

---

## 🚀 将来の拡張案

### Phase 2
- 診断履歴の保存 (ユーザーログイン機能)
- 経過観察機能 (複数回の診断を比較)

### Phase 3
- より詳細な分析 (爪の色、形状、表面状態の細分化)
- 爪整体施術所の紹介機能

### Phase 4
- 多言語対応の拡大 (中国語、韓国語など)
- モバイルアプリ化

---

## 📚 参考資料

- [Anthropic Vision API Documentation](https://docs.anthropic.com/claude/docs/vision)
- [jsPDF Documentation](https://artskydj.github.io/jsPDF/docs/)
- [React Dropzone](https://react-dropzone.js.org/)
