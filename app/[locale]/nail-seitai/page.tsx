import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const GALLERY_IMAGES = [
  "01a80761bd5c70e483d3dd888f287522.jpg",
  "0432b614612597ff5e29074b73ac0113.jpg",
  "083024ecda538aa26257e5189f90548d.jpg",
  "08620c0715092ab88de700b2cf0be751.jpg",
  "0c4b423db4a072ca0f3f8087a2727e55.jpg",
  "28b038d03909358eb7bf54332597328f.jpg",
  "2aa66290f6c87314a62532a53c699fc1.jpg",
  "3450b7e583ca5fe476aea4479682861a.jpg",
  "34a0262cba0a705ed8c82ecec18b541a.jpg",
  "35d60f59d4fbcc46b56a4edab1427eba.png",
  "3afcaeb8bd9aedf862938281d1822f5e.jpg",
  "3fdd3e8a2dc6039c9bb72de08bd62eae.jpg",
  "46b6d6869e47a38ccfbc0bf906ca44bc.jpg",
  "484b90f3a11ab538146590a9d8270002.jpg",
  "4d668161ef1c60ba2b859f2dbcc73940.jpg",
  "4da5f110c80047457b7d96e63ec7577d.jpg",
  "5a13fa610456b2ef0992310ed0634d81.jpg",
  "5a4219bab2dc394f2713ed94095c7ef2.jpg",
  "5c8ffa597c2bba8f7d9299125b8e011e.jpg",
  "6c9d68ca55ffe4925ab8174029eb7cf6.jpg",
  "6e756093b8d0d61695f95f80aae651a9.png",
  "746579f6f544367bd18ec01060375116.jpg",
  "7b86a248dd8795fe86b71bc6ce335bcd.jpg",
  "7ecdcbb93f8e2e4addb2546031719ae2.jpg",
  "925bba8341ada95b4454b0fe2240a431.jpg",
  "932c8b6ff2d5ae708a09ec1871d16f4b.jpg",
  "9340616d7ee956472741d76eb77036fd.jpg",
  "951f28fae8a405d0a96549d80517ed89.jpg",
  "ae199570a01bf35c05b7d55e73a0accc.jpg",
  "b4afb5591182827a7155829d2185567b.jpg",
  "b6619a086ac2f45155c0372f4231b877.jpg",
  "c5c027aeb0e642f361dde30d11d6c2bd.jpg",
  "d1711c037bb8d403d507b7a50c6beca8.jpg",
  "d2746648a75fc7b83436fb1e2d670b8e.jpg",
  "dfa695985ec934310b1b5e4afc88871c.png",
  "f507bbbdc6df56d622f91a26f437ca68.jpg",
  "f548fd6f3e51d74b56b302a865ae9ca5.jpg",
  "f8e24025e361c0a52095fadcd1dc3621.jpg",
  "fd17d0b25dca66354159125ac01ce221.jpg",
  "ff58b1152149f6608fe72840988d76e4.jpg",
  "image.png",
];

// URL-encode the Japanese folder name for browser compatibility
const GALLERY_BASE = "/images/%E7%88%AA%E6%95%B4%E4%BD%93/";

