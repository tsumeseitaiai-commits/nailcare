# 技術スタック詳細 / Tech Stack Details

爪ケアAI診断サイトの技術選定理由と実装方針

## 🏗️ アーキテクチャ概要

```
[クライアント]
    ↓
[Next.js 14 (App Router)]
    ↓
[Claude API] ← AI画像診断
    ↓
[Vercel (Hosting)]
```

---

## 🎯 コア技術

### 1. Next.js 14.2.22
**選定理由:**
- ✅ Y:\cavaportal\site で使用経験あり
- ✅ App Router で最新の機能を活用
- ✅ 画像最適化が標準搭載
- ✅ ビルトインの i18n サポート
- ✅ Vercel との親和性が高い

**使用機能:**
- App Router (app/ ディレクトリ構造)
- Server Components
- Client Components
- Image Optimization
- Metadata API (SEO)

**ディレクトリ構造:**
```
app/
├── [locale]/              # 言語別ルーティング
│   ├── page.tsx          # トップページ
│   ├── about/            # 爪ケアについて
│   ├── nail-seitai/      # 爪整体について
│   ├── ai-diagnosis/     # AI診断
│   └── contact/          # お問い合わせ
├── api/
│   └── diagnose/         # AI診断APIエンドポイント
└── layout.tsx            # グローバルレイアウト
```

---

### 2. TypeScript 5.7
**選定理由:**
- ✅ 型安全性によるバグ削減
- ✅ VSCodeとの連携が優秀
- ✅ cavaportalとの一貫性

**設定方針:**
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "preserve",
    "moduleResolution": "bundler"
  }
}
```

---

### 3. Tailwind CSS 3.4
**選定理由:**
- ✅ 高速開発が可能
- ✅ レスポンシブ対応が簡単
- ✅ カスタムカラー定義が容易
- ✅ cavaportalでの実績あり

**カスタム設定:**
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#2C5F2D',
        secondary: '#97BC62',
        accent: '#FF6B6B',
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'Roboto', 'Noto Sans Arabic', 'sans-serif'],
      },
    },
  },
}
```

---

## 🤖 AI統合

### Anthropic Claude API
**選定理由:**
- ✅ 画像分析能力が高い
- ✅ 日本語対応が優秀
- ✅ レスポンスが自然
- ✅ Vision機能で爪の画像分析が可能

**使用モデル:**
- `claude-sonnet-4-5-20250929` (推奨)
- または `claude-opus-4-5-20251101` (高精度が必要な場合)

**実装例:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function diagnoseNail(imageBase64: string) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: '爪の画像を分析して、健康状態と改善アドバイスを提供してください。',
          },
        ],
      },
    ],
  });
  
  return response.content[0].text;
}
```

**API料金 (参考):**
- Input: $3.00 / 1M tokens
- Output: $15.00 / 1M tokens
- 画像: 1枚あたり約1,600 tokens

---

## 🌐 多言語化

### next-intl (推奨)
**選定理由:**
- ✅ App Router 完全対応
- ✅ 型安全な翻訳
- ✅ 動的ルーティング対応

**実装方針:**
```typescript
// i18n.ts
export const locales = ['ja', 'en', 'ar'] as const;
export const defaultLocale = 'ja' as const;

// messages/ja.json
{
  "home": {
    "title": "爪ケアで健康をサポート",
    "description": "AI診断で爪の状態をチェック"
  }
}

// messages/en.json
{
  "home": {
    "title": "Support Health with Nail Care",
    "description": "Check nail condition with AI diagnosis"
  }
}

// messages/ar.json
{
  "home": {
    "title": "دعم الصحة بالعناية بالأظافر",
    "description": "فحص حالة الأظافر بتشخيص الذكاء الاصطناعي"
  }
}
```

**RTL対応 (アラビア語):**
```typescript
// layout.tsx
export default function RootLayout({ 
  children, 
  params: { locale } 
}) {
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  
  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
```

---

## 🎨 UIライブラリ

### 基本方針
- **コンポーネント**: 自作 + Tailwind CSS
- **アイコン**: Lucide React (cavaportalと同じ)
- **アニメーション**: Framer Motion (必要に応じて)

**理由:**
- ❌ Radix UI など重いライブラリは避ける（無料プラン制約）
- ✅ シンプルな構成で軽量化
- ✅ 必要最小限の依存関係

---

## 📦 パッケージ構成

### 必須パッケージ
```json
{
  "dependencies": {
    "next": "^14.2.22",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@anthropic-ai/sdk": "^0.35.0",
    "next-intl": "^3.20.0",
    "lucide-react": "^0.564.0"
  },
  "devDependencies": {
    "typescript": "^5.7.3",
    "tailwindcss": "^3.4.18",
    "@types/react": "^18.3.18",
    "@types/node": "^22.10.5"
  }
}
```

### 追加検討パッケージ
```json
{
  "dependencies": {
    "jspdf": "^2.5.2",              // PDF生成
    "react-dropzone": "^14.3.5"     // ファイルアップロード
  }
}
```

---

## 🚀 デプロイ

### Vercel (推奨)
**無料プランの制約:**
- ビルド時間: 6,000分/月
- 帯域幅: 100GB/月
- 関数実行: 100GB-時間/月

**環境変数:**
```bash
ANTHROPIC_API_KEY=sk-ant-xxxxx
NEXT_PUBLIC_SITE_URL=https://yoursite.vercel.app
```

**デプロイコマンド:**
```bash
# GitHub連携の場合
git push origin main  # 自動デプロイ

# 手動の場合
npx vercel --prod
```

---

## 🔐 セキュリティ

### API Key管理
- ✅ 環境変数で管理 (.env.local)
- ✅ クライアントサイドには露出させない
- ✅ API RouteでProxy化

### 画像アップロード
- ✅ ファイルサイズ制限: 5MB
- ✅ MIME Type検証: image/jpeg, image/png のみ
- ✅ 診断後は画像を削除（保存しない）

---

## 📊 パフォーマンス目標

- Lighthouse Score: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Largest Contentful Paint: < 2.5s

**最適化手法:**
- Next.js Image による自動最適化
- フォントのサブセット化
- 必要最小限のJavaScript
- Code Splitting

---

## 🔄 代替案 (検討済み・不採用)

### Astro
- ❌ cavaportalとの技術スタック差異
- ❌ AI APIとの連携が複雑

### HTML + バニラJS
- ❌ 多言語化が手動で煩雑
- ❌ ルーティング管理が困難
- ❌ 画像最適化を手動で実装

---

## 📚 参考リソース

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Anthropic Claude API Docs](https://docs.anthropic.com/)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Tailwind CSS RTL Support](https://tailwindcss.com/docs/rtl-support)
