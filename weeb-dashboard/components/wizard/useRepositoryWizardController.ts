import { useRouter } from "@/src/compat/next-navigation"
import { useMemo, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRepositoryWizardStore } from "@/stores/repository-wizard-store"
import { useWizardBootstrapStore } from "@/stores/wizard-bootstrap-store"
import { ApiException, svgApi } from "@/lib/api"
import { setTerminalConfigs } from "@/lib/config/svg-config-helpers"

interface UseRepositoryWizardControllerProps {
  isEditMode?: boolean
  editSvgId?: string
}

export function useRepositoryWizardController({
  isEditMode = false,
  editSvgId,
}: UseRepositoryWizardControllerProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const {
    owner,
    repo,
    style,
    size,
    theme,
    hideTerminalEmojis,
    hideTerminalHeader,
    hideTerminalCommand,
    customCss,
    customThemeColors,
    sections,
    sectionConfigs,
    reset,
  } = useRepositoryWizardStore()

  // github_repo's secret presence is aliased server-side to "github" (see
  // functions/api/secrets/presence.ts), so this reflects the shared PAT automatically.
  const { missingSecrets } = useWizardBootstrapStore()
  const repoMissingSecrets = useMemo(
    () => missingSecrets.find((m) => m.pluginName === "github_repo"),
    [missingSecrets]
  )
  const hasMissingEssential = !!repoMissingSecrets && repoMissingSecrets.missingKeys.length > 0
  const missingConfigs = useMemo(
    () =>
      repoMissingSecrets?.missingKeys.map((k) => ({ plugin: "github_repo", field: k.key, label: k.label })) || [],
    [repoMissingSecrets]
  )

  const hasContent = !!(owner && repo)

  const handleFinish = async () => {
    if (!hasContent) {
      toast({
        title: "Missing repository",
        description: "Enter a repository (owner/repo) before continuing",
        variant: "destructive",
      })
      return
    }
    if (hasMissingEssential) {
      toast({
        title: "Missing configuration",
        description: "Configure your GitHub token in Profile settings before continuing",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const pluginsConfig = {
        github_repo: {
          enabled: true,
          sections,
          owner,
          repo,
          sectionConfigs,
        },
      }

      const uiConfig = setTerminalConfigs(
        {},
        { hideTerminalEmojis, hideTerminalHeader, hideTerminalCommand }
      )
      if (theme === "custom" && Object.keys(customThemeColors).length > 0) {
        uiConfig.customThemeColors = customThemeColors
      }

      const autoName = `${owner}/${repo} Repository Card`

      const svgData: any = {
        name: autoName,
        entityType: "repository",
        artifactType: "repository_card",
        variant: "default",
        style,
        size,
        theme,
        customCss: customCss || null,
        pluginsConfig,
        pluginsOrder: "github_repo",
        uiConfig,
      }

      const data = isEditMode && editSvgId ? await svgApi.update(editSvgId, svgData) : await svgApi.create(svgData)
      const svgId = data.svg.id

      toast({ title: "Generating image...", description: "Please wait while we render your SVG" })

      try {
        const generateData = await svgApi.generate(svgId)

        if (generateData.success && generateData.svg?.storageUrl) {
          toast({
            title: "Success!",
            description: `Repository card ${isEditMode ? "updated" : "created"} successfully!`,
          })
          if (!isEditMode) reset()
          router.push(`/dashboard/${svgId}?url=${encodeURIComponent(generateData.svg.storageUrl)}`)
        } else {
          if (!isEditMode) reset()
          router.push(`/dashboard/${svgId}`)
        }
      } catch (generateError: any) {
        if (!isEditMode) reset()
        console.error("Error generating repository card:", generateError)
        toast({
          title: "Card created",
          description: "The card was created, but generation had an issue. Check the details page.",
        })
        router.push(`/dashboard/${svgId}`)
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} repository card:`, error)
      const errorMessage =
        error instanceof ApiException
          ? error.data.message || error.data.error || error.message
          : error instanceof Error
            ? error.message
            : `Error ${isEditMode ? "updating" : "creating"} image`
      toast({ title: "Error", description: errorMessage, variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const footerProps = useMemo(
    () => ({
      onFinish: handleFinish,
      isSaving,
      hasMissingEssential,
      missingConfigs,
      canFinish: hasContent,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSaving, hasMissingEssential, missingConfigs, hasContent, owner, repo]
  )

  return {
    hasContent,
    handleFinish,
    footerProps,
  }
}
