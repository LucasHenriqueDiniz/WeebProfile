"use client"

import { DashboardLayout as DashboardLayoutComponent } from "@/components/dashboard/DashboardLayout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayoutComponent>{children}</DashboardLayoutComponent>
}

