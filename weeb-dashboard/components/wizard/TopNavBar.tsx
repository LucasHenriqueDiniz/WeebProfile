"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronRight, Eye, EyeOff, Moon, Sun, LogOut, Settings as SettingsIcon, Home, Image as ImageIcon } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useWizardStore } from "@/stores/wizard-store"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface TopNavBarProps {
  showPreview: boolean
  onTogglePreview: () => void
}

export function TopNavBar({ showPreview, onTogglePreview }: TopNavBarProps) {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { currentStep } = useWizardStore()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const stepNames: Record<number, string> = {
    1: "Estilo",
    2: "Plugins",
    3: "Preview",
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <nav className="border-b px-6 py-3 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      {/* Left */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="font-bold text-lg">WeebProfile</span>
        </div>

        <div className="h-6 w-px bg-border"></div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors",
                  step === currentStep
                    ? "bg-primary/10 text-primary"
                    : step < currentStep
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "text-muted-foreground"
                )}
              >
                {step < currentStep ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span className="text-xs font-bold">{step}</span>
                )}
                <span className="text-xs font-medium hidden sm:inline">{stepNames[step]}</span>
              </div>
              {step < 3 && (
                <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onTogglePreview}
          className={cn(
            showPreview && "bg-primary/10 text-primary"
          )}
          title={showPreview ? "Ocultar Preview" : "Mostrar Preview"}
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>

        <ThemeToggle />

        <div className="h-6 w-px bg-border"></div>

        {user && (
          <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-auto px-3 py-1.5">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.user_metadata?.user_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
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
                <SettingsIcon className="w-4 h-4 mr-2" />
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

