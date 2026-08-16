"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, useScroll, useTransform } from "framer-motion"
import { Github, Menu, Sparkles, X, Home, LogOut, Languages } from "lucide-react"
import { usePathname, useRouter, Link } from "@/i18n/navigation"
import { useState, type ReactNode } from "react"
import { useAuth } from "@/hooks/useAuth"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTranslations } from "@/i18n/use-translations"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { LanguageSelector } from "./LanguageSelector"
import { barContainer, type ContentWidth } from "./page-width"

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

// Avatar component - simple implementation
const Avatar = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>{children}</div>
)
const AvatarImage = ({ src, alt, className }: { src?: string; alt?: string; className?: string }) =>
  src ? <img src={src} alt={alt} className={cn("aspect-square h-full w-full", className)} /> : null
const AvatarFallback = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}>
    {children}
  </div>
)

export function Header({ className, variant, title, description, actions, width = "app", leading }: HeaderProps) {
  const t = useTranslations("header")
  const tLanding = useTranslations("landing.nav")
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false)

  const detectedVariant =
    variant ||
    (() => {
      if (pathname === "/") return "home"
      if (pathname?.startsWith("/dashboard")) return "dashboard"
      return "home"
    })()

  // Opacidade controlada via MotionValue numerico + CSS var: os valores antigos eram
  // rgba fixos de tema escuro, entao no tema claro o header escurecia ao rolar.
  const { scrollY } = useScroll()
  const headerBgAlpha = useTransform(scrollY, [0, 100], [0, 0.85])
  const headerBorderAlpha = useTransform(scrollY, [0, 100], [0, 0.6])

  // Home nav mirrors the landing sections (in-page anchors) plus the external docs.
  const navigation = [
    { name: tLanding("plugins"), href: "#plugins", anchor: true },
    { name: tLanding("templates"), href: "#templates", anchor: true },
    { name: tLanding("repos"), href: "#repos", anchor: true },
    { name: tLanding("styles"), href: "#styles", anchor: true },
    { name: tLanding("docs"), href: "https://github.com/LucasHenriqueDiniz/WeebProfile", anchor: true },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push("/login" as any)
  }

  // Home variant
  if (detectedVariant === "home") {
    return (
      <motion.header
        style={
          {
            "--header-bg-alpha": headerBgAlpha,
            "--header-border-alpha": headerBorderAlpha,
            backgroundColor: "hsl(var(--background) / var(--header-bg-alpha))",
            borderBottomColor: "hsl(var(--border) / var(--header-border-alpha))",
          } as any
        }
        className={cn("fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl transition-all", className)}
      >
        {/* Alinhado ao grid da landing (max-w-6xl/px-6), nao ao container full-width —
            o header antigo desalinhava com todo o conteudo abaixo dele. */}
        <nav className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
          {/* Logo */}
          <Link href="/" className="group flex flex-shrink-0 items-center gap-2" locale={undefined}>
            <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <img src="/sora/sora-head.png" alt="Sora" className="w-8 h-8 object-contain drop-shadow-lg" />
            </motion.div>
            <span className="font-sora text-lg font-black bg-gradient-to-r from-violet-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">
              WeebProfile
            </span>
          </Link>

          {/* Desktop Navigation — links de texto simples, sem caixas de botao */}
          <div className="hidden flex-1 items-center gap-5 md:flex">
            {navigation.map((item) =>
              item.anchor ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild className="hidden h-9 w-9 sm:inline-flex">
                  <Link
                    href="https://github.com/LucasHenriqueDiniz/WeebProfile"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>GitHub</TooltipContent>
            </Tooltip>

            {/* Language Selector Button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden h-9 w-9 sm:inline-flex"
              onClick={() => setLanguageSelectorOpen(true)}
            >
              <Languages className="w-4 h-4" />
            </Button>

            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <span className="mx-1 hidden h-5 w-px bg-border sm:block" />

            {user ? (
              <>
                <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
                  <Link href="/dashboard" locale={undefined}>
                    Dashboard
                  </Link>
                </Button>
                <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-auto px-2 py-1.5 gap-2">
                      <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url || user.user_metadata?.picture || "/sora/sora-head.png"}
                          alt={user.user_metadata?.user_name || user.user_metadata?.full_name || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500">
                          <img
                            src="/sora/sora-head.png"
                            alt="Sora"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                              if (target.parentElement) {
                                target.parentElement.innerHTML =
                                  user.user_metadata?.user_name?.charAt(0)?.toUpperCase() ||
                                  user.user_metadata?.full_name?.charAt(0)?.toUpperCase() ||
                                  user.email?.charAt(0)?.toUpperCase() ||
                                  "?"
                              }
                            }}
                          />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/dashboard" as any)}>
                      <Home className="w-4 h-4 mr-2" />
                      {t("dashboard")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguageSelectorOpen(true)}>
                      <Languages className="w-4 h-4 mr-2" />
                      {t("changeLanguage")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      {t("signOut")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                  <Link href="/login" locale={undefined}>
                    {tLanding("signIn")}
                  </Link>
                </Button>

                {/* Mesmo gradiente violeta→rosa dos CTAs da landing, nao o triplo antigo */}
                <Button
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] hover:opacity-90"
                >
                  <Link href="/login" locale={undefined}>
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    {tLanding("cta")}
                  </Link>
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            {/* Mesmo grid do <nav> acima: o menu abre colado nele, então tem que
                começar na mesma coluna. */}
            <div className="mx-auto max-w-6xl px-6 py-4 space-y-2">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.anchor ? <a href={item.href}>{item.name}</a> : <Link href={item.href}>{item.name}</Link>}
                </Button>
              ))}
              <div className="pt-2 border-t border-border/50">
                <Button variant="ghost" size="sm" asChild className="w-full justify-start sm:hidden">
                  <Link
                    href="https://github.com/LucasHenriqueDiniz/WeebProfile"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Language Selector Modal */}
        <LanguageSelector open={languageSelectorOpen} onOpenChange={setLanguageSelectorOpen} />
      </motion.header>
    )
  }

  // Dashboard variant - contextual per route: each page supplies title/description/actions
  // instead of the header being a fixed, mostly-empty bar. Sidebar-toggle and identity live
  // in the sidebar now, not here - this bar's only job is "what am I looking at, what can I
  // do about it".
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
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
          <div className="hidden md:flex items-center gap-1 pl-2 ml-1 border-l border-border">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-muted/80 transition-colors"
                  onClick={() => setLanguageSelectorOpen(true)}
                >
                  <Languages className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("changeLanguage")}</TooltipContent>
            </Tooltip>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Language Selector Modal */}
      <LanguageSelector open={languageSelectorOpen} onOpenChange={setLanguageSelectorOpen} />
    </header>
  )
}
