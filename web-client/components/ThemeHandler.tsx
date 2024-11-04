"use client"
import { useEffect } from "react"
import useStore from "web-client/app/store"

const ThemeHandler = () => {
  const { theme, changeTheme } = useStore()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const htmlTheme = document.querySelector("html")?.getAttribute("data-theme")
      if (!htmlTheme) {
        changeTheme(theme)
      }
    }
  }, [changeTheme, theme])

  return null
}

export default ThemeHandler
