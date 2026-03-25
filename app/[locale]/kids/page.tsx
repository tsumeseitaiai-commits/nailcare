import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type FeatureItem = { title: string; desc: string; icon: string };
type DifferencePoint = { label: string; value: string; positive: boolean };
type TargetItem = { icon: string; text: string };
type PricingCard = { label: string; desc: string; cta: string };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('kids');
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function KidsPage() {
  const t = await getTranslations('kids');

  const featureItems = t.raw('features.items') as FeatureItem[];
  const differencePoints = t.raw('difference.points') as DifferencePoint[];
  const targetItems = t.raw('target.items') as TargetItem[];
  const pricingFree = t.raw('pricing.free') as PricingCard;
  const pricingPaid = t.raw('pricing.paid') as PricingCard;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">

        {/* ===== Hero ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-700 py-24 text-white sm:py-32">
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
            <span className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
              {t('hero.badge')}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {t('hero.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              {t('hero.subtitle')}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-base font-bold text-emerald-800 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-xl active:translate-y-0"
              >
                {t('hero.cta')}
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
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
              >
                {t('hero.secondary')}
              </a>
            </div>
          </div>
        </section>

        {/* ===== Features ===== */}
        <section id="features" className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                {t('features.badge')}
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t('features.title')}
              </h2>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featureItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm text-center transition-all hover:-translate-y-1 hover:shadow-md hover:border-emerald-200"
                >
                  <div className="mb-5 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-4xl">
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Difference ===== */}
        <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                {t('difference.badge')}
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t('difference.title')}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {t('difference.desc')}
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {differencePoints.map((point) => (
                <div
                  key={point.label}
                  className={`rounded-2xl border p-8 transition-all ${
                    point.positive
                      ? 'border-emerald-200 bg-emerald-50 shadow-sm'
                      : 'border-border bg-white opacity-80'
                  }`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        point.positive
                          ? 'bg-emerald-500 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {point.positive ? '✓' : '−'}
                    </span>
                    <p className="text-sm font-semibold text-muted-foreground">{point.label}</p>
                  </div>
                  <p
                    className={`text-base font-bold ${
                      point.positive ? 'text-emerald-800' : 'text-foreground'
                    }`}
                  >
                    {point.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Target ===== */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-center text-3xl font-bold text-foreground sm:text-4xl">
              {t('target.title')}
            </h2>

            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {targetItems.map((item) => (
                <div
                  key={item.text}
                  className="flex flex-col items-center rounded-2xl border border-teal-100 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-3xl">
                    {item.icon}
                  </span>
                  <p className="text-sm font-semibold leading-relaxed text-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Pricing ===== */}
        <section className="bg-muted py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                {t('pricing.badge')}
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t('pricing.title')}
              </h2>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {/* Free Plan */}
              <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
                <div className="mb-6">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {pricingFree.label}
                  </span>
                </div>
                <p className="text-base leading-relaxed text-muted-foreground">{pricingFree.desc}</p>
                <div className="mt-8">
                  <Link
                    href="/register"
                    className="inline-flex w-full items-center justify-center rounded-2xl border-2 border-emerald-500 bg-white px-6 py-3 text-sm font-bold text-emerald-700 transition-all hover:bg-emerald-50"
                  >
                    {pricingFree.cta}
                  </Link>
                </div>
              </div>

              {/* Paid Plan */}
              <div className="rounded-2xl border-2 border-emerald-500 bg-white p-8 shadow-md ring-1 ring-emerald-200">
                <div className="mb-6">
                  <span className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                    {pricingPaid.label}
                  </span>
                </div>
                <p className="text-base leading-relaxed text-muted-foreground">{pricingPaid.desc}</p>
                <div className="mt-8">
                  <Link
                    href="/register"
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-600"
                  >
                    {pricingPaid.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Final CTA ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-700 py-24 text-white sm:py-32">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="absolute -top-32 -end-32 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -start-32 h-[400px] w-[400px] rounded-full bg-white/5 blur-3xl" />

          <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
            <p className="text-2xl font-bold leading-snug sm:text-3xl">{t('tagline')}</p>
            <p className="mt-3 text-base text-white/70">{t('taglineDesc')}</p>
            <div className="mt-10">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-10 py-4 text-base font-bold text-emerald-800 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-xl active:translate-y-0"
              >
                {t('ctaFinal')}
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
