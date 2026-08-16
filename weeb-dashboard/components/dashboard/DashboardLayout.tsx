"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/Header"
import { DashboardSidebar } from "@/components/dashboard/Sidebar"
import { MobileNav } from "@/components/dashboard/MobileNav"
import { contentContainer, type ContentWidth } from "@/components/layout/page-width"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: ReactNode
  /** Contextual header content - each route supplies its own instead of a generic bar. */
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  /**
   * Largura do conteúdo. Aplicada ao header E ao children de uma vez só, para que
   * a rota não tenha como escolher uma largura diferente da do seu próprio header
   * (era exatamente isso que estava acontecendo em todas as quatro rotas).
   */
  width?: ContentWidth
  /** Controle antes do título, ex: voltar. Fica fora do <h1>. */
  leading?: ReactNode
  /**
   * Conteúdo que gerencia o próprio scroll/altura (onboarding, canvas). Recebe a
   * área inteira sem container nem padding.
   */
  bleed?: boolean
}

export function DashboardLayout({
  children,
  title,
  description,
  actions,
  width = "app",
  leading,
  bleed = false,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-svh overflow-hidden bg-sidebar">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <Header
          variant="dashboard"
          title={title}
          description={description}
          actions={actions}
          width={width}
          leading={leading}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 min-h-0 overflow-y-auto bg-background pb-20 md:pb-0"
        >
          {bleed ? children : <div className={cn(contentContainer(width), "py-4 md:py-6")}>{children}</div>}
        </motion.div>
      </div>

      <MobileNav />
    </div>
  )
}
