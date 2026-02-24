import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* ===== 1. Hero Section ===== */}
        <section className="relative overflow-hidden bg-white py-24 sm:py-32 lg:py-40">
          {/* Dot grid background */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle, #CBD5E1 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Soft glow orbs */}
          <div className="absolute -top-40 -end-40 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -start-40 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            {/* Badge */}
            <div className="mb-8 flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                AI Powered Diagnosis
              </span>
            </div>

            <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
              <div className="text-center lg:text-start">
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {t("hero.title")}
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  {t("hero.subtitle")}
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                  >
                    {t("hero.cta")}
                    <svg
                      className="ms-2 h-4 w-4 rtl:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-3.5 text-base font-semibold text-foreground transition-all hover:border-primary/30 hover:bg-muted"
                  >
                    詳しく見る
                  </Link>
                </div>

                {/* Stats */}
                <div className="mt-14 grid grid-cols-3 gap-6 border-t border-border pt-8">
                  <div>
                    <p className="text-2xl font-bold text-foreground">98%</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      診断精度
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">5K+</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      分析件数
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">24h</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      AIサポート
                    </p>
                  </div>
                </div>
              </div>

              {/* Hero image with floating cards */}
              <div className="relative mx-auto w-full max-w-lg">
                <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 blur-3xl" />
                <div className="relative">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-border">
                    <Image
                      src="/nail-image-1.jpg"
                      alt="Nail Seitai"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Floating score card */}
                  <div className="absolute -bottom-5 -start-5 rounded-xl border border-border bg-white p-3.5 shadow-lg">
                    <p className="text-[10px] font-medium text-muted-foreground">
                      AI 診断スコア
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[92%] rounded-full bg-success" />
                      </div>
                      <span className="text-sm font-bold text-foreground">
                        92
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] font-semibold text-success">
                      健康状態: 良好
                    </p>
                  </div>

                  {/* Floating status tag */}
                  <div className="absolute -top-4 -end-4 rounded-xl border border-border bg-white p-3 shadow-md">
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-accent"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-foreground">
                        AI分析完了
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 2. About — 爪整体とは ===== */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                About
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t("about.sectionTitle")}
              </h2>
              <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Health */}
              <div className="group rounded-xl border border-border bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-white">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {t("about.health.title")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t("about.health.description")}
                </p>
              </div>

              {/* Merit */}
              <div className="group rounded-xl border border-border bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-all duration-200 group-hover:bg-accent group-hover:text-white">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {t("about.merit.title")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t("about.merit.description")}
                </p>
              </div>

              {/* Sports */}
              <div className="group rounded-xl border border-border bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:col-span-2 lg:col-span-1">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success transition-all duration-200 group-hover:bg-success group-hover:text-white">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {t("about.sports.title")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t("about.sports.description")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 3. AI Diagnosis Features ===== */}
        <section className="bg-muted py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                How It Works
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t("aiFeature.sectionTitle")}
              </h2>
              <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              {/* Image */}
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/8 to-accent/8 blur-2xl" />
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
                  <Image
                    src="/nail-image-2.jpg"
                    alt="AI Nail Diagnosis"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-10">
                {/* Step 1 */}
                <div className="flex gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-sm">
                    1
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {t("aiFeature.step1.title")}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {t("aiFeature.step1.description")}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white shadow-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {t("aiFeature.step2.title")}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {t("aiFeature.step2.description")}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success text-sm font-bold text-white shadow-sm">
                    3
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {t("aiFeature.step3.title")}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {t("aiFeature.step3.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 4. Testimonials ===== */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                Testimonials
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t("testimonials.sectionTitle")}
              </h2>
              <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 text-warning">
                    {[...Array(5)].map((_, j) => (
                      <svg
                        key={j}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
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
                      <p className="text-sm font-semibold text-foreground">
                        {t(`testimonials.items.${i}.name`)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t(`testimonials.items.${i}.role`)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 5. CTA Section ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent py-24 text-white sm:py-32">
          {/* Dot grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="absolute -top-32 -end-32 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div className="text-center lg:text-start">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/50">
                  Get Started
                </p>
                <h2 className="text-3xl font-bold sm:text-4xl">
                  {t("cta.title")}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/70">
                  {t("cta.description")}
                </p>
                <div className="mt-8">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-primary shadow-sm transition-all hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                  >
                    {t("cta.button")}
                    <svg
                      className="ms-2 h-4 w-4 rtl:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-md">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20">
                  <Image
                    src="/nail-image-3.jpg"
                    alt="AI Diagnosis CTA"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
