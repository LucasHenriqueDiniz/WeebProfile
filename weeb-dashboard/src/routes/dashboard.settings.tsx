import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "@/i18n/navigation"
import { useEffect, useState } from "react"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { useTranslations } from "@/i18n/use-translations"
import { LanguageSelector } from "@/components/layout/LanguageSelector"

export default function SettingsPage() {
  const t = useTranslations("settings")
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-6 md:px-8 py-8 md:py-12">
        <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">{t("description")}</p>
        </motion.header>

        <div className="mt-10 divide-y divide-border/60">
          {/* Profile */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.25 }}
            className="pb-8"
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("profile.title")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 mb-5">{t("profile.description")}</p>
            <div className="space-y-4 max-w-sm">
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

          {/* Appearance */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.25 }}
            className="py-8"
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("appearance.title")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 mb-5">{t("appearance.description")}</p>
            <div className="space-y-4 max-w-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{t("appearance.theme")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("appearance.themeDescription")}</p>
                </div>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{t("appearance.language")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("appearance.languageDescription")}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setLanguageSelectorOpen(true)}>
                  {t("appearance.language")}
                </Button>
              </div>
            </div>
          </motion.section>

          {/* Account - danger zone kept visually contained, unlike the other flowing sections,
              because destructive actions benefit from a deliberate visual boundary. */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.25 }}
            className="pt-8"
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("account.title")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 mb-5">{t("account.description")}</p>
            <div className="max-w-sm rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-medium text-destructive">{t("account.dangerZone")}</p>
              <p className="text-xs text-muted-foreground mt-1 mb-3">{t("account.dangerZoneDescription")}</p>
              <Button variant="destructive" size="sm">
                {t("account.deleteAccount")}
              </Button>
            </div>
          </motion.section>
        </div>
      </div>
      <LanguageSelector open={languageSelectorOpen} onOpenChange={setLanguageSelectorOpen} />
    </DashboardLayout>
  )
}
