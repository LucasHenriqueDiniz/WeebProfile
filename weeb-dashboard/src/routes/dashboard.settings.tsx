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
import { SEGMENTED, STICKER, segment } from "@/components/landing/sticker"
import { UserAvatar, useDisplayName } from "@/components/dashboard/UserMenu"

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
  const displayName = useDisplayName()

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
      <div className="pb-6">
        {/* Profile and account as two tabs instead of one long scroll. Appearance left:
            it repeated the language and theme menu the rail already has. */}
        <div role="tablist" aria-label={t("title")} className={cn(SEGMENTED, "mb-6")}>
          {SECTIONS.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            return (
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={segment(isActive)}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {sectionLabels[section.id]}
              </button>
            )
          })}
        </div>

        <div className="max-w-2xl">
          {activeSection === "profile" && (
            <motion.section
              key="profile"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(STICKER, "p-6")}
            >
              <p className="text-sm text-muted-foreground mb-6">{t("profile.description")}</p>

              <div className="mb-6 flex max-w-lg items-center gap-4 border-b-2 border-foreground/10 pb-6">
                <UserAvatar className="h-16 w-16" textClassName="text-xl" />
                <div className="min-w-0">
                  <div className="truncate font-heading text-lg font-bold text-foreground">{displayName}</div>
                  <div className="truncate text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>

              <div className="space-y-4 max-w-lg">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm">
                    {t("profile.email")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="border-2 border-foreground/30 bg-muted"
                  />
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
              className={cn(STICKER, "p-6")}
            >
              <p className="text-sm text-muted-foreground mb-6">{t("account.description")}</p>
              <PlanUsagePanel />
              <ApiKeysPanel />
              <div className="max-w-md rounded-xl border-2 border-red-600 bg-red-50 p-4 dark:border-red-400 dark:bg-red-950/30">
                <p className="text-sm font-bold text-red-700 dark:text-red-400">{t("account.dangerZone")}</p>
                <p className="text-xs text-muted-foreground mt-1 mb-3">{t("account.dangerZoneDescription")}</p>
                <DeleteAccountDialog />
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
