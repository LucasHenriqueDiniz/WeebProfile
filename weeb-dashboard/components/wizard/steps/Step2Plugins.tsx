"use client"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/hooks/useAuth"
import { useProfileConfig } from "@/hooks/useProfileConfig"
import { PLUGINS_METADATA, getPluginsGroupedByCategory, type PluginCategory } from "@/lib/plugin-metadata"
import { PLUGINS_DATA } from "@/lib/plugins-data"
import { useWizardStore } from "@/stores/wizard-store"
import { AlertCircle, List, Palette, Search, Settings2 } from "lucide-react"
import { useMemo, useState, useEffect } from "react"
import { PluginCard } from "../PluginCard"
import { PluginOrderList } from "../PluginOrderList"
import { PluginAccordionItem } from "../PluginAccordionItem"
import { ProfileConfigModal } from "../ProfileConfigModal"

export function Step2Plugins() {
  const { user } = useAuth()
  const {
    plugins,
    pluginsOrder,
    style,
    setPluginUsername,
    togglePlugin,
    reorderPlugins,
    setPluginsHaveMissingEssentialConfigs,
  } = useWizardStore()

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [category, setCategory] = useState<PluginCategory | "all">("all")
  const [query, setQuery] = useState("")
  const [onlyEnabled, setOnlyEnabled] = useState(false)

  const enabledPlugins = pluginsOrder.filter((name) => plugins[name]?.enabled)
  const hasAtLeastOneSection = enabledPlugins.some(
    (name) => plugins[name]?.sections.length > 0
  )

  // Use new hook for profile config
  const { profile, essentialConfigs, missingConfigs, loading: profileLoading } = useProfileConfig(enabledPlugins)

  // Update store with missing configs status
  useEffect(() => {
    setPluginsHaveMissingEssentialConfigs(missingConfigs.length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missingConfigs.length])

  // Listen for custom event to open profile config modal
  useEffect(() => {
    const handleOpenProfileConfig = () => {
      setShowProfileModal(true)
    }
    window.addEventListener("openProfileConfig", handleOpenProfileConfig)
    return () => {
      window.removeEventListener("openProfileConfig", handleOpenProfileConfig)
    }
  }, [])

  // Apply username from profile when it loads (only once)
  useEffect(() => {
    if (!enabledPlugins.includes('github')) return
    
    const currentUsername = plugins.github?.username
    const profileUsername = profile?.username
    
    // Only update if username is different and not already set
    if (profileUsername && currentUsername !== profileUsername) {
      setPluginUsername('github', profileUsername)
    } else if (!currentUsername && !profileUsername && user?.user_metadata) {
      const usernameFromAuth =
        user.user_metadata.user_name ||
        user.user_metadata.preferred_username ||
        user.user_metadata.login
      
      if (usernameFromAuth) {
        setPluginUsername('github', usernameFromAuth)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.username, enabledPlugins.join(",")])

  // Group plugins by category
  const groupedPlugins = useMemo(() => getPluginsGroupedByCategory(), [])

  // Filter plugins based on category, query, and onlyEnabled
  const visiblePluginNames = useMemo(() => {
    let pluginNames: string[] = []

    if (category === "all") {
      pluginNames = Object.keys(PLUGINS_DATA)
    } else {
      pluginNames = groupedPlugins[category].map((p) => p.name)
    }

    return pluginNames.filter((name) => {
      const data = PLUGINS_DATA[name as keyof typeof PLUGINS_DATA]
      if (!data) return false

      const matchesQuery =
        data.name.toLowerCase().includes(query.toLowerCase()) ||
        data.description.toLowerCase().includes(query.toLowerCase())

      const isEnabled = plugins[name]?.enabled
      return matchesQuery && (!onlyEnabled || isEnabled)
    })
  }, [category, query, onlyEnabled, plugins, groupedPlugins])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Palette className="w-6 h-6" /> Choose Your Plugins
          </CardTitle>
          <CardDescription>
            Configure which plugins and sections you want to display in your image
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search plugins..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="only-enabled"
                  checked={onlyEnabled}
                  onCheckedChange={setOnlyEnabled}
                />
                <Label htmlFor="only-enabled" className="text-sm cursor-pointer">
                  Only enabled
                </Label>
              </div>
            </div>

            {/* Category Tabs */}
            <Tabs value={category} onValueChange={(v) => setCategory(v as PluginCategory | "all")}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="coding">Coding</TabsTrigger>
                <TabsTrigger value="music">Music</TabsTrigger>
                <TabsTrigger value="anime">Anime</TabsTrigger>
                <TabsTrigger value="gaming">Gaming</TabsTrigger>
              </TabsList>
              <TabsContent value={category} className="mt-0" />
            </Tabs>
          </div>

          {/* Plugin Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {visiblePluginNames.map((pluginName) => {
              const pluginData = PLUGINS_DATA[pluginName as keyof typeof PLUGINS_DATA]
              const pluginConfig = plugins[pluginName]
              const isEnabled = pluginConfig?.enabled || false

              return (
                <PluginCard
                  key={pluginName}
                  name={pluginName}
                  data={pluginData}
                  enabled={isEnabled}
                  username={pluginConfig?.username || ""}
                  sectionsCount={pluginConfig?.sections?.length || 0}
                  pluginConfig={pluginConfig}
                  essentialConfigs={essentialConfigs[pluginName]}
                  onToggle={() => togglePlugin(pluginName)}
                  onUsernameChange={(username) => setPluginUsername(pluginName, username)}
                />
              )
            })}
          </div>

          {visiblePluginNames.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No plugins found with the applied filters
            </div>
          )}

          {/* Validation - Missing Essential Configs */}
          {missingConfigs.length > 0 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-md flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  Essential configuration required
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                  Some enabled plugins need additional configuration (API keys, tokens, etc.) before continuing.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {missingConfigs.map(({ pluginName, missingKeys }) => (
                    <Badge key={pluginName} variant="outline" className="border-yellow-300 dark:border-yellow-700">
                      {pluginName}: {missingKeys.map((k) => k.label).join(", ")}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProfileModal(true)}
                  className="border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-200 dark:hover:bg-yellow-900/20"
                >
                  <Settings2 className="w-4 h-4 mr-2" />
                  Configure Now
                </Button>
              </div>
            </div>
          )}

          {/* Validation - No plugins */}
          {enabledPlugins.length === 0 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-md flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  No plugins enabled
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  You need to enable at least one plugin to continue
                </p>
              </div>
            </div>
          )}

          {enabledPlugins.length > 0 && !hasAtLeastOneSection && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-md flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  No sections selected
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Select at least one section in the enabled plugins
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Reorganize plugin order */}
          {enabledPlugins.length > 1 && (
            <>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="plugin-order" className="border-none">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <List className="w-4 h-4" />
                      <Label className="text-base font-semibold cursor-pointer">Plugin Order</Label>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag the blocks below to reorganize the order in which plugins will appear in the generated image
                      </p>
                      <PluginOrderList
                        plugins={plugins}
                        pluginsOrder={pluginsOrder}
                        onReorder={reorderPlugins}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Separator className="my-6" />
            </>
          )}

          {/* Configured Plugins Section */}
          {enabledPlugins.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold">Configured Plugins</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Configure each enabled plugin: select sections, adjust options, and organize the display order.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {enabledPlugins.map((pluginName) => (
                  <PluginAccordionItem
                    key={pluginName}
                    pluginName={pluginName}
                    style={style}
                    essentialConfigs={essentialConfigs[pluginName]}
                  />
                ))}
              </Accordion>
            </div>
          )}
        </CardContent>
      </Card>

      <ProfileConfigModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
        enabledPlugins={enabledPlugins}
        onSave={async () => {
          // Reload will happen automatically via useProfileConfig hook
          // No need to manually refetch here
        }}
      />
    </div>
  )
}
