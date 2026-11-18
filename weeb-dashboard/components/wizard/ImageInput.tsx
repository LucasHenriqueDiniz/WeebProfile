"use client"

import { useRef, useState } from "react"
import { ImageOff, Upload, X } from "lucide-react"
import { validImageDataUri } from "@weeb/weeb-plugins"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from "@/i18n/use-translations"
import { PICTURE_MAX_BYTES, PICTURE_MAX_SIDE, PICTURE_TYPES, dataUriBytes } from "@/lib/utils/picture"
import { prepareImage } from "@/lib/utils/prepare-picture"

interface ImageInputProps {
  id: string
  /** A data URI from an upload, an https:// URL, or "". */
  value: string
  onChange: (value: string) => void
  /** Longest side an upload is shrunk to (the picture of the About intro: 384). */
  maxSide?: number
  /** Most an upload may weigh, decoded. */
  maxBytes?: number
}

/**
 * An image option: upload a file, which is kept in the card, or paste an address.
 * The upload never leaves the browser until the card is saved with it.
 */
export function ImageInput({
  id,
  value,
  onChange,
  maxSide = PICTURE_MAX_SIDE,
  maxBytes = PICTURE_MAX_BYTES,
}: ImageInputProps) {
  const t = useTranslations("wizard.imageInput")
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const uploaded = value.startsWith("data:")
  const preview = uploaded ? validImageDataUri(value, maxBytes) : /^https:\/\//i.test(value) ? value : null

  const pick = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const dataUri = await prepareImage(file, { maxSide, maxBytes })
      // The generator takes only what validImageDataUri takes: check before saving.
      if (!validImageDataUri(dataUri, maxBytes)) throw new Error("errorTooBig")
      onChange(dataUri)
    } catch (e) {
      const key = e instanceof Error && e.message.startsWith("error") ? e.message : "errorRead"
      setError(t(key, { size: Math.round(maxBytes / 1000) }))
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-muted/40">
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageOff className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => fileRef.current?.click()}>
            <Upload className="mr-1.5 h-3.5 w-3.5" />
            {uploaded ? t("replace") : t("upload")}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
              <X className="mr-1.5 h-3.5 w-3.5" />
              {t("remove")}
            </Button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept={PICTURE_TYPES.join(",")}
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </div>
      {uploaded ? (
        <p className="text-xs text-muted-foreground">
          {t("uploaded", { size: Math.max(1, Math.round(dataUriBytes(value) / 1000)) })}
        </p>
      ) : (
        <Input
          id={id}
          type="url"
          value={value}
          placeholder={t("urlPlaceholder")}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
