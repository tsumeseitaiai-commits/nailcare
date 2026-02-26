import { Link } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ============================================================
// データ定義
// ============================================================
const introCards = [
  {
    icon: '🦶',
    title: '接地改善',
    desc: '足指が正しく地面に触れることで、踏み込みの安定性と推進力が高まる',
  },
  {
    icon: '🏛️',
    title: '姿勢改善',
    desc: '足底の荷重バランスが整い、骨盤・脊柱の傾きが自然に矯正される',
  },
  {
    icon: '⚡',
    title: '出力向上',
    desc: '筋力が正しく伝わり、瞬発力・持久力が本来のポテンシャルを発揮する',
  },
];

const sportCards = [
  {
    icon: '⚽',
    title: 'サッカー・フットサル',
    description:
      '「蹴る・踏む・方向転換」の全動作は足指の接地から始まる。爪が整うと母趾球への荷重が安定し、瞬発的な加速力と切り返しのキレが向上する。',
    featured: false,
  },
  {
    icon: '🏀',
    title: 'バスケットボール',
    description:
      'ストップ&ゴー、急激な方向転換に足指の安定が不可欠。足底の荷重バランスが整うことでジャンプの踏み切りと着地衝撃の分散が改善する。',
    featured: false,
  },
  {
    icon: '🤼',
    title: '柔道・柔術【重点解説】',
    description:
      '握力に加えて「指力（しりょく）」というステータスが存在する。爪を適切に整えることで指の腹が相手の道着にしっかり食い込み、引き付け・崩し・投げの際の保持力が段違いに向上する。巻き爪や深爪があると指先に力が入らず、握力があっても相手を捕まえきれない状態になる。',
    featured: true,
  },
  {
    icon: '⚾',
    title: '野球・ソフトボール',
    description:
      '投球時の指先感覚・バッティングのグリップが爪の状態に直結。深爪で指先が不安定だと球のリリースポイントがブレ、制球力に影響が出る。',
    featured: false,
  },
  {
    icon: '🏃',
    title: '陸上競技（短距離）',
    description:
      'スタートの踏み込みと加速局面での足指の使い方が勝敗を分ける。爪整体で足指の接地感覚が鋭敏になりスタートダッシュが改善する。',
    featured: false,
  },
  {
    icon: '🎾',
    title: 'テニス・バドミントン',
    description:
      'フットワークの俊敏性は足指グリップが基盤。サーブ・スマッシュ時のラケットグリップにも手の爪の状態が関係する。',
    featured: false,
  },
];

const careCards = [
  {
    icon: '📏',
    title: '爪の長さ',
    desc: '指の先端と同じ長さに揃えること。深爪は足指の安定を失わせるためNG。',
  },
  {
    icon: '✂️',
    title: '切り方',
    desc: '直線カット（スクエアカット）で角を残す。丸く切ると巻き爪のリスクが高まる。',
  },
  {
    icon: '💧',
    title: '保湿',
    desc: '爪の根元と側面の皮膚をクリームやオイルでケア。乾燥は割れ・欠けの原因になる。',
  },
  {
    icon: '🔍',
    title: '確認習慣',
    desc: '週1回、足指の状態を自分でチェック。変色・変形・痛みの早期発見につなげる。',
  },
];

const negativeFlow = ['爪の歪み', '接地エラー', '姿勢・フォームの崩れ', 'パフォーマンス低下'];
const positiveFlow = ['爪を整える', '正しい接地', '姿勢・重心の安定', 'パフォーマンス向上'];

// ============================================================
// メインコンポーネント
// ============================================================
export default function BenefitsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">

        {/* ===== Hero ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light py-24 text-white sm:py-32">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="absolute -top-40 -end-40 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-40 -start-40 h-[400px] w-[400px] rounded-full bg-white/10 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">
              Nail Seitai Benefits
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              爪を整えると、パフォーマンスが変わる
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              足の末端から全身の動きが変わる。爪整体が持つ可能性。
            </p>
          </div>
        </section>

        {/* ===== Section 1: 爪整体とは？ ===== */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                What is Nail Seitai
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">爪整体とは？</h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
                爪の歪みは接地角度・足底圧分布・母趾球の荷重ラインに直接影響します。
                巻き爪・深爪・浮き爪といった爪のトラブルは、姿勢の崩れ・骨盤傾斜・走行フォームの左右差を引き起こします。
                いくら筋力を鍛えても、足先に「入力エラー」が残ると、本来のパフォーマンスを発揮することができません。
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {introCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-border bg-white p-8 shadow-sm text-center transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-center">
                    <span className="text-4xl">{card.icon}</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Section 2: スポーツ別パフォーマンス向上 ===== */}
        <section className="bg-muted py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                Sports Performance
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                スポーツ別パフォーマンス向上
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
                競技の種類によって、爪の状態がパフォーマンスに与える影響は異なります。
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sportCards.map((card) => (
                <div
                  key={card.title}
                  className={`rounded-xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                    card.featured
                      ? 'border-primary/40 ring-1 ring-primary/20'
                      : 'border-border'
                  }`}
                >
                  {card.featured && (
                    <span className="mb-3 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      重点競技
                    </span>
                  )}
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-3xl">{card.icon}</span>
                    <h3 className="text-base font-bold text-foreground">{card.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Section 3: 爪と身体の連鎖メカニズム ===== */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                Mechanism
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                爪と身体の連鎖メカニズム
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
                爪の状態は足先にとどまらず、全身の連鎖として波及します。
              </p>
            </div>

            <div className="mt-14 space-y-10">
              {/* 悪化の連鎖 */}
              <div>
                <p className="mb-5 text-center text-sm font-semibold text-red-600">
                  ❌ 悪化の連鎖
                </p>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-2">
                  {negativeFlow.map((step, i) => (
                    <div key={step} className="flex flex-col items-center gap-2 sm:flex-row sm:gap-2">
                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700 w-full sm:w-auto">
                        {step}
                      </div>
                      {i < negativeFlow.length - 1 && (
                        <>
                          <span className="text-xl font-bold text-red-300 hidden sm:inline">→</span>
                          <span className="text-xl font-bold text-red-300 sm:hidden">↓</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground font-medium">爪整体でケアすると</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* 改善の連鎖 */}
              <div>
                <p className="mb-5 text-center text-sm font-semibold text-emerald-600">
                  ✅ 改善の連鎖
                </p>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-2">
                  {positiveFlow.map((step, i) => (
                    <div key={step} className="flex flex-col items-center gap-2 sm:flex-row sm:gap-2">
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700 w-full sm:w-auto">
                        {step}
                      </div>
                      {i < positiveFlow.length - 1 && (
                        <>
                          <span className="text-xl font-bold text-emerald-300 hidden sm:inline">→</span>
                          <span className="text-xl font-bold text-emerald-300 sm:hidden">↓</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Section 4: 日常ケアのポイント ===== */}
        <section className="bg-gradient-to-br from-primary/5 via-white to-accent/5 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                Daily Care
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                日常ケアのポイント
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
                プロの施術と並行して、日常的なセルフケアが爪の健康を持続させます。
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {careCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 text-3xl">{card.icon}</div>
                  <h3 className="text-base font-bold text-foreground">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
                </div>
              ))}
            </div>
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
              Get Started
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              あなたの爪の状態をAIで診断する
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              爪の写真1枚とかんたんな問診で、あなたの足指・爪の状態と
              パフォーマンスリスクを分析します。
            </p>
            <div className="mt-10">
              <Link
                href="/ai-diagnosis"
                className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-all hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              >
                AI診断を始める
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
