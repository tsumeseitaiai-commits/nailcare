import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const t = useTranslations("about");

  const importanceItems = t.raw("importance.items") as {
    title: string;
    description: string;
  }[];

  const timeline = t.raw("history.timeline") as {
    year: string;
    event: string;
  }[];

  const stats = t.raw("science.stats") as {
    value: string;
    label: string;
  }[];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-accent/5 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                  {t("hero.badge")}
                </p>
                <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                  {t("hero.title")}
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {t("hero.description")}
                </p>
              </div>
              <div className="relative">
                <div className="overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src="/images/optimized/healthnail.webp"
                    alt="Healthy Nails"
                    width={600}
                    height={400}
                    className="h-72 w-full object-cover lg:h-96"
                    priority
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 rounded-xl border border-border bg-white p-4 shadow-lg">
                  <p className="text-2xl font-bold text-primary">87%</p>
                  <p className="text-xs text-muted-foreground">疾患が爪に現れる</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Importance */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                Health Impact
              </p>
              <h2 className="text-3xl font-bold text-foreground">
                {t("importance.sectionTitle")}
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {importanceItems.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-lg font-bold text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mb-2 text-base font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* History */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                History
              </p>
              <h2 className="text-3xl font-bold text-foreground">
                {t("history.sectionTitle")}
              </h2>
            </div>
            <p className="mb-10 text-center text-base leading-relaxed text-muted-foreground">
              {t("history.description")}
            </p>
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-px bg-border sm:left-1/2" />
              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <div
                    key={i}
                    className={`relative flex items-start gap-6 ${
                      i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                    }`}
                  >
                    <div className="absolute left-4 flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full bg-primary sm:left-1/2">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                    <div
                      className={`ml-10 w-full rounded-lg border border-border bg-white p-4 shadow-sm sm:ml-0 sm:w-5/12 ${
                        i % 2 === 0 ? "sm:mr-auto" : "sm:ml-auto"
                      }`}
                    >
                      <p className="mb-1 text-xs font-semibold text-primary">
                        {item.year}
                      </p>
                      <p className="text-sm text-foreground">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Science */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                Science
              </p>
              <h2 className="text-3xl font-bold text-foreground">
                {t("science.sectionTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
                {t("science.description")}
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-white p-8 text-center shadow-sm"
                >
                  <p className="text-5xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {stat.label}
                  </p>
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
