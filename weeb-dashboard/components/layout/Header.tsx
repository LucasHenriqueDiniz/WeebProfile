"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Github,
  Menu,
  Sparkles,
  X,
  Eye,
  EyeOff,
  Home,
  Settings,
  LogOut,
  User,
  Image as ImageIcon,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface HeaderProps {
  className?: string
  variant?: "home" | "dashboard" | "wizard"
  title?: string
  description?: string
  showSidebarToggle?: boolean
  onSidebarToggle?: () => void
  showPreview?: boolean
  onTogglePreview?: () => void
  stats?: {
    style: string
    theme: string
    plugins: number
    sections: number
  }
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

export function Header({
  className,
  variant,
  title,
  stats,
  description,
  showSidebarToggle,
  onSidebarToggle,
  showPreview,
  onTogglePreview,
}: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Auto-detect variant from pathname if not provided
  const detectedVariant =
    variant ||
    (() => {
      if (pathname === "/") return "home"
      if (pathname === "/dashboard/new" || pathname?.match(/^\/dashboard\/[^/]+\/edit$/)) return "wizard"
      if (pathname?.startsWith("/dashboard")) return "dashboard"
      return "home"
    })()

  const { scrollY } = useScroll()

  const headerBg = useTransform(scrollY, [0, 100], ["rgba(2, 6, 23, 0)", "rgba(2, 6, 23, 0.8)"])

  const headerBorder = useTransform(scrollY, [0, 100], ["rgba(148, 163, 184, 0)", "rgba(148, 163, 184, 0.1)"])

  const navigation = [
    { name: "Plugins", href: "/plugins" },
    { name: "Templates", href: "/templates" },
    { name: "Docs", href: "/docs" },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  // Home variant
  if (detectedVariant === "home") {
    return (
      <motion.header
        style={{
          backgroundColor: headerBg,
          borderBottomColor: headerBorder,
        }}
        className={cn("fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl transition-all", className)}
      >
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div className="relative" whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 blur-md opacity-50 -z-10" />
            </motion.div>
            <span className="text-xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              WeebProfile
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors"
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link href="https://github.com/LucasHenriqueDiniz/WeebProfile" target="_blank" rel="noopener noreferrer">
                <Tooltip>
                  <TooltipTrigger>
                    <Github />
                  </TooltipTrigger>
                  <TooltipContent>Github</TooltipContent>
                </Tooltip>
              </Link>
            </Button>

            {user ? (
              <>
                <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-auto px-2 py-1.5 gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url}
                          alt={user.user_metadata?.user_name || user.email || "User"}
                        />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                      <Home className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
                  <Link href="/login">Sign in</Link>
                </Button>

                <Button
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 shadow-lg shadow-pink-500/20"
                >
                  <Link href="/login">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Get Started
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
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Button>
                </Link>
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
      </motion.header>
    )
  }

  // Dashboard variant
  if (detectedVariant === "dashboard") {
    return (
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          {/* Left */}
          <div className="flex items-center gap-4">
            {showSidebarToggle && onSidebarToggle && (
              <Button variant="ghost" size="icon" onClick={onSidebarToggle} className="h-9 w-9">
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-bold text-lg">WeebProfile</span>
            </div>

            {title && (
              <>
                <div className="h-6 w-px bg-border" />
                <div>
                  {title && <h1 className="text-lg font-semibold">{title}</h1>}
                  {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
              </>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="h-6 w-px bg-border" />

            {user && (
              <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-auto px-2 py-1.5 gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.user_metadata?.user_name || user.email || "User"}
                      />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium">
                        {user.user_metadata?.user_name || user.email?.split("@")[0] || "Usuário"}
                      </div>
                      {user.user_metadata?.user_name && user.email && (
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
    )
  }

  // Wizard variant
  if (detectedVariant === "wizard") {
    return (
      <nav className="border-b px-6 py-3 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="font-bold text-lg">WeebProfile</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Stats */}
          {stats && (
            <div className="hidden md:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Style:</span>
                <span className="font-semibold capitalize">{stats.style}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Theme:</span>
                <span className="font-semibold capitalize">{stats.theme}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Plugins:</span>
                <span className="font-semibold">{stats.plugins}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Sections:</span>
                <span className="font-semibold">{stats.sections}</span>
              </div>
            </div>
          )}

          {onTogglePreview && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onTogglePreview}
              className={cn(showPreview && "bg-primary/10 text-primary")}
              title={showPreview ? "Ocultar Preview" : "Mostrar Preview"}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          )}

          <ThemeToggle />
          <div className="h-6 w-px bg-border"></div>

          {user && (
            <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto px-2 py-1.5 gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={user.user_metadata?.user_name || user.email || "User"}
                    />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium">
                      {user.user_metadata?.user_name || user.email?.split("@")[0] || "Usuário"}
                    </div>
                    {user.user_metadata?.user_name && user.email && (
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    )}
                  </div>
                  <ChevronRight className="w-3 h-3 rotate-90 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata?.user_name || user.email?.split("@")[0] || "Usuário"}
                    </p>
                    {user.user_metadata?.user_name && user.email && (
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    )
  }

  return null
}
