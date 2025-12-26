"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/dashboard/Sidebar"

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

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Não mostrar sidebar no wizard
  if (pathname === "/dashboard/new" || pathname?.match(/^\/dashboard\/[^/]+\/edit$/)) {
    return <>{children}</>
  }

  const currentPageTitle = navItems.find((item) => item.href === pathname)?.label || "Dashboard"

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          variant="dashboard"
          title={currentPageTitle}
          showSidebarToggle={true}
          onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-auto"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
















