import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"
import { WIZARD_UI_STATE_KEY } from "@/hooks/useWizardUIState"
import { useTranslations } from "@/i18n/use-translations"
import { accountApi } from "@/lib/api/client"
import { useSvgStore } from "@/stores/svg-store"
import { useWizardStore } from "@/stores/wizard-store"

const ITEMS = ["svgs", "secrets", "templates", "login"] as const

/**
 * Drafts and generated SVGs this browser kept for the account. The theme stays:
 * it is a preference of the browser, not data of the account.
 */
function forgetAccountInThisBrowser() {
  useWizardStore.persist.clearStorage()
  useSvgStore.persist.clearStorage()
  try {
    localStorage.removeItem(WIZARD_UI_STATE_KEY)
  } catch {
    // Storage blocked: there is nothing stored to forget.
  }
}

export function DeleteAccountDialog() {
  const t = useTranslations("settings.account")
  const { signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [failed, setFailed] = useState(false)

  const confirmWord = t("deleteDialog.confirmWord")
  const confirmed = typed.trim() === confirmWord

  const handleOpenChange = (next: boolean) => {
    if (deleting) return
    setOpen(next)
    if (!next) {
      setTyped("")
      setFailed(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setFailed(false)
    try {
      await accountApi.delete()
    } catch {
      setFailed(true)
      setDeleting(false)
      return
    }
    forgetAccountInThisBrowser()
    // The Clerk user is gone, and its sessions with it, so signing out can fail.
    // The landing page is where this ends either way.
    await signOut().catch(() => undefined)
    window.location.assign("/")
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          {t("deleteAccount")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("deleteDialog.title")}</DialogTitle>
          <DialogDescription>{t("deleteDialog.description")}</DialogDescription>
        </DialogHeader>

        <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground">
          {ITEMS.map((item) => (
            <li key={item}>{t(`deleteDialog.items.${item}`)}</li>
          ))}
        </ul>
        <p className="text-sm font-medium text-destructive">{t("deleteDialog.irreversible")}</p>

        <form
          className="space-y-1.5"
          onSubmit={(event) => {
            event.preventDefault()
            if (confirmed && !deleting) void handleDelete()
          }}
        >
          <Label htmlFor="delete-account-confirm" className="text-sm">
            {t("deleteDialog.confirmLabel", { word: confirmWord })}
          </Label>
          <Input
            id="delete-account-confirm"
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            disabled={deleting}
          />
        </form>

        {failed && (
          <p role="alert" className="text-sm text-destructive">
            {t("deleteDialog.error")}
          </p>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={deleting}>
            {t("deleteDialog.cancel")}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={!confirmed || deleting}>
            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {deleting ? t("deleteDialog.deleting") : t("deleteDialog.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
