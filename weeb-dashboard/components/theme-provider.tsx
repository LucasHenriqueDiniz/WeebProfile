"use client"

import { useEffect } from "react"
import { useThemeStore } from "@/stores/theme-store"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme, setTheme } = useThemeStore()

  useEffect(() => {
    // Aplicar tema inicial ao montar
    if (typeof window !== "undefined") {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(resolvedTheme)
    }
  }, [resolvedTheme])

  useEffect(() => {
    // Aplicar tema quando mudar
    if (typeof window !== "undefined") {
      setTheme(theme)
    }
  }, [theme, setTheme])

  return <>{children}</>
}

