import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const t = useTranslations("about");

  const anatomyParts = t.raw("anatomy.parts") as { name: string; eng: string; desc: string }[];
  const systemicItems = t.raw("systemic.items") as { disease: string; signs: string[]; note: string }[];
  const importanceItems = t.raw("importance.items") as { title: string; description: string }[];
  const timeline = t.raw("history.timeline") as { year: string; event: string }[];
  const stats = t.raw("science.stats") as { value: string; label: string }[];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Subtle fixed background */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/optimized/back.webp"
          alt=""
          fill
          className="object-cover opacity-[0.03]"
          sizes="100vw"
        />
      </div>
      <Header />

      <main className="relative z-10 flex-1">

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
              </div>
              <div className="relative">
                <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20">
                  <Image
                    src="/images/optimized/healthnail.webp"
                    alt="Healthy Nails"
                    width={600}
                    height={400}
                    className="h-72 w-full object-cover lg:h-96"
                    priority
                  />
                </div>
                <div className="glass absolute -bottom-4 -right-4 rounded-xl p-4 shadow-lg">
                  <p className="text-2xl font-bold text-primary">87%</p>
                  <p className="text-xs text-muted-foreground">の疾患が爪に現れる</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Anatomy */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Anatomy</p>
              <h2 className="text-3xl font-bold text-foreground">{t("anatomy.sectionTitle")}</h2>
              <p className="mt-2 text-base text-muted-foreground">{t("anatomy.subtitle")}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {anatomyParts.map((part, i) => (
                <div key={i} className="rounded-xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-sm font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{part.name}</h3>
                  <p className="text-xs font-medium text-muted-foreground">{part.eng}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{part.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Systemic Diseases */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Systemic Diseases</p>
              <h2 className="text-3xl font-bold text-foreground">{t("systemic.sectionTitle")}</h2>
              <p className="mt-2 text-sm font-semibold text-primary">{t("systemic.subtitle")}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {systemicItems.map((item, i) => (
                <div key={i} className="rounded-xl border border-border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
                      {item.disease.charAt(0)}
                    </span>
                    {item.disease}
                  </h3>
                  <ul className="mb-4 space-y-1">
                    {item.signs.map((sign, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-foreground">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {sign}
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-lg bg-primary/5 px-3 py-2">
                    <p className="text-xs text-muted-foreground">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skin of Color */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Skin of Color</p>
              <h2 className="text-3xl font-bold text-foreground">{t("skinColor.sectionTitle")}</h2>
              <p className="mt-2 text-sm font-semibold text-amber-600">{t("skinColor.subtitle")}</p>
            </div>

            <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
              <p className="text-base leading-relaxed text-muted-foreground">{t("skinColor.description")}</p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                  <h3 className="mb-3 text-base font-bold text-red-800">{t("skinColor.melanonychia.title")}</h3>
                  <p className="text-sm leading-relaxed text-red-700">{t("skinColor.melanonychia.desc")}</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                  <div className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <p className="text-sm leading-relaxed text-amber-800">{t("skinColor.advice")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact on Body */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Health Impact</p>
              <h2 className="text-3xl font-bold text-foreground">{t("importance.sectionTitle")}</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {importanceItems.map((item, i) => (
                <div key={i} className="rounded-xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-lg font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mb-2 text-base font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* History Timeline */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">History</p>
              <h2 className="text-3xl font-bold text-foreground">{t("history.sectionTitle")}</h2>
            </div>
            <p className="mb-10 text-center text-base leading-relaxed text-muted-foreground">
              {t("history.description")}
            </p>
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-px bg-border sm:left-1/2" />
              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <div key={i} className={`relative flex items-start gap-6 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                    <div className="absolute left-4 flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full bg-primary sm:left-1/2">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                    <div className={`ml-10 w-full rounded-lg border border-border bg-white p-4 shadow-sm sm:ml-0 sm:w-5/12 ${i % 2 === 0 ? "sm:mr-auto" : "sm:ml-auto"}`}>
                      <p className="mb-1 text-xs font-semibold text-primary">{item.year}</p>
                      <p className="text-sm text-foreground">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Science Stats */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Science</p>
              <h2 className="text-3xl font-bold text-foreground">{t("science.sectionTitle")}</h2>
              <p className="mt-3 text-base text-muted-foreground">{t("science.description")}</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {stats.map((stat, i) => (
                <div key={i} className="rounded-xl border border-border bg-white p-8 text-center shadow-sm">
                  <p className="text-5xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stat.label}</p>
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
