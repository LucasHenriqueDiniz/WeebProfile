import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { useAuth } from "@/hooks/useAuth"
import { useRouter, usePathname } from "@/i18n/navigation"
import { useMemo, useState } from "react"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { useTranslations, useLocale } from "@/i18n/use-translations"
import { useThemeStore } from "@/stores/theme-store"
import { allLocales, localeNames, localeComingSoon, type Locale } from "@/i18n/config"
import { User, Palette, ShieldAlert, Sun, Moon, Monitor, Check, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

type Section = "profile" | "appearance" | "account"

const SECTIONS: { id: Section; icon: typeof User }[] = [
  { id: "profile", icon: User },
  { id: "appearance", icon: Palette },
  { id: "account", icon: ShieldAlert },
]

const THEME_OPTIONS: { id: "light" | "dark" | "system"; icon: typeof Sun }[] = [
  { id: "light", icon: Sun },
  { id: "dark", icon: Moon },
  { id: "system", icon: Monitor },
]

function ThemePreviewSwatch({ id }: { id: "light" | "dark" | "system" }) {
  if (id === "system") {
    return (
      <div className="w-full h-14 rounded-md overflow-hidden flex border border-border/50">
        <div className="w-1/2 h-full bg-[#f8fafc] flex items-center justify-center">
          <div className="w-6 h-1.5 rounded-full bg-slate-300" />
        </div>
        <div className="w-1/2 h-full bg-[#0a0f1e] flex items-center justify-center">
          <div className="w-6 h-1.5 rounded-full bg-slate-600" />
        </div>
      </div>
    )
  }
  if (id === "light") {
    return (
      <div className="w-full h-14 rounded-md bg-[#f8fafc] border border-border/50 flex flex-col justify-center gap-1.5 px-3">
        <div className="w-2/3 h-1.5 rounded-full bg-slate-300" />
        <div className="w-1/3 h-1.5 rounded-full bg-slate-200" />
      </div>
    )
  }
  return (
    <div className="w-full h-14 rounded-md bg-[#0a0f1e] border border-border/50 flex flex-col justify-center gap-1.5 px-3">
      <div className="w-2/3 h-1.5 rounded-full bg-gradient-to-r from-violet-500/60 to-cyan-500/60" />
      <div className="w-1/3 h-1.5 rounded-full bg-slate-700" />
    </div>
  )
}

export default function SettingsPage() {
  const t = useTranslations("settings")
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale() as Locale
  const { theme, setTheme } = useThemeStore()
  const [activeSection, setActiveSection] = useState<Section>("profile")

  const sectionLabels = useMemo(
    () => ({
      profile: t("profile.title"),
      appearance: t("appearance.title"),
      account: t("account.title"),
    }),
    [t]
  )

  if (authLoading) return <LoadingScreen />
  if (!user) {
    router.push("/login")
    return null
  }

  const handleLocaleChange = (newLocale: string) => {
    if (localeComingSoon[newLocale] || newLocale === locale) return
    const targetPath = pathname || "/"
    const newPath = targetPath === "/" ? `/${newLocale}` : `/${newLocale}${targetPath}`
    window.location.href = newPath
  }

  return (
    <DashboardLayout title={t("title")} description={t("description")}>
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-6 md:py-10">
        {/* Flex, nao grid-cols arbitrario: a versao anterior usava
            "lg:grid-cols-[200px_1fr]", que nunca chegou a gerar regra CSS neste ambiente
            (classes com valor em colchetes que nao aparecem em nenhum outro arquivo as
            vezes nao sao geradas) - o grid caia para uma unica coluna e o conteudo ficava
            visualmente estreito por causa do max-w-xs mais abaixo, nao por falta de espaco
            real. Layout flex com larguras da escala padrao do Tailwind e mais confiavel. */}
        <div className="lg:flex lg:gap-10 items-start">
          {/* Navegacao interna - separa Perfil/Aparencia/Conta em vez de rolagem unica */}
          <nav className="lg:w-56 lg:flex-shrink-0 lg:sticky lg:top-24 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible -mx-1 px-1 lg:mx-0 lg:px-0 mb-6 lg:mb-0">
            {SECTIONS.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              return (
                <button
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
                  <div className="space-y-1.5">
                    <Label htmlFor="username" className="text-sm">
                      {t("profile.username")}
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder={user.user_metadata?.user_name || t("profile.username")}
                      defaultValue={user.user_metadata?.user_name || ""}
                    />
                  </div>
                  <Button size="sm">{t("profile.saveChanges")}</Button>
                </div>
              </motion.section>
            )}

            {activeSection === "appearance" && (
              <motion.section
                key="appearance"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <p className="text-sm text-muted-foreground -mt-2">{t("appearance.description")}</p>

                <div>
                  <p className="text-sm font-medium text-foreground mb-1">{t("appearance.theme")}</p>
                  <p className="text-xs text-muted-foreground mb-3">{t("appearance.themeDescription")}</p>
                  <div className="grid grid-cols-3 gap-3 max-w-md">
                    {THEME_OPTIONS.map((option) => {
                      const Icon = option.icon
                      const isActive = theme === option.id
                      return (
                        <button
                          key={option.id}
                          onClick={() => setTheme(option.id)}
                          className={cn(
                            "rounded-lg border p-2 text-left transition-colors",
                            isActive ? "border-cyan-400/60 ring-1 ring-cyan-400/30" : "border-border/50 hover:border-border"
                          )}
                        >
                          <ThemePreviewSwatch id={option.id} />
                          <div className="flex items-center justify-between mt-2 px-0.5">
                            <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                              <Icon className="w-3 h-3" />
                              {t(`appearance.themeOptions.${option.id}`)}
                            </span>
                            {isActive && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-1">{t("appearance.language")}</p>
                  <p className="text-xs text-muted-foreground mb-3">{t("appearance.languageDescription")}</p>
                  <div className="flex flex-wrap gap-2 max-w-md">
                    {allLocales.map((loc) => {
                      const isActive = loc === locale
                      const isComingSoon = localeComingSoon[loc]
                      return (
                        <button
                          key={loc}
                          onClick={() => handleLocaleChange(loc)}
                          disabled={isComingSoon}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors",
                            isActive
                              ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-300"
                              : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border",
                            isComingSoon && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {localeNames[loc]}
                          {isComingSoon && <Clock className="w-3 h-3" />}
                          {isActive && !isComingSoon && <Check className="w-3 h-3" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </motion.section>
            )}

            {activeSection === "account" && (
              <motion.section
                key="account"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-sm text-muted-foreground mb-6">{t("account.description")}</p>
                <div className="max-w-md rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                  <p className="text-sm font-medium text-destructive">{t("account.dangerZone")}</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">{t("account.dangerZoneDescription")}</p>
                  <Button variant="destructive" size="sm">
                    {t("account.deleteAccount")}
                  </Button>
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
