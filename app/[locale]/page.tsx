import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomePage() {
  const t = useTranslations("home");
  const conditionItems = t.raw("conditions.items") as {
    name: string; eng: string; severity: string; desc: string; action: string; color: string;
  }[];
  const squareSteps = t.raw("squareOff.steps") as {
    step: string; title: string; desc: string; note: string;
  }[];
  const dataItems = t.raw("dataCollection.items") as { value: string; label: string }[];

  const severityColor = (color: string) => {
    const map: Record<string, string> = {
      danger: "bg-red-50 text-red-700 border-red-200",
      warning: "bg-amber-50 text-amber-700 border-amber-200",
      success: "bg-emerald-50 text-emerald-700 border-emerald-200",
      secondary: "bg-blue-50 text-blue-700 border-blue-200",
    };
    return map[color] ?? "bg-muted text-muted-foreground border-border";
  };

  const dotColor = (color: string) => {
    const map: Record<string, string> = {
      danger: "bg-red-500",
      warning: "bg-amber-500",
      success: "bg-emerald-500",
      secondary: "bg-blue-500",
    };
    return map[color] ?? "bg-muted-foreground";
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">

        {/* ===== 1. Hero Section ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light py-24 text-white sm:py-32 lg:py-40">
          {/* Dot grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Glow orbs */}
          <div className="absolute -top-40 -end-40 h-[600px] w-[600px] rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-40 -start-40 h-[400px] w-[400px] rounded-full bg-secondary/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            {/* Badge */}
            <div className="mb-8 flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t("hero.badge")}
              </span>
            </div>

            <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
              <div className="text-center lg:text-start">
                <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  {t("hero.title")}
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-white/80 sm:text-xl">
                  {t("hero.subtitle")}
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                  <Link
                    href="/ai-diagnosis"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-all hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
                  >
                    {t("hero.cta")}
                    <svg className="ms-2 h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    {t("hero.secondary")}
                  </Link>
                </div>

                {/* Stats */}
                <div className="mt-14 grid grid-cols-3 gap-6 border-t border-white/20 pt-8">
                  {(["accuracy", "images", "support"] as const).map((key) => (
                    <div key={key}>
                      <p className="text-2xl font-bold text-white">{t(`hero.stats.${key}.value`)}</p>
                      <p className="mt-0.5 text-xs text-white/60">{t(`hero.stats.${key}.label`)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero image */}
              <div className="relative mx-auto w-full max-w-lg">
                <div className="absolute -inset-6 rounded-3xl bg-white/5 blur-3xl" />
                <div className="relative">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20">
                    <Image
                      src="/images/optimized/hero01.webp"
                      alt="AI爪診断"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/40 to-transparent" />
                  </div>

                  {/* Floating score card */}
                  <div className="glass absolute -bottom-5 -start-5 rounded-xl p-3.5 shadow-xl">
                    <p className="text-[10px] font-medium text-muted-foreground">AI 診断スコア</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[92%] rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-sm font-bold text-foreground">92</span>
                    </div>
                    <p className="mt-1 text-[10px] font-semibold text-emerald-600">健康状態: 良好</p>
                  </div>

                  {/* Floating tag */}
                  <div className="glass absolute -top-4 -end-4 rounded-xl p-3 shadow-lg">
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-foreground">AI分析完了</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 2. Evidence Section ===== */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="absolute inset-0 z-0">
            <Image src="/images/optimized/datascience.webp" alt="" fill className="object-cover opacity-5" aria-hidden="true" />
          </div>
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white via-primary/3 to-white" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                {t("evidence.badge")}
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t("evidence.title")}
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
                {t("evidence.subtitle")}
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {(t.raw("evidence.items") as { value: string; label: string; detail: string }[]).map((item, i) => (
                <div key={i} className="rounded-xl border border-border bg-white/90 p-8 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <p className="text-4xl font-bold text-primary">{item.value}</p>
                  <p className="mt-2 text-base font-semibold text-foreground">{item.label}</p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 3. Disease Conditions ===== */}
        <section className="bg-muted py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                {t("conditions.badge")}
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t("conditions.title")}
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base text-muted-foreground">
                {t("conditions.subtitle")}
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {conditionItems.map((item, i) => (
                <div
                  key={i}
                  className="group rounded-xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${severityColor(item.color)}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${dotColor(item.color)}`} />
                      {item.action}
                    </span>
                    <span className="text-xs text-muted-foreground">重症度: {item.severity}</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{item.name}</h3>
                  <p className="text-xs font-medium text-muted-foreground">{item.eng}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 4. AI Diagnosis Process ===== */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                {t("aiFeature.badge")}
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t("aiFeature.sectionTitle")}
              </h2>
              <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="mt-16 grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
              {/* mobile.webp */}
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/8 to-accent/8 blur-2xl" />
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
                  <Image
                    src="/images/optimized/mobile.webp"
                    alt="AI Nail Diagnosis"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-8">
                {([
                  { key: "step1", color: "bg-primary", img: "/images/optimized/anal01.webp" },
                  { key: "step2", color: "bg-accent", img: "/images/optimized/anal02.webp" },
                  { key: "step3", color: "bg-emerald-500", img: "/images/optimized/anal03.webp" },
                ] as const).map(({ key, color, img }, i) => (
                  <div key={key} className="flex gap-5">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${color} text-sm font-bold text-white shadow-sm`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="relative mb-3 h-40 overflow-hidden rounded-xl">
                        <Image src={img} alt={t(`aiFeature.${key}.title`)} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                      </div>
                      <h3 className="text-base font-bold text-foreground">{t(`aiFeature.${key}.title`)}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`aiFeature.${key}.description`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== 5. Square-off Cut Guide ===== */}
        <section className="bg-gradient-to-br from-primary/5 via-white to-accent/5 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                {t("squareOff.badge")}
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t("squareOff.title")}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
                {t("squareOff.subtitle")}
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {squareSteps.map((s, i) => (
                <div key={i} className="relative rounded-xl border border-border bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-sm">
                    {s.step}
                  </div>
                  <h3 className="text-base font-bold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <div className="mt-4 rounded-lg bg-primary/5 px-3 py-2">
                    <p className="text-xs text-primary font-medium">💡 {s.note}</p>
                  </div>
                  {i < squareSteps.length - 1 && (
                    <div className="absolute -end-3 top-1/2 hidden -translate-y-1/2 sm:block">
                      <svg className="h-6 w-6 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Warning */}
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-amber-800">{t("squareOff.warning")}</p>
            </div>
          </div>
        </section>

        {/* ===== 6. Data Collection ===== */}
        <section className="relative overflow-hidden bg-muted py-20 sm:py-28">
          <div className="absolute inset-0 z-0">
            <Image src="/images/optimized/mobile.webp" alt="" fill className="object-cover opacity-5" aria-hidden="true" />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                  {t("dataCollection.badge")}
                </p>
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                  {t("dataCollection.title")}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {t("dataCollection.desc")}
                </p>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  {dataItems.map((item, i) => (
                    <div key={i} className="rounded-xl border border-border bg-white p-4 text-center shadow-sm">
                      <p className="text-base font-bold text-primary leading-tight">{item.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  {t("dataCollection.privacy")}
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-sm">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 blur-2xl" />
                <div className="relative aspect-square overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
                  <Image
                    src="/images/optimized/datascience.webp"
                    alt="Data Science AI"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 7. Testimonials ===== */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="absolute inset-0 z-0">
            <Image src="/images/optimized/voice.webp" alt="" fill className="object-cover opacity-5" aria-hidden="true" />
          </div>
          <div className="absolute inset-0 z-[1] bg-white/90" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Testimonials</p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t("testimonials.sectionTitle")}
              </h2>
              <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-white p-8 shadow-sm transition-all hover:shadow-md">
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t(`testimonials.items.${i}.comment`)}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {t(`testimonials.items.${i}.name`).charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t(`testimonials.items.${i}.name`)}</p>
                      <p className="text-xs text-muted-foreground">{t(`testimonials.items.${i}.role`)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 8. CTA Section ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent py-24 text-white sm:py-32">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />
          <div className="absolute -top-32 -end-32 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div className="text-center lg:text-start">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/50">Get Started</p>
                <h2 className="text-3xl font-bold sm:text-4xl">{t("cta.title")}</h2>
                <p className="mt-4 text-base leading-relaxed text-white/70">{t("cta.description")}</p>
                <div className="mt-8">
                  <Link
                    href="/ai-diagnosis"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-all hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
                  >
                    {t("cta.button")}
                    <svg className="ms-2 h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-md">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20">
                  <Image
                    src="/images/optimized/sportnail.webp"
                    alt="Nail Care for Sports Performance"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 9. Medical Disclaimer ===== */}
        <section className="border-t border-amber-200 bg-amber-50 py-8">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">{t("disclaimer.title")}</h3>
                <p className="mt-1 text-xs leading-relaxed text-amber-800">{t("disclaimer.text")}</p>
                <p className="mt-2 text-xs font-semibold text-amber-900">{t("disclaimer.urgent")}</p>
                <p className="mt-2 text-xs text-amber-700">{t("disclaimer.source")}</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
