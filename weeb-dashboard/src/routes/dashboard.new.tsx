import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "@/i18n/navigation"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { useTranslations } from "@/i18n/use-translations"
import { ArrowRight, BookMarked, UserCircle2 } from "lucide-react"
import { useEffect } from "react"

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
      preview: "/template-previews/e66831e1-abab-4877-ba6a-92cbd0bd17d6.svg",
      previewClass: "object-cover object-top",
      href: "/dashboard/new/profile",
    },
    {
      key: "repository",
      title: t("repoTitle"),
      description: t("repoDesc"),
      icon: BookMarked,
      iconClass: "from-violet-500/20 to-violet-500/5 text-violet-400",
      preview: "/previews/github_repo/default/banner.svg",
      previewClass: "object-contain p-4",
      href: "/dashboard/new/repository",
    },
  ] as const

  return (
    <DashboardLayout title={t("title")} description={t("subtitle")} width="narrow">
      {/* Sem centralizar: os cards começam na mesma calha do título do header. Antes
          ficavam no meio do container, soltos em relação ao título e à sidebar. */}
      <div className="py-6">
        <div className="grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
          {options.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.key}
                onClick={() => router.push(option.href)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_8px_40px_-12px_rgba(139,92,246,0.35)]"
              >
                <div className="relative h-44 w-full overflow-hidden border-b border-border bg-muted/40">
                  <img
                    src={option.preview}
                    alt=""
                    className={`h-full w-full transition-transform duration-300 group-hover:scale-[1.03] ${option.previewClass}`}
                  />
                  {/* O card de perfil é mais alto que a moldura e é cortado no meio de
                      uma linha de texto ("231 PRs Created"), o que parece falha de
                      renderização. O esmaecimento faz o corte virar "tem mais abaixo".
                      Só onde há corte: o de repositório usa object-contain e cabe inteiro. */}
                  {option.previewClass.includes("object-cover") && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent"
                    />
                  )}
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
