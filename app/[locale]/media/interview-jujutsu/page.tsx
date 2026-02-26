import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function InterviewJujutsuPage() {
  const t = useTranslations('media.jujutsu');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted">

        {/* Hero */}
        <section className="relative overflow-hidden bg-slate-900 py-24 text-white">
          <div className="absolute inset-0">
            <Image
              src="/images/chiropractuin202601/AAB1D85E-2E7E-4F52-A255-1CC71F66E61D.png"
              alt={t("heroTitle")}
              fill
              className="object-cover opacity-30"
            />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
            <Link href="/media" className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('backLabel')}
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold">INTERVIEW</span>
              <span className="text-xs text-white/60">NAIL CHIROPRACTIC TIMES No.2 · 2026.01</span>
            </div>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{t('heroTitle')}</h1>
            <p className="mt-4 text-lg text-white/80">{t('heroSub')}</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/30 flex items-center justify-center text-sm font-bold">角</div>
              <div>
                <p className="text-sm font-semibold">{t('interviewee')}</p>
                <p className="text-xs text-white/60">{t('intervieweeRole')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 記事本文 */}
        <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-3">

            {/* メイン */}
            <div className="lg:col-span-2 space-y-10">

              {/* イントロ */}
              <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
                <p className="text-base leading-relaxed text-foreground">{t('intro')}</p>
              </div>

              {/* Q&A 柔術インタビュー */}
              {(t.raw('qa') as { q: string; a: string }[]).map((item, i) => (
                <div key={i} className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
                  <div className="bg-primary/5 border-b border-border px-6 py-4 flex items-start gap-3">
                    <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">Q{i + 1}</span>
                    <p className="font-bold text-foreground leading-snug">{item.q}</p>
                  </div>
                  <div className="px-6 py-5 flex items-start gap-3">
                    <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">A</span>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                  </div>
                </div>
              ))}

              {/* 名言カード */}
              <div className="rounded-2xl border-l-4 border-primary bg-primary/5 p-8">
                <p className="text-lg font-bold text-primary leading-relaxed">「{t('quote')}」</p>
                <p className="mt-3 text-sm text-muted-foreground">— {t('interviewee')}</p>
              </div>

              {/* Foundation記事（齋彩華さん） */}
              <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">FOUNDATION: THE FEET</p>
                <h2 className="text-xl font-bold text-foreground mb-6">{t('foundationTitle')}</h2>
                {(t.raw('foundationQa') as { q: string; a: string }[]).map((item, i) => (
                  <div key={i} className="mb-5">
                    <p className="mb-1 text-sm font-bold text-foreground">Q{i + 1}. {item.q}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* サイドバー */}
            <aside className="space-y-6">
              {/* 雑誌画像 */}
              <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
                <div className="relative aspect-[3/4]">
                  <Image
                    src="/images/chiropractuin202601/AAB1D85E-2E7E-4F52-A255-1CC71F66E61D.png"
                    alt="NAIL CHIROPRACTIC TIMES No.2"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* プロフィール */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">PROFILE</p>
                <p className="font-bold text-foreground">{t('interviewee')}</p>
                <p className="text-xs text-muted-foreground mb-3">{t('intervieweeRole')}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{t('profile')}</p>
              </div>

              {/* 関連リンク */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">{t('relatedLabel')}</p>
                <div className="space-y-2">
                  <Link href="/media/interview-kickboxing"
                    className="flex items-center gap-2 rounded-lg p-2 text-sm font-semibold text-foreground hover:bg-muted transition">
                    <span className="text-lg">🥊</span> {t('relatedKickboxing')}
                  </Link>
                  <Link href="/ai-diagnosis"
                    className="flex items-center gap-2 rounded-lg p-2 text-sm font-semibold text-primary hover:bg-primary/5 transition">
                    <span className="text-lg">💅</span> {t('relatedDiagnosis')}
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </article>

      </main>
      <Footer />
    </div>
  );
}
