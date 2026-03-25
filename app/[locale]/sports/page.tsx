import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type PainPointItem = { icon: string; text: string };
type FeatureItem = { title: string; desc: string; icon: string };
type BenefitItem = { icon: string; title: string; desc: string };
type PricingPlan = { label: string; desc: string; cta: string };

export default async function SportsPage() {
  const t = await getTranslations('sports');

  const painPoints = t.raw('painPoints.items') as PainPointItem[];
  const features = t.raw('features.items') as FeatureItem[];
  const premiumItems = t.raw('premium.items') as string[];
  const benefits = t.raw('benefits.items') as BenefitItem[];
  const pricingFree = t.raw('pricing.free') as PricingPlan;
  const pricingPaid = t.raw('pricing.paid') as PricingPlan;
  const teamItems = t.raw('team.items') as string[];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">

        {/* ===== Hero ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-24 text-white sm:py-32">
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
            <span className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-white/80 backdrop-blur-sm">
              {t('hero.badge')}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {t('hero.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              {t('hero.subtitle')}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/ai-diagnosis"
                className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-bold text-blue-900 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-xl active:translate-y-0"
              >
                {t('hero.cta')}
                <svg className="ms-2 h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10"
              >
                {t('hero.secondary')}
              </a>
            </div>
          </div>
        </section>

        {/* ===== Pain Points ===== */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="mb-12 text-center text-2xl font-bold text-foreground sm:text-3xl">
              {t('painPoints.title')}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {painPoints.map((item) => (
                <div
                  key={item.text}
                  className="flex flex-col items-center gap-3 rounded-xl border border-border bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="text-4xl">{item.icon}</span>
                  <p className="text-sm font-semibold text-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Features ===== */}
        <section id="features" className="bg-muted py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">
                {t('features.badge')}
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t('features.title')}
              </h2>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-white p-6 shadow-sm text-center transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-center">
                    <span className="text-4xl">{item.icon}</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Schedule (NEW) ===== */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-10 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                  {t('schedule.badge')}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                {t('schedule.title')}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {t('schedule.desc')}
              </p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">
                <span>✅</span>
                {t('schedule.cta')}
              </p>
            </div>
          </div>
        </section>

        {/* ===== Rehab (NEW) ===== */}
        <section className="bg-muted py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-10 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                  {t('rehab.badge')}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                {t('rehab.title')}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {t('rehab.desc')}
              </p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white">
                <span>🏃</span>
                {t('rehab.cta')}
              </p>
            </div>
          </div>
        </section>

        {/* ===== Benefits ===== */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="mb-12 text-center text-2xl font-bold text-foreground sm:text-3xl">
              {t('benefits.title')}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 text-3xl">{item.icon}</div>
                  <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Premium (有料機能) ===== */}
        <section className="bg-gradient-to-br from-blue-900 to-indigo-900 py-20 text-white sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-300">
              {t('premium.badge')}
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">{t('premium.title')}</h2>
            <ul className="mt-10 space-y-4">
              {premiumItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/10 px-6 py-4 text-sm font-semibold backdrop-blur-sm"
                >
                  <span className="text-blue-300">✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== Pricing ===== */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">
                {t('pricing.badge')}
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t('pricing.title')}
              </h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {/* 無料プラン */}
              <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {pricingFree.label}
                </p>
                <p className="mt-3 text-lg font-bold text-foreground">{pricingFree.desc}</p>
                <Link
                  href="/ai-diagnosis"
                  className="mt-8 flex w-full items-center justify-center rounded-xl border-2 border-blue-600 px-6 py-3 text-sm font-bold text-blue-600 transition-all hover:bg-blue-50"
                >
                  {pricingFree.cta}
                </Link>
              </div>
              {/* 有料プラン */}
              <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 shadow-lg text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                  {pricingPaid.label}
                </p>
                <p className="mt-3 text-lg font-bold">{pricingPaid.desc}</p>
                <Link
                  href="/ai-diagnosis"
                  className="mt-8 flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 transition-all hover:bg-white/90"
                >
                  {pricingPaid.cta}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Team Plan ===== */}
        <section className="bg-muted py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="rounded-2xl border border-border bg-white p-10 shadow-sm text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">
                {t('team.badge')}
              </p>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                {t('team.title')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
                {t('team.desc')}
              </p>
              <ul className="mt-8 space-y-3 text-start">
                {teamItems.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ===== Final CTA ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-24 text-white sm:py-32">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="absolute -top-32 -end-32 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />

          <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
            <p className="mb-2 text-base font-bold text-white/80">{t('tagline')}</p>
            <p className="mb-8 text-sm text-white/60">{t('taglineDesc')}</p>
            <Link
              href="/ai-diagnosis"
              className="inline-flex items-center justify-center rounded-xl bg-white px-10 py-5 text-base font-bold text-blue-900 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-xl active:translate-y-0"
            >
              {t('ctaFinal')}
              <svg className="ms-2 h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
