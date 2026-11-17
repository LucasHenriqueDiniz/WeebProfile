import { ApiKeysPanel } from "@/components/dashboard/ApiKeysPanel"
import { PlanUsagePanel } from "@/components/dashboard/PlanUsagePanel"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { DeleteAccountDialog } from "@/components/dashboard/DeleteAccountDialog"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "@/i18n/navigation"
import { useMemo, useState } from "react"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { useTranslations } from "@/i18n/use-translations"
import { User, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

type Section = "profile" | "account"

const SECTIONS: { id: Section; icon: typeof User }[] = [
  { id: "profile", icon: User },
  { id: "account", icon: ShieldAlert },
]

export default function SettingsPage() {
  const t = useTranslations("settings")
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<Section>("profile")

  const sectionLabels = useMemo(
    () => ({
      profile: t("profile.title"),
      account: t("account.title"),
    }),
    [t]
  )

  if (authLoading) return <LoadingScreen />
  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <DashboardLayout title={t("title")} description={t("description")} width="narrow">
      <div className="py-2 md:py-4">
        {/* Flex, nao grid-cols arbitrario: a versao anterior usava
            "lg:grid-cols-[200px_1fr]", que nunca chegou a gerar regra CSS neste ambiente
            (classes com valor em colchetes que nao aparecem em nenhum outro arquivo as
            vezes nao sao geradas) - o grid caia para uma unica coluna e o conteudo ficava
            visualmente estreito por causa do max-w-xs mais abaixo, nao por falta de espaco
            real. Layout flex com larguras da escala padrao do Tailwind e mais confiavel. */}
        <div className="lg:flex lg:gap-10 items-start">
          {/* Navegacao interna - separa Perfil/Conta em vez de rolagem unica. Aparencia saiu:
              repetia o menu de tema e o seletor de idioma do topo, que agora tem Sistema. */}
          <nav className="lg:w-56 lg:flex-shrink-0 lg:sticky lg:top-24 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible -mx-1 px-1 lg:mx-0 lg:px-0 mb-6 lg:mb-0">
            {SECTIONS.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              return (
                <button
                  type="button"
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0",
                    isActive
                      ? "bg-cyan-500/10 text-cyan-300"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {sectionLabels[section.id]}
                </button>
              )
            })}
          </nav>

          <div className="flex-1 min-w-0 max-w-2xl">
            {activeSection === "profile" && (
              <motion.section
                key="profile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <p className="text-sm text-muted-foreground mb-6">{t("profile.description")}</p>

                {/* Linha de identidade - avatar + contexto, separada do formulario por um divisor */}
                <div className="flex items-center gap-4 pb-6 mb-6 border-b border-border/50 max-w-lg">
                  <div className="w-16 h-16 rounded-full ring-2 ring-primary/20 overflow-hidden bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                      <img
                        src={user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-xl font-bold">
                        {user.user_metadata?.user_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-foreground truncate">
                      {user.user_metadata?.user_name || user.email?.split("@")[0]}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                  </div>
                </div>

                <div className="space-y-4 max-w-lg">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm">
                      {t("profile.email")}
                    </Label>
                    <Input id="email" type="email" value={user.email || ""} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">{t("profile.emailCannotChange")}</p>
                  </div>
                  {/* No username field. There was one, with a Save button that had no
                      handler: it changed nothing, and the value it would have stored
                      (profiles.username) is read by nothing that draws a card. It also
                      opened empty, since user_metadata.user_name is a Supabase-era field. */}
                </div>
              </motion.section>
            )}

            {activeSection === "account" && (
              <motion.section
                key="account"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <p className="text-sm text-muted-foreground mb-6">{t("account.description")}</p>
                <PlanUsagePanel />
                <ApiKeysPanel />
                <div className="max-w-md rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                  <p className="text-sm font-medium text-destructive">{t("account.dangerZone")}</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">{t("account.dangerZoneDescription")}</p>
                  <DeleteAccountDialog />
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
