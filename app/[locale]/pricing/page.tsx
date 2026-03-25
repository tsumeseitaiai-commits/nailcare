import { Link } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ─── データ定義 ───────────────────────────────────────────

const FREE_FEATURES = [
  'AI診断: 月1回',
  '基本的な爪・足スコア表示',
  '怪我リスク可視化（基本）',
  '診断レポート（テキスト）',
];

const STANDARD_FEATURES = [
  'AI診断: 月4回（週1回）',
  '詳細スコア + トレンドグラフ',
  '競技別改善プログラム',
  '試合スケジュール管理（1件）',
  'メールサポート',
];

const PREMIUM_FEATURES = [
  'AI診断: 毎日チェック可能',
  '全機能フルアクセス',
  '試合スケジュール管理（無制限）',
  '怪我リハビリスケジュール',
  'AIコーチング（相談し放題）',
  'パフォーマンス変化グラフ（詳細）',
  'チーム導入相談対応',
  '優先サポート',
];

// ─── 比較表データ ─────────────────────────────────────────

type CellValue = string | boolean;

const COMPARISON_FEATURES: {
  label: string;
  free: CellValue;
  standard: CellValue;
  premium: CellValue;
}[] = [
  { label: 'AI診断回数',           free: '月1回',   standard: '月4回',   premium: '毎日'      },
  { label: '爪・足スコア表示',      free: '基本',    standard: '詳細',    premium: '詳細'      },
  { label: '怪我リスク可視化',      free: '基本',    standard: '詳細',    premium: '詳細'      },
  { label: 'トレンドグラフ',        free: false,     standard: true,      premium: true        },
  { label: '競技別改善プログラム',  free: false,     standard: true,      premium: true        },
  { label: '試合スケジュール管理',  free: false,     standard: '1件',     premium: '無制限'    },
  { label: '怪我リハビリスケジュール', free: false,  standard: false,     premium: true        },
  { label: 'AIコーチング',          free: false,     standard: false,     premium: true        },
  { label: 'パフォーマンス変化グラフ', free: false,  standard: false,     premium: '詳細'      },
  { label: 'チーム導入相談',        free: false,     standard: false,     premium: true        },
  { label: 'サポート',              free: false,     standard: 'メール',  premium: '優先'      },
];

const FAQS = [
  {
    q: 'いつでもキャンセルできますか？',
    a: 'はい、月単位でいつでも解約いただけます。解約後は当月末まで引き続きご利用いただけます。',
  },
  {
    q: '無料プランからアップグレードできますか？',
    a: 'はい、いつでもプランを変更いただけます。アップグレード後は即日新しいプランが適用されます。',
  },
  {
    q: 'チーム導入の場合はどうすればよいですか？',
    a: 'チーム・法人でのご利用はお問い合わせください。人数や用途に合わせた特別プランをご提案いたします。',
  },
  {
    q: '支払い方法は何に対応していますか？',
    a: '現在はクレジットカード（Visa / Mastercard / JCB）に対応しています。その他の決済方法は順次対応予定です。',
  },
];

// ─── ヘルパー ─────────────────────────────────────────────

