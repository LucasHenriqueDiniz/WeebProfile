"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Home, Plus, Settings, LogOut, Image as ImageIcon, Check, Circle, FileImage, User } from "lucide-react"
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
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { svgApi } from "@/lib/api"
import { useWizardStore } from "@/stores/wizard-store"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Avatar component - simple implementation
const Avatar = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>
    {children}
  </div>
)
const AvatarImage = ({ src, alt, className }: { src?: string; alt?: string; className?: string }) => (
  src ? <img src={src} alt={alt} className={cn("aspect-square h-full w-full", className)} /> : null
)
const AvatarFallback = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}>
    {children}
  </div>
)

const wizardSteps = [
  { number: 1, title: "Básico", path: "/dashboard/new" },
  { number: 2, title: "Estilo", path: "/dashboard/new" },
  { number: 3, title: "Plugins", path: "/dashboard/new" },
  { number: 4, title: "Preview", path: "/dashboard/new" },
]

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { currentStep } = useWizardStore()
  const [svgs, setSvgs] = useState<any[]>([])
  const [loadingSvgs, setLoadingSvgs] = useState(true)
  const isWizardPage = pathname === "/dashboard/new"
  const isEditPage = pathname?.match(/^\/dashboard\/[^/]+\/edit$/)

  useEffect(() => {
    if (user && !isWizardPage && !isEditPage) {
      fetchSvgs()
    }
  }, [user, isWizardPage, isEditPage])

  const fetchSvgs = async () => {
    try {
      setLoadingSvgs(true)
      const data = await svgApi.list()
      setSvgs(data.svgs || [])
    } catch (error) {
      console.error("Error fetching SVGs:", error)
    } finally {
      setLoadingSvgs(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return "completed"
    if (stepNumber === currentStep) return "current"
    return "pending"
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-6 h-6" />
          <span className="font-bold text-lg">WeebProfile</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard" && !isWizardPage && !isEditPage}
                  onClick={() => router.push("/dashboard")}
                >
                  <a href="/dashboard">
                    <Home />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isWizardPage}
                  onClick={() => router.push("/dashboard/new")}
                >
                  <a href="/dashboard/new">
                    <Plus />
                    <span>Criar Nova Imagem</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Wizard Steps - Only show when creating new image */}
        {isWizardPage && (
          <SidebarGroup>
            <SidebarGroupLabel>Passos do Wizard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {wizardSteps.map((step) => {
                  const status = getStepStatus(step.number)
                  const isCompleted = status === "completed"
                  const isCurrent = status === "current"
                  const isPending = status === "pending"

                  return (
                    <SidebarMenuItem key={step.number}>
                      <SidebarMenuButton
                        className={cn(
                          "w-full justify-start gap-3",
                          isCurrent && "bg-primary/10 text-primary",
                          isCompleted && "text-muted-foreground",
                          isPending && "opacity-50"
                        )}
                        disabled={isPending}
                        onClick={() => {
                          // Allow navigation to completed steps
                          if (isCompleted || isCurrent) {
                            useWizardStore.getState().setStep(step.number)
                          }
                        }}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors flex-shrink-0",
                            isCompleted && "bg-green-500 border-green-500 text-white",
                            isCurrent && "bg-primary border-primary text-primary-foreground",
                            isPending && "bg-muted border-muted-foreground/30 text-muted-foreground"
                          )}
                        >
                          {isCompleted ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Circle className={cn("w-3 h-3", isCurrent && "fill-current")} />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-xs text-muted-foreground">Passo {step.number}</div>
                          <div className={cn("font-medium text-sm", isCurrent && "text-primary")}>
                            {step.title}
                          </div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Images List - Only show when not in wizard */}
        {!isWizardPage && !isEditPage && (
          <SidebarGroup>
            <SidebarGroupLabel>
              Imagens Criadas {svgs.length > 0 && `(${svgs.length})`}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {loadingSvgs ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">Carregando...</div>
              ) : svgs.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Nenhuma imagem criada
                </div>
              ) : (
                <SidebarMenu>
                  {svgs.map((svg) => {
                    const isActive = pathname === `/dashboard/${svg.id}`
                    return (
                      <SidebarMenuItem key={svg.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          onClick={() => router.push(`/dashboard/${svg.id}`)}
                        >
                          <a href={`/dashboard/${svg.id}`}>
                            <FileImage className="w-4 h-4" />
                            <span className="truncate">{svg.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        {/* User Area */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-auto p-2 hover:bg-accent"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.user_metadata?.avatar_url}
                    alt={user.user_metadata?.user_name || user.email || "User"}
                  />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium truncate">
                    {user.user_metadata?.user_name || user.email?.split("@")[0] || "Usuário"}
                  </div>
                  {user.user_metadata?.user_name && user.email && (
                    <div className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </div>
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
              <div className="px-2 py-1.5">
                <ThemeToggle />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}










































