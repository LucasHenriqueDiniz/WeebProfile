"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Github,
  Menu,
  PanelLeft,
  Sparkles,
  X,
  Home,
  Settings,
  LogOut,
  ArrowLeft,
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
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface HeaderProps {
  className?: string
  variant?: "home" | "dashboard"
  showSidebarToggle?: boolean
  onSidebarToggle?: () => void
  isSidebarOpen?: boolean
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
  showSidebarToggle,
  onSidebarToggle,
  isSidebarOpen,
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
      if (pathname?.startsWith("/dashboard")) return "dashboard"
      return "home"
    })()

  const { scrollY } = useScroll()

  const headerBg = useTransform(scrollY, [0, 100], ["rgba(2, 6, 23, 0)", "rgba(2, 6, 23, 0.8)"])
  const headerBorder = useTransform(scrollY, [0, 100], ["rgba(148, 163, 184, 0)", "rgba(148, 163, 184, 0.1)"])

  const navigation = [
    { name: "Templates", href: "/templates" },
    { name: "Docs", href: "/docs" },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const isWizardPage = pathname === "/dashboard/new" || pathname?.match(/^\/dashboard\/[^/]+\/edit$/)

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
            <motion.div 
              className="relative" 
              whileHover={{ scale: 1.05 }} 
              transition={{ duration: 0.2 }}
            >
              <img
                src="/sora/sora-head.png"
                alt="Sora"
                className="w-8 h-8 object-contain drop-shadow-lg"
              />
            </motion.div>
            <span className="text-xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent font-sora">
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
                      <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url || user.user_metadata?.picture || "/sora/sora-head.png"}
                          alt={user.user_metadata?.user_name || user.user_metadata?.full_name || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500">
                          <img 
                            src="/sora/sora-head.png" 
                            alt="Sora" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              if (target.parentElement) {
                                target.parentElement.innerHTML = user.user_metadata?.user_name?.charAt(0)?.toUpperCase() ||
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

  // Dashboard variant (works with or without sidebar)
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Sidebar toggle - only show if sidebar is available */}
          {showSidebarToggle && onSidebarToggle && !isWizardPage && (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onSidebarToggle} 
                className="h-9 w-9 hover:bg-muted/80 transition-colors"
              >
                {isSidebarOpen ? (
                  <Menu className="w-5 h-5" />
                ) : (
                  <PanelLeft className="w-5 h-5" />
                )}
              </Button>
              <div className="h-6 w-px bg-border/50" />
            </>
          )}
          
          {/* Back button for wizard pages */}
          {isWizardPage && (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push("/dashboard")} 
                className="h-9 w-9 hover:bg-muted/80 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="h-6 w-px bg-border/50" />
            </>
          )}

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img
              src="/sora/sora-head.png"
              alt="Sora"
              className="w-8 h-8 object-contain drop-shadow-lg"
            />
            <span className="font-bold text-lg font-sora">WeebProfile</span>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="h-6 w-px bg-border/50" />

          {user && (
            <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto px-2 py-1.5 gap-2.5 hover:bg-muted/80 transition-colors">
                  <div className="relative">
                    <Avatar className="h-9 w-9 ring-2 ring-primary/20 shadow-md">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                        alt={user.user_metadata?.user_name || user.user_metadata?.full_name || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-bold shadow-lg">
                        {user.user_metadata?.user_name?.charAt(0)?.toUpperCase() ||
                          user.user_metadata?.full_name?.charAt(0)?.toUpperCase() ||
                          user.email?.charAt(0)?.toUpperCase() ||
                          "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background shadow-sm" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-semibold">
                      {user.user_metadata?.user_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuário"}
                    </div>
                    {user.user_metadata?.user_name && user.email && (
                      <div className="text-xs text-muted-foreground leading-tight">
                        {user.email}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground hidden sm:block rotate-[-90deg]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">Minha Conta</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer focus:text-destructive">
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
