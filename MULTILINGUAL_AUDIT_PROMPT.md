# マルチリンガル監査 Claude Code プロンプト

以下をそのままClaude Codeに貼り付けて実行してください。

---

```
You are auditing a Next.js multilingual app that uses next-intl.
The app supports 3 locales: ja (Japanese), en (English), ar (Arabic).

Translation files are in /messages/ja.json, /messages/en.json, /messages/ar.json
Pages are under /app/[locale]/

Please perform the following audit and output a detailed report:

## Task 1: Translation Key Parity
Compare all three JSON files (ja.json, en.json, ar.json) and find:
- Keys that exist in ja.json but are MISSING in en.json or ar.json
- Keys that exist in en.json or ar.json but are MISSING in ja.json
- Keys where the value is still in Japanese inside en.json or ar.json (untranslated)
- Keys where the value is an empty string ""

List every discrepancy with the exact key path (e.g. "home.hero.title").

## Task 2: Hardcoded Japanese Strings in Page/Component Files
Search all .tsx and .ts files under /app/[locale]/ and /components/ for:
- Hardcoded Japanese text (hiragana, katakana, kanji) that is NOT using the t() translation function
- Japanese strings passed directly as props (e.g. placeholder="日本語")
- Japanese strings in const arrays or objects that should be in translation files

For each finding, output:
- File path and line number
- The hardcoded string
- Suggested translation key name

## Task 3: Page Coverage Check
For each page under /app/[locale]/, check:
- Does the page import and use `useTranslations` from next-intl?
- Does the page have corresponding keys in ALL THREE translation files?
- Are the locale-specific routes working (i.e. does the page use `[locale]` routing correctly)?

Pages to check:
- /app/[locale]/page.tsx (home)
- /app/[locale]/ai-diagnosis/page.tsx
- /app/[locale]/about/page.tsx (if exists)
- /app/[locale]/nail-seitai/page.tsx (if exists)
- /app/[locale]/benefits/page.tsx (if exists)
- /app/[locale]/contact/page.tsx (if exists)

## Task 4: Specific Issues to Look For
1. In /app/[locale]/ai-diagnosis/page.tsx, the following arrays are hardcoded in Japanese - check if they need to be translated for en/ar users:
   - SPORTS_LIST array
   - PAIN_AREAS array
   - CALLUS_LOCATIONS array
   - All ChoiceButtons options (練習頻度, 利き足, etc.)
   - Quiz question titles (Q1〜Q10 headings)
   - Navigation button labels (次へ, 戻る, 問診完了)

2. Check /components/Header.tsx and /components/Footer.tsx for any hardcoded Japanese

3. Check if the Arabic locale (ar) has RTL (right-to-left) support configured in layout.tsx

## Task 5: RTL Support for Arabic
Check /app/[locale]/layout.tsx:
- Is `dir="rtl"` being set dynamically based on locale?
- Is the `lang` attribute on <html> being set correctly?
- Are there any CSS issues that would break RTL layout?

## Output Format
Please output a structured report with:

### ✅ PASSING
List what is correctly implemented

### ❌ CRITICAL ISSUES  
Must fix - broken functionality for non-Japanese users

### ⚠️ WARNINGS
Should fix - poor UX for non-Japanese users (hardcoded JP text visible to EN/AR users)

### 📋 TODO LIST
Prioritized list of fixes needed, with file paths and specific changes required

At the end, provide an overall multilingual readiness score:
- ja (Japanese): X/10
- en (English): X/10  
- ar (Arabic): X/10
```
