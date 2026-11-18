"use client"

import { useLayoutEffect, useState, type ReactNode } from "react"
import {
  ArrowUpRight,
  ChevronDown,
  GitBranch,
  Github,
  Home,
  LayoutTemplate,
  LogOut,
  Menu,
  Palette,
  Puzzle,
  Settings,
  X,
} from "lucide-react"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/use-translations"
import { useAuth } from "@/hooks/useAuth"
import { SectionLink, type LandingSection } from "@/components/landing/SectionLink"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { barContainer, type ContentWidth } from "./page-width"
import { LanguageSwitch, PreferencesMenu, ThemeSwitch } from "./preferences"

interface HeaderProps {
  className?: string
  variant?: "home" | "dashboard"
  /** Contextual content for the dashboard variant - each route supplies its own. */
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  /**
   * Largura do conteúdo da rota. O header alinha com ela; sem isto o título fica
   * numa coluna e a página em outra. Ver page-width.ts.
   */
  width?: ContentWidth
  /**
   * Controle que precede o título (ex: voltar). Fica FORA do <h1>: heading com
   * botão dentro é lido pelo leitor de tela como parte do título da página.
   */
  leading?: ReactNode
}

const REPO = "https://github.com/LucasHenriqueDiniz/WeebProfile"
/** The bar's height. The hero sizes itself to the first screen minus this (min-h-[calc(100svh-4rem)]). */
const HEADER_HEIGHT = 64
const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
const INK_SHADOW_BAND = "shadow-[3px_3px_0_0_#0f172a]"
const INK_SHADOW_THEME = "shadow-[3px_3px_0_0_hsl(var(--foreground))]"

const SECTION_ICONS: Record<LandingSection, typeof Puzzle> = {
  plugins: Puzzle,
  templates: LayoutTemplate,
  repos: GitBranch,
  styles: Palette,
}
const SECTION_TONES: Record<LandingSection, string> = {
  plugins: "bg-cyan-300",
  templates: "bg-pink-300",
  repos: "bg-lime-300",
  styles: "bg-amber-300",
}

/**
 * Whether the landing's cyan band ([data-header-band], the hero) is under the header.
 * Over the band the header's stickers take the band's colours, which
 * are fixed light in both themes: the old bar stayed in the page's colour, and in the
 * dark theme it laid a 64px dark strip over the top of the cyan hero.
 * A layout effect, so the first paint already has the right colours.
 */
