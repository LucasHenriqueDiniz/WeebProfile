"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navItems = [
  {
    label: "My SVGs",
    href: "/dashboard",
  },
  {
    label: "Create New",
    href: "/dashboard/new",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
  },
]

const SIDEBAR_STORAGE_KEY = "weeb-dashboard-sidebar-open"

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Inicializar do localStorage se disponível, ou true por padrão
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
      return stored ? JSON.parse(stored) : true
    }
    return true
  })

  // Persistir estado da sidebar no localStorage
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(isSidebarOpen))
  }, [isSidebarOpen])

  // Fechar sidebar no mobile quando mudar de rota
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }, [pathname, isMobile])

  // Não mostrar sidebar no wizard
  if (pathname === "/dashboard/new" || pathname?.match(/^\/dashboard\/[^/]+\/edit$/)) {
    return <>{children}</>
  }

  const currentPageTitle = navItems.find((item) => item.href === pathname)?.label || "Dashboard"

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev: boolean) => !prev)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <Header
          variant="dashboard"
          title={currentPageTitle}
          showSidebarToggle={true}
          onSidebarToggle={handleSidebarToggle}
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-auto"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
















