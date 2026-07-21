"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/Header"
import { DashboardSidebar } from "@/components/dashboard/Sidebar"
import { MobileNav } from "@/components/dashboard/MobileNav"

interface DashboardLayoutProps {
  children: ReactNode
  /** Contextual header content - each route supplies its own instead of a generic bar. */
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
}

export function DashboardLayout({ children, title, description, actions }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-svh bg-sidebar">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header variant="dashboard" title={title} description={description} actions={actions} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 bg-background pb-20 md:pb-0"
        >
          <div className="min-h-full">{children}</div>
        </motion.div>
      </div>

      <MobileNav />
    </div>
  )
}
