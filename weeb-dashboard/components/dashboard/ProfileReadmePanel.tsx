import { useEffect, useState } from "react"
import { UserRound, ExternalLink, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PanelCard } from "@/components/dashboard/PanelCard"
import { useTranslations } from "@/i18n/use-translations"
import {
  createProfileRepoUrl,
  isGithubLogin,
  profileRepoUrl,
  resolveProfileReadme,
  type ProfileReadmeTarget,
} from "@/lib/utils/github-profile"
import { readGithubLogin, writeGithubLogin } from "@/lib/utils/embed-prefs"

/** Waits for typing to pause before asking GitHub, whose unauthenticated API allows 60 calls an hour. */
const RESOLVE_DELAY_MS = 500

/**
 * From the copied snippet to the README it goes in: what the <login>/<login> repository
 * is, and a link straight into its editor, or to create it.
 */
export function ProfileReadmePanel({ userId, guessedLogin }: { userId: string; guessedLogin: string | null }) {
  const t = useTranslations("embed.readme")
  // What the user typed overrides the guess (it is how they correct a wrong one), and is
  // remembered per account.
  const [typed, setTyped] = useState<string | null>(() => readGithubLogin(userId))
  const login = (typed ?? guessedLogin ?? "").trim()
  const valid = isGithubLogin(login)
  const [target, setTarget] = useState<{ login: string; target: ProfileReadmeTarget } | null>(null)

  useEffect(() => {
    if (!valid) return
    let cancelled = false
    const timer = setTimeout(async () => {
      const resolved = await resolveProfileReadme(login)
      if (!cancelled) setTarget({ login, target: resolved })
    }, RESOLVE_DELAY_MS)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [login, valid])

  // A result for a login the user has since changed is not shown.
  const current = valid && target?.login === login ? target.target : null
  const checking = valid && !current
  const openUrl = current && current.kind !== "no-repo" ? current.url : valid ? profileRepoUrl(login) : null
  const showCreate = valid && (!current || current.kind === "no-repo" || current.kind === "unknown")

  return (
    <PanelCard icon={UserRound} title={t("title")}>
      <p className="mb-3 text-xs text-muted-foreground">
        {t("explainer", { repo: valid ? `${login}/${login}` : t("repoPlaceholder") })}
      </p>

      <Label htmlFor="github-login" className="mb-1.5 block text-xs text-muted-foreground">
        {t("usernameLabel")}
      </Label>
      <Input
        id="github-login"
        value={login}
        onChange={(e) => {
          setTyped(e.target.value)
          writeGithubLogin(userId, e.target.value)
        }}
        placeholder={t("usernamePlaceholder")}
        autoComplete="off"
        spellCheck={false}
        aria-invalid={login !== "" && !valid}
        className="mb-3 h-8 font-mono text-xs"
      />

      <div className="flex flex-col gap-2">
        {current?.kind !== "no-repo" && (
          <Button asChild={!!openUrl} size="sm" className="h-8 gap-1.5 text-xs" disabled={!openUrl}>
            {openUrl ? (
              <a href={openUrl} target="_blank" rel="noopener noreferrer">
                {checking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
                {current?.kind === "add-readme" ? t("addReadme") : t("open")}
              </a>
            ) : (
              <span>{t("open")}</span>
            )}
          </Button>
        )}
        {showCreate && (
          <Button
            asChild
            variant={current?.kind === "no-repo" ? "default" : "ghost"}
            size="sm"
            className="h-8 gap-1.5 text-xs"
          >
            <a href={createProfileRepoUrl(login)} target="_blank" rel="noopener noreferrer">
              <Plus className="h-3.5 w-3.5" />
              {t("create")}
            </a>
          </Button>
        )}
        {current?.kind === "no-repo" && <p className="text-xs text-muted-foreground">{t("createHint")}</p>}
      </div>
    </PanelCard>
  )
}
