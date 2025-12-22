import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark" | "system"

interface ThemeState {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

const applyTheme = (theme: "light" | "dark") => {
  if (typeof window === "undefined") return
  
  const root = window.document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(theme)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => {
      // Inicializar tema resolvido
      const initialTheme = typeof window !== "undefined" ? getSystemTheme() : "light"
      
      return {
        theme: "system" as Theme,
        resolvedTheme: initialTheme,
        setTheme: (theme: Theme) => {
          let resolvedTheme: "light" | "dark"
          
          if (theme === "system") {
            resolvedTheme = getSystemTheme()
            // Listener para mudanças no sistema
            if (typeof window !== "undefined") {
              const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
              const handleChange = (e: MediaQueryListEvent) => {
                const newTheme = e.matches ? "dark" : "light"
                set({ resolvedTheme: newTheme })
                applyTheme(newTheme)
              }
              mediaQuery.addEventListener("change", handleChange)
            }
          } else {
            resolvedTheme = theme
          }
          
          set({ theme, resolvedTheme })
          if (typeof window !== "undefined") {
            applyTheme(resolvedTheme)
          }
        },
        toggleTheme: () => {
          const current = get().resolvedTheme
          const newTheme = current === "light" ? "dark" : "light"
          set({ theme: newTheme, resolvedTheme: newTheme })
          if (typeof window !== "undefined") {
            applyTheme(newTheme)
          }
        },
      }
    },
    {
      name: "theme-storage",
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          // Aplicar tema ao reidratar
          let resolved: "light" | "dark"
          if (state.theme === "system") {
            resolved = getSystemTheme()
            state.resolvedTheme = resolved
          } else {
            resolved = state.theme
            state.resolvedTheme = resolved
          }
          applyTheme(resolved)
        }
      },
    }
  )
)

