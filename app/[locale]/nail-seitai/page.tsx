import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NailSeitaiPage() {
  const t = useTranslations("nailSeitai");

  const features = t.raw("what.features") as {
    title: string;
    description: string;
  }[];

  const sportsItems = t.raw("sports.items") as {
    sport: string;
    benefit: string;
  }[];

  const steps = t.raw("treatment.steps") as {
    step: string;
    title: string;
    description: string;
  }[];

  const cases = t.raw("cases.items") as {
    name: string;
    before: string;
    after: string;
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
                <Link
                  href="/ai-diagnosis"
                  className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-primary-dark hover:shadow-lg"
                >
                  {t("cta.button")}
                </Link>
              </div>
              <div className="relative">
                <div className="overflow-hidden rounded-2xl shadow-xl">
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

        {/* What is Nail Seitai */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                About
              </p>
              <h2 className="text-3xl font-bold text-foreground">
                {t("what.sectionTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
                {t("what.description")}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <svg
                      className="h-5 w-5 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-base font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sports Performance */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                Sports
              </p>
              <h2 className="text-3xl font-bold text-foreground">
                {t("sports.sectionTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
                {t("sports.description")}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {sportsItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-xl border border-border bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white text-sm font-bold">
                    {item.sport.charAt(0)}
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-bold text-foreground">
                      {item.sport}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.benefit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Treatment Steps */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                Process
              </p>
              <h2 className="text-3xl font-bold text-foreground">
                {t("treatment.sectionTitle")}
              </h2>
            </div>
            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
                    <span className="text-xl font-bold">{step.step}</span>
                  </div>
                  <div className="flex-1 rounded-xl border border-border bg-white p-6 shadow-sm">
                    <h3 className="mb-2 text-base font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Before & After Cases */}
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                Cases
              </p>
              <h2 className="text-3xl font-bold text-foreground">
                {t("cases.sectionTitle")}
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {cases.map((c, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
                >
                  <div className="bg-primary/5 px-6 py-4">
                    <p className="text-sm font-semibold text-foreground">
                      {c.name}
                    </p>
                  </div>
                  <div className="space-y-4 p-6">
                    <div>
                      <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-warning">
                        <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                        Before
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {c.before}
                      </p>
                    </div>
                    <div className="h-px bg-border" />
                    <div>
                      <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        After
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {c.after}
                      </p>
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
