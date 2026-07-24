"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRepositoryWizardStore } from "@/stores/repository-wizard-store"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { getSectionPreview } from "@/lib/config/section-previews"
import { cn } from "@/lib/utils"
import { Check, Sparkles } from "lucide-react"
import { useState } from "react"
import { SectionConfigDialog } from "./SectionConfigDialog"

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

// Painel de config do Repository - lista as seções reais do plugin (Banner, Insights:
// star graph, contadores, tecnologias...) como cards que ligam/desligam, igual o
// wizard de Profile faz para qualquer outro plugin multi-seção (ver PluginCard.tsx).
// Antes disso era só uma lista fixa de toggles amarrada a uma única seção hardcoded
// ("repository_card"), que não refletia o design real do card.
export function RepositoryConfigPanel() {
  const { owner, repo, style, sections, sectionConfigs, setOwnerRepo, toggleSection, setSectionConfig } =
    useRepositoryWizardStore()
  const [rawInput, setRawInput] = useState(owner && repo ? `${owner}/${repo}` : "")
  const [error, setError] = useState<string | null>(null)

  const metadata = PLUGINS_METADATA.github_repo

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
        <p className="text-xs font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-3 w-3" />
          Sections ({sections.length}/{metadata.sections.length})
        </p>
        <div className="grid grid-cols-1 gap-3">
          {metadata.sections.map((section) => {
            const isSelected = sections.includes(section.id)
            const hasConfigs = section.configOptions && section.configOptions.length > 0
            const previewImage = getSectionPreview("github_repo", section.id, style)

            return (
              <div
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className={cn(
                  "flex flex-col gap-2.5 p-3 rounded-lg border cursor-pointer transition-all",
                  isSelected
                    ? "bg-primary/5 text-primary border-primary/30"
                    : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50 hover:border-primary/20"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => toggleSection(section.id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${isSelected ? "Deselect" : "Select"} ${section.name}`}
                    />
                    {isSelected && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
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
                {previewImage && (
                  <div
                    className="rounded-md overflow-hidden border border-border bg-background aspect-video"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSection(section.id)
                    }}
                  >
                    <img
                      src={previewImage}
                      alt={`${section.name} preview`}
                      className="w-full h-full object-contain pointer-events-none"
                      draggable={false}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