function CellIcon({ value }: { value: CellValue }) {
  if (typeof value === 'boolean') {
    return value ? (
      <span className="text-emerald-500 font-bold text-lg">○</span>
    ) : (
      <span className="text-gray-300 font-bold text-lg">×</span>
    );
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>;
}

// ─── ページ本体 ───────────────────────────────────────────

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">

        {/* ===== Hero ===== */}
        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
              PRICING
            </p>
            <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              料金プラン
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              無料から始められます。<br className="hidden sm:inline" />
              本格的なパフォーマンス改善はスタンダード・プレミアムで。
            </p>
          </div>
        </section>

        {/* ===== Pricing Cards ===== */}
        <section className="bg-gray-50 pb-24 pt-2 sm:pb-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-3">

              {/* 無料プラン */}
              <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  FREE
                </p>
                <h2 className="mt-2 text-2xl font-bold text-foreground">無料プラン</h2>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-foreground">¥0</span>
                  <span className="mb-1 text-sm text-gray-400">/月</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">まずは気軽にお試しください</p>

                <ul className="mt-8 flex-1 space-y-3">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/ai-diagnosis"
                  className="mt-10 inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-gray-50 hover:-translate-y-0.5 active:translate-y-0"
                >
                  無料で始める
                </Link>
              </div>

              {/* スタンダードプラン */}
              <div className="flex flex-col rounded-2xl border border-blue-200 bg-white p-8 shadow-sm ring-1 ring-blue-100">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
                  STANDARD
                </p>
                <h2 className="mt-2 text-2xl font-bold text-foreground">スタンダード</h2>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-foreground">¥980</span>
                  <span className="mb-1 text-sm text-gray-400">/月</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">週1回の定期チェックに最適</p>

                <ul className="mt-8 flex-1 space-y-3">
                  {STANDARD_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="mt-0.5 text-blue-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/ai-diagnosis"
                  className="mt-10 inline-flex items-center justify-center rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-600 hover:-translate-y-0.5 active:translate-y-0 shadow-md"
                >
                  スタンダードを始める
                </Link>
              </div>

              {/* プレミアムプラン */}
              <div className="relative flex flex-col rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-8 text-white shadow-xl">
                {/* おすすめバッジ */}
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-amber-900 shadow">
                  ★ おすすめ
                </span>

                <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                  PREMIUM
                </p>
                <h2 className="mt-2 text-2xl font-bold">プレミアム</h2>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-extrabold">¥2,980</span>
                  <span className="mb-1 text-sm text-blue-200">/月</span>
                </div>
                <p className="mt-2 text-sm text-blue-200">本気で結果を出したい方へ</p>

                <ul className="mt-8 flex-1 space-y-3">
                  {PREMIUM_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white">
                      <span className="mt-0.5 text-amber-300">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/ai-diagnosis"
                  className="mt-10 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 transition-all hover:bg-blue-50 hover:-translate-y-0.5 active:translate-y-0 shadow-md"
                >
                  プレミアムを始める
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* ===== Feature Comparison Table ===== */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                COMPARE
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                プラン比較表
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
                各プランの機能を一覧で確認できます
              </p>
            </div>

            <div className="mt-12 overflow-x-auto rounded-2xl border border-border shadow-sm">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      機能
                    </th>
                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
                      無料
                    </th>
                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-blue-500">
                      スタンダード
                    </th>
                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-indigo-600">
                      プレミアム
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {COMPARISON_FEATURES.map((row) => (
                    <tr key={row.label} className="transition-colors hover:bg-gray-50/60">
                      <td className="px-5 py-4 font-medium text-foreground">{row.label}</td>
                      <td className="px-5 py-4 text-center">
                        <CellIcon value={row.free} />
                      </td>
                      <td className="px-5 py-4 text-center">
                        <CellIcon value={row.standard} />
                      </td>
                      <td className="px-5 py-4 text-center">
                        <CellIcon value={row.premium} />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border bg-gray-50">
                    <td className="px-5 py-4 text-xs font-semibold text-gray-400">月額</td>
                    <td className="px-5 py-4 text-center text-sm font-bold text-foreground">¥0</td>
                    <td className="px-5 py-4 text-center text-sm font-bold text-blue-600">¥980</td>
                    <td className="px-5 py-4 text-center text-sm font-bold text-indigo-600">¥2,980</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="bg-gray-50 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                FAQ
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                よくあるご質問
              </h2>
            </div>

            <dl className="mt-12 space-y-4">
              {FAQS.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-xl border border-border bg-white p-6 shadow-sm"
                >
                  <dt className="flex items-start gap-3 text-base font-semibold text-foreground">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      Q
                    </span>
                    {faq.q}
                  </dt>
                  <dd className="mt-3 flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                      A
                    </span>
                    {faq.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent py-24 text-white sm:py-32">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="absolute -top-32 -end-32 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />

          <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/50">
              GET STARTED
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              まずは無料で試してみましょう
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              登録不要・クレジットカード不要。AI診断を今すぐ体験できます。
            </p>
            <div className="mt-10">
              <Link
                href="/ai-diagnosis"
                className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-all hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              >
                まずは無料で試す
                <svg
                  className="ms-2 h-4 w-4 rtl:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
