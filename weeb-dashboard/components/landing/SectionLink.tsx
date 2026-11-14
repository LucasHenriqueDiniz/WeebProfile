"use client"

import { forwardRef, type AnchorHTMLAttributes } from "react"
import { Link, usePathname } from "@/i18n/navigation"

export type LandingSection = "plugins" | "templates" | "repos" | "styles"

interface SectionLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  section: LandingSection
}

/**
 * A link to a section of the landing page that works from any route.
 *
 * The header and the footer used bare "#plugins" anchors, which only mean something
 * on "/": from /templates or /plugins they became /templates#plugins and the page
 * did not move. Off the landing this goes to "/" with the hash instead, and the
 * landing scrolls to the section once it has mounted (src/routes/home.tsx).
 *
 * Forwards ref and props so it can sit under a Button with asChild.
 */
export const SectionLink = forwardRef<HTMLAnchorElement, SectionLinkProps>(({ section, children, ...props }, ref) => {
  const pathname = usePathname()
  if (pathname === "/") {
    return (
      <a ref={ref} href={`#${section}`} {...props}>
        {children}
      </a>
    )
  }
  return (
    <Link ref={ref} href="/" hash={section} {...(props as Record<string, unknown>)}>
      {children}
    </Link>
  )
})
SectionLink.displayName = "SectionLink"
