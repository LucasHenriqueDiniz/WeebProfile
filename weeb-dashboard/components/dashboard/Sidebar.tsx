"use client"

import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  LayoutGrid,
  Plus,
  Settings,
  LogOut,
  X,
  Sparkles,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
  onToggle?: () => void
}

const navItems = [
  {
    label: "My SVGs",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    label: "Create New",
    href: "/dashboard/new",
    icon: Plus,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar({ isOpen, onClose, onToggle }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const isMobile = useIsMobile()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
      router.push("/login")
    }
  }

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  return (
    <>
      {/* Overlay para mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : (isMobile ? -280 : 0),
          width: !isMobile && !isOpen ? "4rem" : "16rem",
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn(
          "border-r border-border/50 bg-gradient-to-b from-background to-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90",
          "flex flex-col z-50 shadow-lg overflow-hidden",
          isMobile
            ? "fixed left-0 top-0 h-screen w-64"
            : "relative h-full"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-50" />
          <Link href="/" className={cn(
            "flex items-center gap-3 hover:opacity-90 transition-opacity flex-1 relative z-10 group min-w-0",
            !isOpen && !isMobile && "justify-center"
          )}>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <img
                  src="/sora/sora-head.png"
                  alt="Sora"
                  className="w-8 h-8 object-contain drop-shadow-lg filter group-hover:brightness-110 transition-all"
                />
              </div>
            </motion.div>
            {(isOpen || isMobile) && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-base bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent truncate">
                    WeebProfile
                  </h1>
                  <Sparkles className="w-3 h-3 text-primary/60 flex-shrink-0" />
                </div>
              </div>
            )}
          </Link>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 relative z-10"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href} onClick={handleLinkClick}>
                <div
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive && "text-primary-foreground"
                  )} />
                  {(isOpen || isMobile) && (
                    <span className={cn(
                      "text-sm font-medium",
                      isActive && "text-primary-foreground"
                    )}>
                      {item.label}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-border/50 bg-gradient-to-t from-muted/20 to-transparent">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted",
                  !isOpen && !isMobile && "justify-center"
                )}>
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-full ring-2 ring-primary/20 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                        <img 
                          src={user.user_metadata?.avatar_url || user.user_metadata?.picture} 
                          alt={user.user_metadata?.user_name || user.email || "User"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            if (target.parentElement) {
                              target.parentElement.innerHTML = user.user_metadata?.user_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"
                              target.parentElement.className += " text-white text-sm font-bold"
                            }
                          }}
                        />
                      ) : (
                        <span className="text-white text-sm font-bold">
                          {user.user_metadata?.user_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
                  </div>
                  {(isOpen || isMobile) && (
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-sm font-medium truncate">
                        {user.user_metadata?.user_name || user.email?.split("@")[0] || "Usuário"}
                      </div>
                      {user.email && (
                        <div className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">
                      {user.user_metadata?.user_name || user.email?.split("@")[0] || "Usuário"}
                    </span>
                    {user.email && (
                      <span className="text-xs text-muted-foreground font-normal">
                        {user.email}
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </motion.aside>
    </>
  )
}

