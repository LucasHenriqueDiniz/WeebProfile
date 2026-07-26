"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRepositoryWizardStore } from "@/stores/repository-wizard-store"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { getSectionPreview } from "@/lib/config/section-previews"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { SectionConfigDialog } from "./SectionConfigDialog"

// Rótulos de select vêm com uma explicação entre parênteses (bom no dropdown do
// drawer, longo demais pra um chip) - corta na primeira "(" pra caber.
function shortLabel(label: string): string {
  const parenIndex = label.indexOf(" (")
  return parenIndex === -1 ? label : label.slice(0, parenIndex)
}

interface ConfigOption {
  key: string
  label: string
  type: "number" | "boolean" | "string" | "select" | "array"
  defaultValue?: unknown
  options?: { value: string; label: string }[]
}

// Resumo compacto do que está configurado nesta seção - mostrado no lugar do preview
// estático quando o item está selecionado, já que o preview genérico não reflete a
// variante/opções escolhidas de verdade.
function ConfigSummary({
  configOptions,
  sectionConfig,
}: {
  configOptions: ConfigOption[]
  sectionConfig: Record<string, any>
}) {
  const chips = configOptions
    .map((option) => {
      const value = sectionConfig[option.key] ?? option.defaultValue
      if (value === undefined || value === null || value === "") return null

      let display: string
      if (option.type === "boolean") display = value ? "On" : "Off"
      else if (option.type === "select") display = shortLabel(option.options?.find((o) => o.value === value)?.label ?? String(value))
      else display = String(value)

      return { key: option.key, label: option.label, display }
    })
    .filter((c): c is { key: string; label: string; display: string } => c !== null)

  if (chips.length === 0) {
    return <p className="text-xs text-muted-foreground">Using default settings.</p>
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-[11px]"
        >
          <span className="text-muted-foreground">{chip.label}:</span>
          <span className="font-medium text-foreground">{chip.display}</span>
        </span>
      ))}
    </div>
  )
}

/**
 * Parses "owner/repo" or a full GitHub URL into { owner, repo }.
 * Mirrors normalizeGithubRepoTarget in weeb-plugins/src/plugins/github_repo/services/fetchGithubRepo.ts.
 */
function parseRepoInput(value: string): { owner: string; repo: string } | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  if (!trimmed.includes("://")) {
    const parts = trimmed.split("/").filter(Boolean)
    if (parts.length >= 2 && parts[0] && parts[1]) return { owner: parts[0], repo: parts[1] }
    return null
  }

  try {
    const url = new URL(trimmed)
    if (url.hostname === "github.com" || url.hostname === "www.github.com") {
      const pathParts = url.pathname.split("/").filter(Boolean)
      if (pathParts.length >= 2 && pathParts[0] && pathParts[1]) return { owner: pathParts[0], repo: pathParts[1] }
    }
  } catch {
    // invalid URL, fall through
  }
  return null
}

// Painel de config do Repository - diferente do Profile, aqui não é uma pilha de
// seções que se ligam junto: o repositório é sempre UM item só (Banner OU Stats OU
// Star Graph OU Technologies OU Topics OU Overview). A lista abaixo é uma escolha
// única (como um radio) em vez de checkboxes multi-seleção.
export function RepositoryConfigPanel() {
  const { owner, repo, style, sections, sectionConfigs, setOwnerRepo, selectSection, setSectionConfig } =
    useRepositoryWizardStore()
  const [rawInput, setRawInput] = useState(owner && repo ? `${owner}/${repo}` : "")
  const [error, setError] = useState<string | null>(null)

  const metadata = PLUGINS_METADATA.github_repo
  const activeSectionId = sections[0]

  const handleInputChange = (value: string) => {
    setRawInput(value)
    if (!value.trim()) {
      setOwnerRepo("", "")
      setError(null)
      return
    }
    const parsed = parseRepoInput(value)
    if (parsed) {
      setOwnerRepo(parsed.owner, parsed.repo)
      setError(null)
    } else {
      setOwnerRepo("", "")
      setError("Use the format owner/repo or a full github.com URL")
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="repo-input" className="text-sm font-semibold text-foreground">
          Repository
        </Label>
        <Input
          id="repo-input"
          value={rawInput}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="owner/repo or https://github.com/owner/repo"
          className="font-mono text-sm"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      <div className="space-y-2.5">
        <Label className="text-sm font-semibold text-foreground">Template</Label>
        <p className="text-xs text-muted-foreground">
          Choose one visual for the repository - not a stack of sections like the Profile card.
        </p>
        <div className="grid grid-cols-1 gap-3">
          {metadata.sections.map((section) => {
            const isSelected = activeSectionId === section.id
            const hasConfigs = section.configOptions && section.configOptions.length > 0
            const previewImage = getSectionPreview("github_repo", section.id, style)

            return (
              <div
                key={section.id}
                onClick={() => selectSection(section.id)}
                className={cn(
                  "flex flex-col gap-2.5 p-3 rounded-lg border cursor-pointer transition-all",
                  isSelected
                    ? "bg-primary/5 text-primary border-primary/30"
                    : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50 hover:border-primary/20"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={cn(
                        "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border",
                        isSelected ? "border-primary" : "border-muted-foreground/40"
                      )}
                      aria-hidden="true"
                    >
                      {isSelected && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </span>
                    <input
                      type="radio"
                      name="repository-template"
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => selectSection(section.id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select ${section.name}`}
                    />
                    <span className="text-sm font-medium truncate">{section.name}</span>
                  </div>
                  {hasConfigs && isSelected && (
                    <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                      <SectionConfigDialog
                        plugin="github_repo"
                        section={section}
                        sectionConfig={sectionConfigs[section.id] || {}}
                        onConfigChange={(config) => setSectionConfig(section.id, config)}
                      />
                    </div>
                  )}
                </div>
                {section.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{section.description}</p>
                )}
                {isSelected && hasConfigs ? (
                  <ConfigSummary configOptions={section.configOptions} sectionConfig={sectionConfigs[section.id] || {}} />
                ) : (
                  previewImage && (
                    <div
                      className="rounded-md overflow-hidden border border-border bg-background aspect-video"
                      onClick={(e) => {
                        e.stopPropagation()
                        selectSection(section.id)
                      }}
                    >
                      <img
                        src={previewImage}
                        alt={`${section.name} preview`}
                        className="w-full h-full object-contain pointer-events-none"
                        draggable={false}
                      />
                    </div>
                  )
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