export default function NailSeitaiPage() {
  const t = useTranslations("nailSeitai");

  const merits    = t.raw("merit.items")   as { title: string; desc: string; image: string }[];
  const features  = t.raw("what.features") as { title: string; description: string }[];
  const judoItems = t.raw("judo.items")    as { title: string; desc: string }[];
  const flowSteps = t.raw("flow.steps")    as { number: string; title: string; desc: string }[];
  const faqItems  = t.raw("faq.items")     as { question: string; answer: string }[];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">

        {/* ─── 1. HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[600px] overflow-hidden">
          {/* Background image */}
          <Image
            src="/images/optimized/sportnail.webp"
            alt={t("hero.title")}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/90 via-primary/80 to-primary-light/70" />

          <div className="relative z-10 flex min-h-[600px] items-center">
            <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/70">
                {t("hero.badge")}
              </p>
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                {t("hero.title")}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
                {t("hero.description")}
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/ai-diagnosis"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-all hover:shadow-xl"
                >
                  {t("cta.button")}
                </Link>
                <a
                  href="#flow"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-white/50 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10"
                >
                  {t("flow.sectionTitle")} →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 2. 爪整体とは ────────────────────────────────────────────────────── */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              {/* Image */}
              <div className="relative mx-auto w-full max-w-lg">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/8 to-accent/8 blur-2xl" />
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
                  <Image
                    src="/images/optimized/merit.jpg"
                    alt={t("what.sectionTitle")}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
              {/* Text */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">About</p>
                <h2 className="text-3xl font-bold text-foreground">{t("what.sectionTitle")}</h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {t("what.description")}
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {features.map((feature, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                        <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="mb-1 text-sm font-bold text-foreground">{feature.title}</h3>
                      <p className="text-xs leading-relaxed text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. MERIT 3-COLUMN CARDS ──────────────────────────────────────────── */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                {t("merit.badge")}
              </p>
              <h2 className="text-3xl font-bold text-foreground">{t("merit.sectionTitle")}</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {merits.map((item, i) => (
                <div
                  key={i}
                  className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow">
                        {i + 1}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 4. JUDO / GRIP FORCE SECTION ────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-primary-dark py-20 text-white">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/60">
                {t("judo.badge")}
              </p>
              <h2 className="text-3xl font-bold">{t("judo.sectionTitle")}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80">
                {t("judo.description")}
              </p>
            </div>

            {/* Evidence quote */}
            <div className="mx-auto mb-12 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-0.5 w-8 bg-accent" />
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  {t("judo.evidenceTitle")}
                </p>
              </div>
              <p className="text-base leading-relaxed text-white/85">{t("judo.evidence")}</p>
            </div>

            {/* 3 cards */}
            <div className="grid gap-6 sm:grid-cols-3">
              {judoItems.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-base font-bold text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-white/75">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 5. TREATMENT FLOW ───────────────────────────────────────────────── */}
        <section id="flow" className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                {t("flow.badge")}
              </p>
              <h2 className="text-3xl font-bold text-foreground">{t("flow.sectionTitle")}</h2>
            </div>

            <div className="relative space-y-0">
              {/* Vertical connecting line */}
              <div className="absolute left-[39px] top-10 h-[calc(100%-80px)] w-0.5 bg-gradient-to-b from-primary/50 to-transparent sm:left-[47px]" aria-hidden="true" />

              {flowSteps.map((step, i) => (
                <div key={i} className="relative flex gap-6 pb-10 last:pb-0">
                  {/* Number circle */}
                  <div className="relative z-10 flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-4 border-primary/20 bg-white shadow-md">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/60">STEP</span>
                    <span className="text-xl font-bold text-primary">{step.number}</span>
                  </div>
                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-center rounded-xl border border-border bg-white p-6 shadow-sm">
                    <h3 className="mb-1 text-base font-bold text-foreground">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 6. GALLERY ─────────────────────────────────────────────────────── */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                {t("gallery.badge")}
              </p>
              <h2 className="text-3xl font-bold text-foreground">{t("gallery.sectionTitle")}</h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
                {t("gallery.description")}
              </p>
            </div>

            <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
              {GALLERY_IMAGES.map((filename) => (
                <div
                  key={filename}
                  className="mb-3 overflow-hidden rounded-xl break-inside-avoid shadow-sm transition-all hover:shadow-md"
                >
                  {/* Using <img> to avoid Next.js Image optimization issues with Japanese path */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={GALLERY_BASE + filename}
                    alt={t("cases.sectionTitle")}
                    loading="lazy"
                    className="w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 7. FAQ ──────────────────────────────────────────────────────────── */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                {t("faq.badge")}
              </p>
              <h2 className="text-3xl font-bold text-foreground">{t("faq.sectionTitle")}</h2>
            </div>

            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-border bg-white shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-bold text-foreground select-none">
                    <span>{item.question}</span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-200 group-open:rotate-45">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </span>
                  </summary>
                  <div className="border-t border-border px-6 pb-5 pt-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 8. CTA ──────────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-r from-primary to-accent py-20 text-white">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-bold">{t("cta.title")}</h2>
            <p className="mt-4 text-lg opacity-90">{t("cta.description")}</p>
            <Link
              href="/ai-diagnosis"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-md transition-all hover:shadow-lg"
            >
              {t("cta.button")}
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
