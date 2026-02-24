"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a7 7 0 0 1 7 7c0 3.5-2.5 6.5-4 8l-3 3-3-3c-1.5-1.5-4-4.5-4-8a7 7 0 0 1 7-7z" />
                  <circle cx="12" cy="9" r="2" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <p className="text-sm font-bold text-foreground">爪整体 AI診断</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Nail Seitai AI Diagnosis
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contact
            </p>
            <a
              href={`mailto:${t("email")}`}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {t("email")}
            </a>
          </div>

          {/* Links */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Legal
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

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; 2026 {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
