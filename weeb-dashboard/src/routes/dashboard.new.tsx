import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "@/i18n/navigation"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { useTranslations } from "@/i18n/use-translations"
import { ArrowRight, BookMarked, UserCircle2 } from "lucide-react"
import { useEffect } from "react"
import { SECTION_PREVIEWS } from "@/lib/config/section-previews"
import { HALFTONE, STICKER, STICKER_LIFT, TILE, TONE } from "@/components/landing/sticker"
import { cn } from "@/lib/utils"

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
      tone: TONE.cyan,
      previews: PREVIEWS.profile,
      href: "/dashboard/new/profile",
    },
    {
      key: "repository",
      title: t("repoTitle"),
      description: t("repoDesc"),
      icon: BookMarked,
      tone: TONE.violet,
      previews: PREVIEWS.repository,
      href: "/dashboard/new/repository",
    },
  ] as const

  return (
    <DashboardLayout title={t("title")} description={t("subtitle")} width="narrow">
      {/* Not centred: the cards start on the heading's gutter, and fill the layout's width. */}
      <div className="pb-6">
        <div className="grid w-full grid-cols-1 gap-7 sm:grid-cols-2">
          {options.map((option) => {
            const Icon = option.icon
            return (
              <button
                type="button"
                key={option.key}
                onClick={() => router.push(option.href)}
                className={cn(STICKER, STICKER_LIFT, "group flex flex-col overflow-hidden text-left")}
              >
                {/* Fixed height from sm up so both cards line up; the profile stack (301 px
                    at 415 wide) and the banner (184 px) fit whole inside it. On a phone the
                    cards stack, so each takes only its own height. */}
                <div className="relative flex w-full items-center justify-center overflow-hidden border-b-2 border-foreground bg-muted/50 p-4 sm:h-96">
                  <div
                    aria-hidden
                    className={cn(
                      HALFTONE,
                      "right-0 top-0 h-24 w-40 [mask-image:linear-gradient(to_bottom_left,black,transparent)]"
                    )}
                  />
                  <div className="relative w-full max-w-[415px] space-y-1">
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
                  <span className={cn(TILE, "h-11 w-11", option.tone)}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <p className="font-heading text-xl font-extrabold text-foreground">{option.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{option.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground underline decoration-2 underline-offset-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
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
