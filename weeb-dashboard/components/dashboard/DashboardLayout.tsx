"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/dashboard/Sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Não mostrar sidebar no wizard (WizardShell já renderiza o header)
  if (pathname === "/dashboard/new" || pathname?.match(/^\/dashboard\/[^/]+\/edit$/)) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          variant="dashboard"
          showSidebarToggle={true}
          onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-auto bg-muted/20 border-t border-border/50"
        >
          <div className="min-h-full">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
















