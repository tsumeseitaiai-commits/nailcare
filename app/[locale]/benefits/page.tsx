import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type IntroCard = { icon: string; title: string; desc: string };
type SportCard = { icon: string; title: string; description: string; featured: boolean };
type CareCard = { icon: string; title: string; desc: string };

export default async function BenefitsPage() {
  const t = await getTranslations('benefits');

  const introCards = t.raw('intro.cards') as IntroCard[];
  const sportCards = t.raw('sports.cards') as SportCard[];
  const careCards = t.raw('care.cards') as CareCard[];
  const negativeFlow = t.raw('mechanism.negativeFlow') as string[];
  const positiveFlow = t.raw('mechanism.positiveFlow') as string[];

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
              {t('hero.badge')}
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {t('hero.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              {t('hero.subtitle')}
            </p>
          </div>
        </section>

        {/* ===== Section 1: 爪整体とは？ ===== */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                {t('intro.badge')}
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{t('intro.title')}</h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
                {t('intro.description')}
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
                {t('sports.badge')}
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t('sports.title')}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
                {t('sports.subtitle')}
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
                      {t('sports.featuredLabel')}
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

        {/* ===== Section 3: 連鎖メカニズム ===== */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                {t('mechanism.badge')}
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t('mechanism.title')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
                {t('mechanism.subtitle')}
              </p>
            </div>

            <div className="mt-14 space-y-10">
              {/* 悪化の連鎖 */}
              <div>
                <p className="mb-5 text-center text-sm font-semibold text-red-600">
                  {t('mechanism.negativeLabel')}
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
                <span className="text-xs text-muted-foreground font-medium">
                  {t('mechanism.dividerLabel')}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* 改善の連鎖 */}
              <div>
                <p className="mb-5 text-center text-sm font-semibold text-emerald-600">
                  {t('mechanism.positiveLabel')}
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
                {t('care.badge')}
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t('care.title')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
                {t('care.subtitle')}
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
              {t('cta.badge')}
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">{t('cta.title')}</h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">{t('cta.description')}</p>
            <div className="mt-10">
              <Link
                href="/ai-diagnosis"
                className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-all hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              >
                {t('cta.button')}
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
