# 爪ケアAI診断サイト / Nail Care AI Diagnosis Site

多言語対応（日本語・英語・アラビア語）の爪ケア情報提供とAI診断サービスを提供するWebサイト

## 🎯 プロジェクト概要

### 目的
- 爪ケアに関する情報提供
- AI画像診断による爪の健康状態チェック
- 3言語対応でグローバル展開

### ターゲット言語
- 🇯🇵 日本語 (ja) - デフォルト
- 🇬🇧 英語 (en)
- 🇸🇦 アラビア語 (ar) - RTL対応必須

### 主要機能
1. **情報提供**
   - 爪ケアの重要性
   - 爪整体の説明
   - スポーツパフォーマンスとの関連

2. **AI診断サービス**
   - 爪の写真アップロード
   - Claude API による画像分析
   - 改善アドバイス提供
   - 診断結果のPDFダウンロード

3. **多言語対応**
   - 言語切替機能
   - ブラウザ言語自動検出
   - localStorage による設定保存

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **AI**: Anthropic Claude API (画像分析)
- **デプロイ**: Vercel (無料プラン想定)

詳細は [TECH_STACK.md](./TECH_STACK.md) を参照

## 📁 プロジェクト構成

```
Y:\nail\
├── README.md                 # このファイル
├── TECH_STACK.md            # 技術スタック詳細
├── AI_DIAGNOSIS_SPEC.md     # AI診断機能仕様
├── wireframe.html           # ワイヤーフレーム（既存）
├── site-structure.md        # サイト構造（既存）
└── (Next.jsプロジェクトファイル - これから作成)
```

## 🚀 開発フロー

### フェーズ1: 環境構築
```bash
cd Y:\nail
npx create-next-app@latest . --typescript --tailwind --app
```

### フェーズ2: 基本ページ作成
- トップページ
- About（爪ケアについて）
- Nail Seitai（爪整体について）
- AI診断ページ

### フェーズ3: 多言語化実装
- next-intl または App Router i18n
- 言語切替UI
- 翻訳ファイル整備

### フェーズ4: AI診断機能実装
- Claude API統合
- 画像アップロード機能
- 診断結果表示
- PDF生成

### フェーズ5: デプロイ
- Vercel連携
- 環境変数設定
- 本番公開

## 🎨 デザインコンセプト

### カラーパレット
- **Primary**: `#2C5F2D` (深緑 - 自然・健康)
- **Secondary**: `#97BC62` (ライトグリーン - 成長)
- **Accent**: `#FF6B6B` (コーラル - 注目)
- **Background**: `#FFFFFF` (白 - 清潔感)
- **Text**: `#333333` (ダークグレー)

### フォント
- 日本語: Noto Sans JP
- 英語: Roboto
- アラビア語: Noto Sans Arabic

### レスポンシブ対応
- Mobile-first設計
- ブレークポイント: 640px / 768px / 1024px / 1280px

## 📋 TODO

### 優先度: 高
- [ ] Next.jsプロジェクト初期化
- [ ] 基本レイアウト作成
- [ ] 多言語化設定
- [ ] Claude API連携テスト

### 優先度: 中
- [ ] AI診断UI実装
- [ ] 画像アップロード機能
- [ ] 診断結果表示
- [ ] PDF生成機能

### 優先度: 低
- [ ] SEO最適化
- [ ] OGP画像設定
- [ ] アニメーション追加
- [ ] パフォーマンス最適化

## 📞 参考プロジェクト

- **Y:\cavaportal\site** - Next.js + TypeScript + Tailwind CSS の実装例
  - 認証: NextAuth.js
  - DB: Supabase
  - AI: Google Generative AI
  - その他: LINE Bot SDK

## 🔗 関連リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Vercel Deployment](https://vercel.com/docs)

## 📝 メモ

- 予算制約: 無料プランでの運用を想定
- AI診断は従来型の爪整体サービスの代替ではなく、補助ツールとして位置付け
- プライバシー配慮: アップロード画像は診断後削除、個人情報は保存しない
