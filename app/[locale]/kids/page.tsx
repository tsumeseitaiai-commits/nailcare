import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('kids');
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function KidsPage() {
  const t = await getTranslations('kids');

  type FeatureItem = { title: string; desc: string; icon: string };
  const featureItems = t.raw('features.items') as FeatureItem[];

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
          <div className="absolute -bottom-40 -start-40 h-[400px] w-[400px] rounded-full bg-white/5 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
            {/* Service badge */}
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              {t('hero.badge')}
            </span>

            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {t('hero.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              {t('hero.subtitle')}
            </p>

            {/* Under Development Banner */}
            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/20 bg-white/10 px-8 py-6 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl">🚧</span>
                <div className="text-start">
                  <p className="text-base font-bold text-white">別サービスとして開発中</p>
                  <p className="mt-1 text-sm text-white/70">現在、独立したアプリとして開発を進めています</p>
                </div>
              </div>
            </div>

            {/* Notify CTA */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-base font-bold text-emerald-800 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-xl active:translate-y-0"
              >
                リリースを通知する
                <svg className="ms-2 h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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

        {/* ===== Development Status ===== */}
        <section className="border-b border-border bg-amber-50 py-6">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">このサービスは現在開発中です</p>
                <p className="mt-1 text-xs leading-relaxed text-amber-800">
                  爪整体AIの技術を活用した、お子さまの成長記録アプリを独立したサービスとして開発中です。
                  リリース時にお知らせを受け取りたい方は、お問い合わせよりご登録ください。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Features Preview ===== */}
        <section id="features" className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center">
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700">
                開発予定の機能
              </span>
              <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
                {t('features.title')}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
                リリース時には以下の機能をご利用いただけます
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featureItems.map((item) => (
                <div
                  key={item.title}
                  className="relative rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm text-center opacity-90"
                >
                  {/* Coming soon overlay */}
                  <div className="absolute top-3 end-3">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      開発中
                    </span>
                  </div>
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

        {/* ===== Pricing Preview ===== */}
        <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t('pricing.title')}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">リリース時の予定価格です</p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {/* Free */}
              <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  無料プラン
                </span>
                <p className="mt-4 text-2xl font-bold text-foreground">¥0</p>
                <p className="mt-1 text-sm text-muted-foreground">基本の成長記録機能</p>
                <ul className="mt-6 space-y-2">
                  {['写真撮影・記録', '基本的な成長グラフ', 'マイルストーン記録'].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 rounded-xl border-2 border-dashed border-emerald-200 px-4 py-3 text-center">
                  <p className="text-xs font-semibold text-emerald-600">リリース後に利用可能</p>
                </div>
              </div>

              {/* Paid */}
              <div className="rounded-2xl border-2 border-emerald-500 bg-white p-8 shadow-md">
                <span className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                  有料プラン
                </span>
                <p className="mt-4 text-2xl font-bold text-foreground">¥500<span className="text-base font-normal text-muted-foreground">〜1,500/月</span></p>
                <p className="mt-1 text-sm text-muted-foreground">AI分析・動画・成長予測</p>
                <ul className="mt-6 space-y-2">
                  {['AI成長スコア分析', '成長ムービー自動作成', '発達予測レポート', '月次成長サマリー'].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 rounded-xl border-2 border-dashed border-emerald-300 px-4 py-3 text-center">
                  <p className="text-xs font-semibold text-emerald-600">リリース後に利用可能</p>
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

          <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
            <p className="text-2xl font-bold leading-snug sm:text-3xl">{t('tagline')}</p>
            <p className="mt-3 text-base text-white/70">{t('taglineDesc')}</p>
            <p className="mt-2 text-sm text-white/50">サービスは現在開発中です。リリースをお楽しみに。</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-10 py-4 text-base font-bold text-emerald-800 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-xl active:translate-y-0"
              >
                リリース通知を受け取る
                <svg className="ms-2 h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/sports"
                className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
              >
                スポーツプランを見る
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
