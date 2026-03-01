'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

import enMessages from '../../../messages/en.json';
import arMessages from '../../../messages/ar.json';
import jaMessages from '../../../messages/ja.json';

const IMAGES = [
  '/images/chiropractuin202601/01.png',
  '/images/chiropractuin202601/02.png',
  '/images/chiropractuin202601/03.png',
  '/images/chiropractuin202601/04.png',
  '/images/chiropractuin202601/05.jpg',
  '/images/chiropractuin202601/06.jpg',
  '/images/chiropractuin202601/07.png',
  '/images/chiropractuin202601/08.png',
];

type Tab = 'ja' | 'en' | 'ar';

const viewerByLang = {
  ja: jaMessages.media.viewer,
  en: enMessages.media.viewer,
  ar: arMessages.media.viewer,
};

export default function MediaPage() {
  const t = useTranslations('media');
  const locale = useLocale();
  const [tab, setTab] = useState<Tab>(
    locale === 'ar' ? 'ar' : locale === 'en' ? 'en' : 'ja'
  );

  const v = viewerByLang[tab === 'ja' ? 'ja' : tab];

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

        {/* Magazine Viewer */}
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          {/* Tab bar */}
          <div className="mb-8 flex justify-center gap-2">
            {(['ja', 'en', 'ar'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  tab === key
                    ? 'bg-primary text-white shadow'
                    : 'border border-border bg-white text-muted-foreground hover:bg-muted'
                }`}
              >
                {t(`viewer.tabs.${key}`)}
              </button>
            ))}
          </div>

          {/* ── Japanese tab: stacked images ── */}
          {tab === 'ja' && (
            <div className="space-y-1 rounded-2xl overflow-hidden border border-border shadow-sm bg-white">
              {IMAGES.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt={`NAIL CHIROPRACTIC TIMES No.2 – Page ${i + 1}`}
                  width={1200}
                  height={1700}
                  className="w-full h-auto"
                  sizes="(max-width: 1024px) 100vw, 896px"
                  priority={i < 2}
                />
              ))}
            </div>
          )}

          {/* ── English / Arabic tab: web text ── */}
          {(tab === 'en' || tab === 'ar') && (
            <div dir={tab === 'ar' ? 'rtl' : undefined} className="space-y-10">

              {/* S1 – Cover */}
              <article className="rounded-2xl border border-border bg-white p-8 shadow-sm">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                  {v.s1.sectionLabel}
                </p>
                <h2 className="text-2xl font-bold text-foreground">{v.s1.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{v.s1.tagline}</p>

                <div className="mt-6">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {v.s1.featureTitle}
                  </p>
                  <ul className="space-y-2">
                    {v.s1.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {v.s1.interviewsTitle}
                  </p>
                  <ul className="space-y-2">
                    {v.s1.interviews.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              {/* S2 – Kickboxing Interview */}
              <article className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
                <div className="bg-red-50 px-8 py-5 border-b border-border">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-red-600">
                    {v.s2.sectionLabel}
                  </p>
                  <h2 className="text-xl font-bold text-foreground">{v.s2.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{v.s2.interviewee} · {v.s2.role}</p>
                </div>
                <div className="p-8 space-y-5">
                  {v.s2.qa.map((item: { q: string; a: string }, i: number) => (
                    <div key={i}>
                      <div className="flex items-start gap-3 mb-2">
                        <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">Q{i + 1}</span>
                        <p className="font-bold text-foreground text-sm">{item.q}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">A</span>
                        <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{v.s2.insoleTitle}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{v.s2.insoleBody}</p>
                  </div>

                  <div className="mt-4 rounded-xl bg-muted p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">PROFILE</p>
                    <p className="text-sm text-foreground">{v.s2.profile}</p>
                  </div>
                </div>
              </article>

              {/* S3 – Biomechanics / Nail Approach */}
              <article className="rounded-2xl border border-border bg-white p-8 shadow-sm">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                  {v.s3.sectionLabel}
                </p>
                <h2 className="text-xl font-bold text-foreground">{v.s3.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{v.s3.body}</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {v.s3.pillars.map((p: { label: string; sub: string; desc: string }, i: number) => (
                    <div key={i} className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-center">
                      <p className="font-bold text-primary text-sm">{p.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 mb-2">{p.sub}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </article>

              {/* S4 – Jiu-Jitsu Interview */}
              <article className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
                <div className="bg-primary/5 px-8 py-5 border-b border-border">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                    {v.s4.sectionLabel}
                  </p>
                  <h2 className="text-xl font-bold text-foreground">{v.s4.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{v.s4.interviewee} · {v.s4.role}</p>
                </div>
                <div className="p-8 space-y-5">
                  {v.s4.qa.map((item: { q: string; a: string }, i: number) => (
                    <div key={i}>
                      <div className="flex items-start gap-3 mb-2">
                        <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">Q{i + 1}</span>
                        <p className="font-bold text-foreground text-sm">{item.q}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">A</span>
                        <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 rounded-xl bg-muted p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">PROFILE</p>
                    <p className="text-sm text-foreground">{v.s4.profile}</p>
                  </div>
                </div>
              </article>

              {/* S5 – Evidence Data */}
              <article className="rounded-2xl border border-border bg-white p-8 shadow-sm">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                  {v.s5.sectionLabel}
                </p>
                <h2 className="text-xl font-bold text-foreground">{v.s5.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{v.s5.subtitle}</p>

                <div className="mt-6 space-y-4">
                  {v.s5.cases.map((c: { label: string; before: string; after: string }, i: number) => (
                    <div key={i} className="rounded-xl border border-border p-5">
                      <p className="font-bold text-foreground text-sm mb-3">{c.label}</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg bg-red-50 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-1">Before</p>
                          <p className="text-xs leading-relaxed text-red-800">{c.before}</p>
                        </div>
                        <div className="rounded-lg bg-emerald-50 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1">After</p>
                          <p className="text-xs leading-relaxed text-emerald-800">{c.after}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              {/* S6 – Activities & Achievements */}
              <article className="rounded-2xl border border-border bg-white p-8 shadow-sm">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                  {v.s6.sectionLabel}
                </p>
                <h2 className="text-xl font-bold text-foreground">{v.s6.title}</h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {v.s6.items.map((item: { category: string; title: string; desc: string }, i: number) => (
                    <div key={i} className="rounded-xl border border-border p-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">{item.category}</p>
                      <p className="font-bold text-foreground text-sm mb-2">{item.title}</p>
                      <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </article>

              {/* S7 – Foundation */}
              <article className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
                <div className="bg-amber-50 px-8 py-5 border-b border-border">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-700">
                    {v.s7.sectionLabel}
                  </p>
                  <h2 className="text-xl font-bold text-foreground">{v.s7.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{v.s7.interviewee} · {v.s7.intervieweeRole}</p>
                </div>
                <div className="p-8 space-y-5">
                  {v.s7.qa.map((item: { q: string; a: string }, i: number) => (
                    <div key={i}>
                      <p className="mb-1 text-sm font-bold text-foreground">Q{i + 1}. {item.q}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                    </div>
                  ))}

                  <div className="mt-4 rounded-xl bg-muted p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">PROFILE</p>
                    <p className="text-sm text-foreground">{v.s7.profile}</p>
                  </div>
                </div>
              </article>

              {/* S8 – Clinic */}
              <article className="rounded-2xl border border-border bg-white p-8 shadow-sm">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                  {v.s8.sectionLabel}
                </p>
                <h2 className="text-xl font-bold text-foreground">{v.s8.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{v.s8.body}</p>

                <div className="mt-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {v.s8.pointsTitle}
                  </p>
                  <ul className="space-y-3">
                    {v.s8.points.map((point: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {i + 1}
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

            </div>
          )}
        </section>

        {/* Interview Links */}
        <section className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/media/interview-jujutsu"
              className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <Image src="/images/chiropractuin202601/04.png" alt="" fill className="object-cover" sizes="64px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-primary">{t('issue2.jujutsuTag')}</p>
                <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition">{t('issue2.jujutsuTitle')}</p>
              </div>
              <svg className="h-4 w-4 shrink-0 text-muted-foreground rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/media/interview-kickboxing"
              className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <Image src="/images/chiropractuin202601/02.png" alt="" fill className="object-cover" sizes="64px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-primary">{t('issue2.kickboxingTag')}</p>
                <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition">{t('issue2.kickboxingTitle')}</p>
              </div>
              <svg className="h-4 w-4 shrink-0 text-muted-foreground rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* AI CTA */}
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
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
