import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NailSeitaiPage() {
  const t = useTranslations("nailSeitai");

  const bioFactors = t.raw("biomechanics.factors") as { title: string; desc: string; icon: string }[];
  const features = t.raw("what.features") as { title: string; description: string }[];
  const treatments = t.raw("treatments.items") as { stage: string; title: string; desc: string; type: string }[];
  const sportsItems = t.raw("sports.items") as { sport: string; benefit: string }[];
  const preventionItems = t.raw("prevention.items") as { title: string; desc: string }[];
  const cases = t.raw("cases.items") as { name: string; before: string; after: string }[];

  const treatmentBadge = (type: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      self:   { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "セルフケア" },
      clinic: { cls: "bg-blue-50 text-blue-700 border-blue-200", label: "クリニック" },
      urgent: { cls: "bg-red-50 text-red-700 border-red-200", label: "緊急受診" },
    };
    return map[type] ?? { cls: "bg-muted text-muted-foreground border-border", label: type };
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light py-20 text-white">
          <div className="absolute -top-40 -end-40 h-[500px] w-[500px] rounded-full bg-accent/20 blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/60">
                  {t("hero.badge")}
                </p>
                <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{t("hero.title")}</h1>
                <p className="mt-4 text-lg leading-relaxed text-white/80">{t("hero.description")}</p>
                <Link
                  href="/ai-diagnosis"
                  className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-all hover:shadow-xl"
                >
                  {t("cta.button")}
                </Link>
              </div>
              <div className="relative">
                <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20">
                  <Image
                    src="/images/optimized/sportnail.webp"
                    alt="Sports Nail Seitai"
                    width={600}
                    height={400}
                    className="h-72 w-full object-cover lg:h-96"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Biomechanics */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Biomechanics</p>
              <h2 className="text-3xl font-bold text-foreground">{t("biomechanics.sectionTitle")}</h2>
              <p className="mt-2 text-xs font-semibold text-primary">{t("biomechanics.subtitle")}</p>
            </div>

            <div className="mb-10 rounded-xl border border-primary/20 bg-primary/5 p-6">
              <p className="text-base leading-relaxed text-foreground">{t("biomechanics.description")}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {bioFactors.map((factor, i) => (
                <div key={i} className="rounded-xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    {factor.icon === "bone" && (
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.096.04A2.25 2.25 0 0018 12.75v-.01A2.25 2.25 0 0016.5 10.5H15M9.75 3.104A3 3 0 0112 1.5c.8 0 1.536.294 2.094.779M9.75 3.104A24.01 24.01 0 009 3.2" />
                      </svg>
                    )}
                    {factor.icon === "walk" && (
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    )}
                    {factor.icon === "scissors" && (
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664" />
                      </svg>
                    )}
                    {factor.icon === "shoe" && (
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.320.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="mb-2 text-base font-bold text-foreground">{factor.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{factor.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What is Nail Seitai */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              {/* Merit image */}
              <div className="relative mx-auto w-full max-w-lg">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/8 to-accent/8 blur-2xl" />
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
                  <Image
                    src="/images/optimized/merit.jpg"
                    alt="爪整体のメリット"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
              {/* Content */}
              <div>
                <div className="mb-8">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">About</p>
                  <h2 className="text-3xl font-bold text-foreground">{t("what.sectionTitle")}</h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t("what.description")}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {features.map((feature, i) => (
                    <div key={i} className="rounded-xl border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
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

        {/* Treatments */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Treatment</p>
              <h2 className="text-3xl font-bold text-foreground">{t("treatments.sectionTitle")}</h2>
              <p className="mt-2 text-base text-muted-foreground">{t("treatments.subtitle")}</p>
            </div>

            <div className="space-y-5">
              {treatments.map((item, i) => {
                const badge = treatmentBadge(item.type);
                return (
                  <div key={i} className="flex items-start gap-5 rounded-xl border border-border bg-white p-6 shadow-sm">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary text-white">
                      <span className="text-xs font-medium opacity-75">STAGE</span>
                      <span className="text-sm font-bold leading-none">{item.stage}</span>
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sports */}
        <section className="relative overflow-hidden bg-muted py-20">
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <Image
              src="/images/optimized/sportsfoot.jpg"
              alt=""
              fill
              className="object-cover opacity-[0.07]"
              sizes="100vw"
            />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Sports</p>
              <h2 className="text-3xl font-bold text-foreground">{t("sports.sectionTitle")}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">{t("sports.description")}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {sportsItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4 rounded-xl border border-border bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white text-sm font-bold">
                    {item.sport.charAt(0)}
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-bold text-foreground">{item.sport}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prevention */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Prevention</p>
              <h2 className="text-3xl font-bold text-foreground">{t("prevention.sectionTitle")}</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {preventionItems.map((item, i) => (
                <div key={i} className="rounded-xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-base font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Before & After */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Cases</p>
              <h2 className="text-3xl font-bold text-foreground">{t("cases.sectionTitle")}</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {cases.map((c, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                  <div className="bg-primary/5 px-6 py-4">
                    <p className="text-sm font-semibold text-foreground">{c.name}</p>
                  </div>
                  <div className="space-y-4 p-6">
                    <div>
                      <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Before
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{c.before}</p>
                    </div>
                    <div className="h-px bg-border" />
                    <div>
                      <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />After
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{c.after}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary to-accent py-20 text-white">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-bold">{t("cta.title")}</h2>
            <p className="mt-4 text-lg opacity-90">{t("cta.description")}</p>
            <Link href="/ai-diagnosis" className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-md transition-all hover:shadow-lg">
              {t("cta.button")}
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
