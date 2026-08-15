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

/**
 * Recarrega quando um chunk do deploy antigo some.
 *
 * As rotas são carregadas sob demanda e os arquivos levam hash no nome. Quem estava
 * com a aba aberta durante um deploy fica com um index.html que aponta para chunks
 * que não existem mais; ao navegar, o Pages responde o próprio index.html no lugar
 * do .js, o MIME não bate e a rota morre com "Failed to fetch dynamically imported
 * module". Foi o que derrubou o /dashboard em 15/08/2026, depois de uma sequência
 * de deploys.
 *
 * Recarregar resolve porque traz o index.html novo, com os hashes atuais.
 */
const RECARGA_POR_CHUNK = "weeb:ultima-recarga-chunk"
const INTERVALO_MINIMO_MS = 10_000

window.addEventListener("vite:preloadError", (event) => {
  // Janela de tempo em vez de "uma vez por sessão": se a recarga não resolveu, o
  // problema é outro e insistir viraria um laço que esconde o erro de verdade. Mas
  // uma falha nova, minutos depois, ainda merece a sua recarga.
  const ultima = Number(sessionStorage.getItem(RECARGA_POR_CHUNK) || 0)
  if (Date.now() - ultima < INTERVALO_MINIMO_MS) return

  event.preventDefault()
  sessionStorage.setItem(RECARGA_POR_CHUNK, String(Date.now()))
  window.location.reload()
})

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
