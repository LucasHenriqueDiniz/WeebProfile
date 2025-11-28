"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, Settings, LogOut, User, Plus, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
}

// Avatar component - simple implementation
const Avatar = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>
    {children}
  </div>
)
const AvatarImage = ({ src, alt, className }: { src?: string; alt?: string; className?: string }) =>
  src ? <img src={src} alt={alt} className={cn("aspect-square h-full w-full", className)} /> : null
const AvatarFallback = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}>
    {children}
  </div>
)

export function DashboardHeader({ title, description, action }: DashboardHeaderProps) {
  const router = useRouter()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5" />
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
          {action && (
            <>
              <Button onClick={action.onClick} size="sm">
                {action.icon}
                {action.label}
              </Button>
              <div className="h-6 w-px bg-border" />
            </>
          )}

          <ThemeToggle />

          <div className="h-6 w-px bg-border" />

          {user && (
            <DropdownMenu>
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
      </div>
    </header>
  )
}

