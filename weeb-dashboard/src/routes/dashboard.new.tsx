import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "@/i18n/navigation"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { useTranslations } from "@/i18n/use-translations"
import { ArrowRight, BookMarked, UserCircle2 } from "lucide-react"
import { useEffect } from "react"
import { SECTION_PREVIEWS } from "@/lib/config/section-previews"

/**
 * Real section previews, whole, for each kind of card. The profile option showed a
 * 415x2288 template SVG cropped to its top 9% in a 176px frame, cut mid-line; two
 * sections of different plugins say "several plugins" and fit.
 */
const PREVIEWS = {
  profile: [
    { plugin: "github", section: "profile" },
    { plugin: "myanimelist", section: "anime_bar" },
  ],
  repository: [{ plugin: "github_repo", section: "banner" }],
} as const

export default function NewArtifactChooserPage() {
  const t = useTranslations("dashboard.newPage")
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [authLoading, user, router])

  if (authLoading) return <LoadingScreen />
  if (!user) return null

  const options = [
    {
      key: "profile",
      title: t("profileTitle"),
      description: t("profileDesc"),
      icon: UserCircle2,
      iconClass: "from-cyan-500/20 to-cyan-500/5 text-cyan-400",
      previews: PREVIEWS.profile,
      href: "/dashboard/new/profile",
    },
    {
      key: "repository",
      title: t("repoTitle"),
      description: t("repoDesc"),
      icon: BookMarked,
      iconClass: "from-violet-500/20 to-violet-500/5 text-violet-400",
      previews: PREVIEWS.repository,
      href: "/dashboard/new/repository",
    },
  ] as const

  return (
    <DashboardLayout title={t("title")} description={t("subtitle")} width="narrow">
      {/* Sem centralizar: os cards começam na mesma calha do título do header. Antes
          ficavam no meio do container, soltos em relação ao título e à sidebar. E sem
          max-w-3xl: os dois cards ocupam a largura do layout em vez de 768 dos 894 px. */}
      <div className="py-6">
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
          {options.map((option) => {
            const Icon = option.icon
            return (
              <button
                type="button"
                key={option.key}
                onClick={() => router.push(option.href)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_8px_40px_-12px_rgba(139,92,246,0.35)]"
              >
                {/* Fixed height so both cards line up; the profile stack (301 px at 415 wide)
                    and the banner (184 px) fit whole inside it. */}
                <div className="flex h-96 w-full items-center justify-center overflow-hidden border-b border-border bg-muted/40 p-4">
                  <div className="w-full max-w-[415px] space-y-1 transition-transform duration-300 group-hover:scale-[1.02]">
                    {option.previews.map(({ plugin, section }) => {
                      const size = SECTION_PREVIEWS[plugin]?.[section]?.default
                      return (
                        <img
                          key={`${plugin}/${section}`}
                          src={`/previews/${plugin}/default/${section}.svg`}
                          alt=""
                          width={size?.[0]}
                          height={size?.[1]}
                          className="block h-auto w-full"
                        />
                      )
                    })}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${option.iconClass}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <p className="font-heading text-base font-bold text-foreground">{option.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{option.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    {t("cta")}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
