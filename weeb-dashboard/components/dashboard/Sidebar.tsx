"use client"

import { useRouter, usePathname, Link } from "@/i18n/navigation"
import { LayoutGrid, Plus, Settings, LogOut, Sparkles } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/i18n/use-translations"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function DashboardSidebar() {
  const t = useTranslations("sidebar")
  const tHeader = useTranslations("header")
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const navItems = [
    {
      label: t("mySvgs"),
      href: "/dashboard",
      icon: LayoutGrid,
    },
    {
      label: t("createNew"),
      href: "/dashboard/new",
      icon: Plus,
    },
    {
      label: t("settings"),
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
      router.push("/login")
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="relative">
            <img
              src="/sora/sora-head.png"
              alt="Sora"
              className="w-8 h-8 object-contain drop-shadow-lg transition-transform group-hover:scale-110"
            />
          </div>
          <div className="group-data-[collapsible=icon]:hidden flex items-center gap-1.5">
            <h1 className="font-bold text-base bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              WeebProfile
            </h1>
            <Sparkles className="w-3 h-3 text-primary/60 flex-shrink-0" />
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">{t("navigation")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon
                // Pathname agora inclui locale (ex: /pt/dashboard), então verificar se termina com o href
                const isActive = pathname === item.href || pathname?.endsWith(item.href)

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-sidebar-border">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-sidebar-accent group-data-[collapsible=icon]:justify-center">
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full ring-2 ring-primary/20 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                      <img
                        src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                        alt={user.user_metadata?.user_name || user.email || "User"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          if (target.parentElement) {
                            target.parentElement.innerHTML =
                              user.user_metadata?.user_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"
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
                <div className="group-data-[collapsible=icon]:hidden flex-1 min-w-0 text-left">
                  <div className="text-sm font-medium truncate">
                    {user.user_metadata?.user_name || user.email?.split("@")[0] || t("user")}
                  </div>
                  {user.email && <div className="text-xs text-muted-foreground truncate">{user.email}</div>}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="top"
              sideOffset={8}
              className="w-64 rounded-lg border shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 origin-bottom"
            >
              <DropdownMenuLabel className="flex flex-col gap-1.5 px-3 py-2.5">
                <span className="text-sm font-semibold">
                  {user.user_metadata?.user_name || user.email?.split("@")[0] || t("user")}
                </span>
                {user.email && <span className="text-xs text-muted-foreground font-normal">{user.email}</span>}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
                className="cursor-pointer px-3 py-2.5 rounded-md mx-1 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2.5" />
                {tHeader("settings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive cursor-pointer px-3 py-2.5 rounded-md mx-1 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2.5" />
                {tHeader("signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
