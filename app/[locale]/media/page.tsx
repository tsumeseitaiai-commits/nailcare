import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function MediaPage() {
  const t = useTranslations('media');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted">

        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-light py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
              {t('badge')}
            </span>
            <h1 className="text-4xl font-bold sm:text-5xl">{t('title')}</h1>
            <p className="mt-4 text-lg text-white/80">{t('subtitle')}</p>
          </div>
        </section>

        {/* 最新号 */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-10 flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{t('latestBadge')}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* 号カード */}
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            {/* マガジンヘッダー */}
            <div className="grid md:grid-cols-2">
              {/* 表紙画像 */}
              <div className="relative min-h-[320px]">
                <Image
                  src="/images/chiropractuin202601/473A1E6C-504E-4ED6-A50C-B88D476A92E4.png"
                  alt="NAIL CHIROPRACTIC TIMES No.2"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">2026 JANUARY No.2</span>
                </div>
              </div>

              {/* 号情報 */}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">NAIL CHIROPRACTIC TIMES</p>
                  <h2 className="text-2xl font-bold text-foreground mb-1">{t('issue2.title')}</h2>
                  <p className="text-sm text-muted-foreground mb-6">{t('issue2.date')}</p>

                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('contentsLabel')}</p>
                    {(t.raw('issue2.contents') as string[]).map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/media/interview-jujutsu"
                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark transition">
                    {t('readJujutsu')}
                  </Link>
                  <Link href="/media/interview-kickboxing"
                    className="rounded-xl border border-primary px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 transition">
                    {t('readKickboxing')}
                  </Link>
                </div>
              </div>
            </div>

            {/* 記事サムネイル一覧 */}
            <div className="border-t border-border grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {/* インタビュー 柔術 */}
              <Link href="/media/interview-jujutsu" className="group p-6 hover:bg-muted/50 transition">
                <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                  <Image
                    src="/images/chiropractuin202601/AAB1D85E-2E7E-4F52-A255-1CC71F66E61D.png"
                    alt={t("issue2.jujutsuTag")}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">INTERVIEW</span>
                  </div>
                </div>
                <p className="text-xs font-semibold text-primary mb-1">{t('issue2.jujutsuTag')}</p>
                <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition">{t('issue2.jujutsuTitle')}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{t('issue2.jujutsuSub')}</p>
              </Link>

              {/* インタビュー キックボクシング */}
              <Link href="/media/interview-kickboxing" className="group p-6 hover:bg-muted/50 transition">
                <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                  <Image
                    src="/images/chiropractuin202601/D393CE18-57C6-4F7E-A752-6873568DF537.png"
                    alt={t("issue2.kickboxingTag")}
                    fill
                    className="object-cover object-right group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">INTERVIEW</span>
                  </div>
                </div>
                <p className="text-xs font-semibold text-primary mb-1">{t('issue2.kickboxingTag')}</p>
                <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition">{t('issue2.kickboxingTitle')}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{t('issue2.kickboxingSub')}</p>
              </Link>

              {/* 実証データ */}
              <div className="p-6">
                <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                  <Image
                    src="/images/chiropractuin202601/S__78143490.jpg"
                    alt={t("issue2.dataTag")}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">DATA</span>
                  </div>
                </div>
                <p className="text-xs font-semibold text-primary mb-1">{t('issue2.dataTag')}</p>
                <h3 className="text-sm font-bold text-foreground leading-snug">{t('issue2.dataTitle')}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{t('issue2.dataSub')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI診断CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-10 text-center text-white">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-white/60">{t('cta.badge')}</p>
            <h2 className="mb-3 text-2xl font-bold">{t('cta.title')}</h2>
            <p className="mb-6 text-sm text-white/80">{t('cta.desc')}</p>
            <Link href="/ai-diagnosis"
              className="inline-flex items-center rounded-xl bg-white px-8 py-3 text-sm font-bold text-primary hover:bg-white/90 transition">
              {t('cta.button')}
              <svg className="ms-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
