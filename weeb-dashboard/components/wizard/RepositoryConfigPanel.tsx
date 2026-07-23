"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useRepositoryWizardStore } from "@/stores/repository-wizard-store"
import { useState } from "react"

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

export function RepositoryConfigPanel() {
  const { owner, repo, contentConfig, setOwnerRepo, setContentOption } = useRepositoryWizardStore()
  const [rawInput, setRawInput] = useState(owner && repo ? `${owner}/${repo}` : "")
  const [error, setError] = useState<string | null>(null)

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

      <div className="divide-y divide-border/60">
        <div className="py-3 flex items-center justify-between">
          <Label htmlFor="show-description" className="text-sm font-medium cursor-pointer">
            Show description
          </Label>
          <Switch
            id="show-description"
            checked={contentConfig.show_description ?? true}
            onCheckedChange={(v) => setContentOption("show_description", v)}
          />
        </div>
        <div className="py-3 flex items-center justify-between">
          <Label htmlFor="show-language" className="text-sm font-medium cursor-pointer">
            Show primary language
          </Label>
          <Switch
            id="show-language"
            checked={contentConfig.show_language ?? true}
            onCheckedChange={(v) => setContentOption("show_language", v)}
          />
        </div>
        <div className="py-3 flex items-center justify-between">
          <Label htmlFor="show-stats" className="text-sm font-medium cursor-pointer">
            Show stars and forks
          </Label>
          <Switch
            id="show-stats"
            checked={contentConfig.show_stats ?? true}
            onCheckedChange={(v) => setContentOption("show_stats", v)}
          />
        </div>
        <div className="py-3 flex items-center justify-between">
          <Label htmlFor="show-license" className="text-sm font-medium cursor-pointer">
            Show license
          </Label>
          <Switch
            id="show-license"
            checked={contentConfig.show_license ?? true}
            onCheckedChange={(v) => setContentOption("show_license", v)}
          />
        </div>
        <div className="py-3 flex items-center justify-between">
          <Label htmlFor="show-topics" className="text-sm font-medium cursor-pointer">
            Show topics
          </Label>
          <Switch
            id="show-topics"
            checked={contentConfig.show_topics ?? true}
            onCheckedChange={(v) => setContentOption("show_topics", v)}
          />
        </div>
      </div>
    </div>
  )
}