function useBand() {
  const [state, setState] = useState({ onBand: false })
  useLayoutEffect(() => {
    const update = () => {
      const band = document.querySelector("[data-header-band]")
      const onBand = !!band && band.getBoundingClientRect().bottom > HEADER_HEIGHT
      setState((prev) => (prev.onBand === onBand ? prev : { onBand }))
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])
  return state
}

type NavItemData = { label: string; section: LandingSection; href?: string; active: boolean }

/** A page when it has one (Plugins, Templates), the landing section otherwise. */
function NavItem({
  item,
  className,
  onClick,
  children,
}: {
  item: NavItemData
  className: string
  onClick?: () => void
  children?: ReactNode
}) {
  const content = children ?? item.label
  if (!item.href) {
    return (
      <SectionLink section={item.section} className={className} onClick={onClick}>
        {content}
      </SectionLink>
    )
  }
  return (
    <Link href={item.href} className={className} onClick={onClick} aria-current={item.active ? "page" : undefined}>
      {content}
    </Link>
  )
}

function UserAvatar({ src, name }: { src: string | null; name: string }) {
  // The fallback is React state: the version before this wrote innerHTML into a node
  // React owns, with user data in it.
  const [failed, setFailed] = useState(false)
  return (
    <span className="flex h-7 w-7 flex-none overflow-hidden rounded-full">
      {src && !failed ? (
        <img src={src} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-pink-300 text-xs font-bold text-slate-900">
          {name.charAt(0).toUpperCase() || "?"}
        </span>
      )}
    </span>
  )
}

export function Header({ className, variant, title, description, actions, width = "app", leading }: HeaderProps) {
  const pathname = usePathname()
  const detectedVariant = variant ?? (pathname?.startsWith("/dashboard") ? "dashboard" : "home")

  if (detectedVariant === "home") return <SiteHeader className={className} />

  // Dashboard variant - contextual per route: each page supplies title/description/actions
  // instead of the header being a fixed, mostly-empty bar. Sidebar-toggle and identity live
  // in the sidebar now, not here - this bar's only job is "what am I looking at, what can I
  // do about it".
  return (
    <header className={cn("sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl", className)}>
      {/* Mesma calha do conteúdo da rota, sem herdar o limite de largura dele: as
          ações precisam chegar na borda direita. Ver barContainer em page-width.ts. */}
      <div className={cn(barContainer(width), "flex min-h-16 items-center justify-between gap-4 py-3")}>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {leading}
          {/* O bloco de texto é que trunca, não o <h1> sozinho: com `leading` ao lado,
              truncar no h1 deixava a descrição alinhada na borda do container enquanto
              o título começava depois do botão. */}
          <div className="min-w-0">
            {title && <h1 className="font-heading text-lg md:text-xl font-bold text-foreground truncate">{title}</h1>}
            {description && <p className="text-xs md:text-sm text-muted-foreground truncate mt-0.5">{description}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
          <div className="hidden md:flex items-center pl-2 ml-1 border-l border-border">
            <PreferencesMenu tone="theme" />
          </div>
        </div>
      </div>
    </header>
  )
}

/**
 * The public site's bar (landing, /plugins, /templates), in the landing's sticker look:
 * a tilted name tag for a logo, the nav as a segmented control, a pink sticker button.
 * Language and theme sit behind one small menu (PreferencesMenu); on phones they are
 * inline in the menu sheet.
 */
function SiteHeader({ className }: { className?: string }) {
  const t = useTranslations("header")
  const tNav = useTranslations("landing.nav")
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const { onBand } = useBand()

  const tone = onBand ? "band" : "theme"
  const inkBorder = onBand ? "border-slate-900" : "border-foreground"
  const inkShadow = onBand ? INK_SHADOW_BAND : INK_SHADOW_THEME
  const surface = onBand ? "bg-white" : "bg-card"
  const box = cn("flex items-center rounded-xl border-2 p-0.5", inkBorder, surface)
  const divider = cn("mx-0.5 h-4 w-px", onBand ? "bg-slate-300" : "bg-border")
  const segment = (active: boolean) =>
    cn(
      "rounded-[9px] px-3 py-1 text-[13px] font-semibold transition-colors",
      FOCUS,
      active
        ? onBand
          ? "bg-slate-900 text-white"
          : "bg-foreground text-background"
        : onBand
          ? "text-slate-600 hover:text-slate-900"
          : "text-muted-foreground hover:text-foreground"
    )
  const tool = cn(
    "inline-flex h-8 min-w-8 items-center justify-center rounded-[9px] px-1.5 transition-colors",
    FOCUS,
    onBand
      ? "text-slate-600 hover:bg-cyan-100 hover:text-slate-900"
      : "text-muted-foreground hover:bg-accent hover:text-foreground"
  )
  const cta = cn(
    "inline-flex h-9 items-center whitespace-nowrap rounded-lg border-2 bg-pink-300 px-4 text-sm font-bold text-slate-950 transition-all hover:translate-x-px hover:translate-y-px hover:bg-pink-200",
    FOCUS,
    inkBorder,
    inkShadow
  )

  // Plugins and Templates have pages of their own; Repos and Styles exist only as
  // sections of the landing. SectionLink points at "/" with the hash off the landing.
  const items: NavItemData[] = [
    { label: tNav("plugins"), section: "plugins", href: "/plugins", active: pathname.startsWith("/plugins") },
    { label: tNav("templates"), section: "templates", href: "/templates", active: pathname.startsWith("/templates") },
    { label: tNav("repos"), section: "repos", active: false },
    { label: tNav("styles"), section: "styles", active: false },
  ]

  const name = user?.user_metadata.user_name || user?.user_metadata.full_name || user?.email || ""
  const avatar = user?.user_metadata.avatar_url || user?.user_metadata.picture || null
  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }
  const github = (
    <a href={REPO} target="_blank" rel="noopener noreferrer" className={tool} aria-label="GitHub">
      <Github className="h-4 w-4" />
    </a>
  )

  return (
    <header
      className={cn(
        // No bar behind it: the logo, the nav and the buttons are stickers of their own that
        // float over the page, so only they catch the pointer and the page between them
        // stays clickable.
        "pointer-events-none fixed inset-x-0 top-0 z-50",
        onBand ? "text-slate-900" : "text-foreground",
        className
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:gap-6 [&>*]:pointer-events-auto">
        <Link
          href="/"
          aria-label="WeebProfile"
          className={cn("group relative flex flex-none items-center rounded-lg pl-5", FOCUS)}
        >
          <img
            src="/sora/sora-head.png"
            alt=""
            className="absolute -left-1 top-1/2 z-10 h-9 w-9 -translate-y-1/2 object-contain drop-shadow-[2px_2px_0_rgba(15,23,42,0.9)] transition-transform group-hover:-rotate-12"
          />
          <span
            className={cn(
              "-rotate-2 rounded-lg border-2 bg-cyan-300 py-0.5 pl-5 pr-2.5 font-heading text-base font-extrabold tracking-tight text-slate-900 transition-transform group-hover:rotate-0",
              inkBorder,
              inkShadow
            )}
          >
            {/* The full name needs ~400px beside the button and the menu. */}
            <span className="hidden min-[400px]:inline">WeebProfile</span>
            <span className="min-[400px]:hidden">WP</span>
          </span>
        </Link>

        <div className={cn(box, "hidden md:flex")}>
          {items.map((item) => (
            <NavItem key={item.label} item={item} className={segment(item.active)} />
          ))}
        </div>

        <div className="ml-auto flex flex-none items-center gap-2">
          <div className={cn(box, "hidden sm:flex")}>
            <PreferencesMenu tone={tone} />
            <span className={divider} />
            {github}
          </div>
          {user ? (
            <>
              <Link href="/dashboard" className={cn(cta, "hidden sm:inline-flex")}>
                {t("dashboard")}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label={t("myAccount")}
                  className={cn(
                    "flex items-center gap-2 rounded-full border-2 py-0.5 pl-0.5 pr-2 text-sm font-semibold xl:pr-3",
                    inkBorder,
                    surface,
                    FOCUS
                  )}
                >
                  <UserAvatar src={avatar} name={name} />
                  {/* From 1280px only: at 1024 the name pushed the menu past the edge. */}
                  <span className="hidden max-w-[120px] truncate xl:inline">{name}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="w-56 rounded-xl border-2 border-foreground p-1.5 shadow-[4px_4px_0_0_hsl(var(--primary))]"
                >
                  <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link href="/dashboard">
                      <Home className="mr-2 h-4 w-4" />
                      {t("dashboard")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      {t("settings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-lg text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  "hidden h-9 items-center rounded-lg border-2 px-3 text-sm font-semibold sm:inline-flex",
                  inkBorder,
                  surface,
                  FOCUS
                )}
              >
                {tNav("signIn")}
              </Link>
              <Link href="/login" className={cta}>
                {tNav("cta")}
              </Link>
            </>
          )}
          <button
            type="button"
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 md:hidden",
              inkBorder,
              surface,
              FOCUS
            )}
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            // No aria-controls: the sheet is rendered only while open, so closed it would
            // point at an id that is not in the DOM. aria-expanded carries the state.
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t-2 md:hidden",
            onBand ? "border-slate-900 bg-cyan-100" : "border-foreground bg-background"
          )}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 sm:px-6">
            {items.map((item, index) => {
              const Icon = SECTION_ICONS[item.section]
              return (
                <NavItem
                  key={item.label}
                  item={item}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border-2 px-4 py-3 font-heading text-xl font-extrabold",
                    inkBorder,
                    inkShadow,
                    surface,
                    index % 2 ? "rotate-[0.6deg]" : "-rotate-[0.6deg]"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl border-2 border-slate-900 text-slate-900",
                      SECTION_TONES[item.section]
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  {item.label}
                  {item.href && <ArrowUpRight className="ml-auto h-5 w-5 opacity-60" />}
                </NavItem>
              )
            })}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className={box}>
                <LanguageSwitch tone={tone} />
              </div>
              <div className={box}>
                <ThemeSwitch tone={tone} />
              </div>
              <div className={box}>{github}</div>
              <Link
                href={user ? "/dashboard" : "/login"}
                onClick={() => setMenuOpen(false)}
                className="ml-auto text-sm font-semibold underline decoration-2 underline-offset-4"
              >
                {user ? t("dashboard") : tNav("signIn")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
