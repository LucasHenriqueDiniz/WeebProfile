"use client"

import { usePathname } from "@/i18n/navigation"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/Header"
import { DashboardSidebar } from "@/components/dashboard/Sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()

  // Não mostrar sidebar no wizard (WizardShell já renderiza o header)
  // Pathname agora inclui locale (ex: /pt/dashboard/new)
  if (pathname?.includes("/dashboard/new") || pathname?.match(/\/dashboard\/[^/]+\/edit$/)) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <Header variant="dashboard" showSidebarToggle={true} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-auto bg-muted/20"
        >
          <div className="min-h-full">{children}</div>
        </motion.div>
      </SidebarInset>
    </SidebarProvider>
  )
}
