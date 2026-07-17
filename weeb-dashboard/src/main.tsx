import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { ClerkProvider } from "@clerk/react"
import { ptBR } from "@clerk/localizations"
import { I18nextProvider } from "react-i18next"
import { TooltipProvider } from "@/components/ui/tooltip"
import i18n from "@/i18n/setup"
import { router } from "./router"
import "@/src/globals.css"

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn("Missing VITE_CLERK_PUBLISHABLE_KEY — auth will not work")
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY ?? ""} afterSignOutUrl="/" localization={ptBR}>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </ClerkProvider>
    </I18nextProvider>
  </React.StrictMode>
)
