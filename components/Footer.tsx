"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Nav Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Services */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("services")}
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("top")}
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-diagnosis"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("aiDiagnosis")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("information")}
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("aboutNail")}
                </Link>
              </li>
              <li>
                <Link
                  href="/nail-seitai"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("nailSeitai")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("support")}
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("register")}
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("login")}
                </Link>
              </li>
              <li>
                <Link
                  href="/members/textbook"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("textbook")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("contactLabel")}
            </p>
            <a
              href={`mailto:${t("email")}`}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {t("email")}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 {t("copyright")}
          </p>
          <div className="flex gap-6">
            <span className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-primary">
              {t("privacy")}
            </span>
            <span className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-primary">
              {t("terms")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
