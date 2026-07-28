"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"

const GITHUB_REPO_URL = "https://github.com/LucasHenriqueDiniz/WeebProfile"

export function LandingFooter() {
  const t = useTranslations("landing")

  const columns: Array<{ heading: string; links: Array<{ label: string; href: string; external?: boolean }> }> = [
    {
      heading: t("footer.product"),
      links: [
        { label: t("nav.plugins"), href: "#plugins" },
        { label: t("nav.templates"), href: "#templates" },
        { label: t("nav.repos"), href: "#repos" },
        { label: t("nav.styles"), href: "#styles" },
      ],
    },
    {
      heading: t("footer.project"),
      links: [
        { label: t("footer.repo"), href: GITHUB_REPO_URL, external: true },
        { label: t("footer.gallery"), href: `${GITHUB_REPO_URL}/blob/main/docs/plugins.md`, external: true },
        { label: t("footer.discussions"), href: `${GITHUB_REPO_URL}/discussions`, external: true },
      ],
    },
  ]

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-10 px-6 py-11">
        <div className="max-w-[280px]">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/sora/sora-head.png" alt="" className="h-6 w-6 object-contain" />
            <img src="/weebprofile.png" alt="WeebProfile" className="h-[18px] w-auto object-contain" />
          </Link>
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground/80">{t("footer.tagline")}</p>
        </div>
        <div className="flex flex-wrap gap-14">
          {columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-2.5">
              <div className="text-[11.5px] font-semibold tracking-[0.12em] text-muted-foreground/60">
                {col.heading}
              </div>
              {col.links.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
