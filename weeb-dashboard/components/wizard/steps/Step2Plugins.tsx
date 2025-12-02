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
import { PLUGINS_METADATA, getPluginsGroupedByCategory, type PluginCategory } from "@weeb/weeb-plugins/plugins/metadata"
import { PLUGINS_DATA } from "@/lib/plugins-data"
import { useWizardStore } from "@/stores/wizard-store"
import { AlertCircle, List, Palette, Search, Settings2, CheckSquare, ArrowUpDown } from "lucide-react"
import { useMemo, useState, useEffect, useCallback } from "react"
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
    setPluginRequiredField,
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
      setPluginRequiredField('github', 'username', profileUsername)
    } else if (!currentUsername && !profileUsername && user?.user_metadata) {
      const usernameFromAuth =
        user.user_metadata.user_name ||
        user.user_metadata.preferred_username ||
        user.user_metadata.login
      
      if (usernameFromAuth) {
        setPluginRequiredField('github', 'username', usernameFromAuth)
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

  // Show loading state while profile config is loading (after all hooks)
  if (profileLoading && enabledPlugins.length > 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Loading plugin configurations...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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
        <CardContent>
          <Tabs defaultValue="select" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="select" className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Selecionar
              </TabsTrigger>
              <TabsTrigger value="configure" className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Configurar
              </TabsTrigger>
              <TabsTrigger value="reorder" className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" />
                Reordenar
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Selecionar Plugins */}
            <TabsContent value="select" className="space-y-6 mt-6">

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
                  sectionsCount={pluginConfig?.sections?.length || 0}
                  pluginConfig={pluginConfig}
                  essentialConfigs={essentialConfigs[pluginName] as Record<string, string | boolean | undefined> | undefined}
                  onToggle={() => togglePlugin(pluginName)}
                  onRequiredFieldChange={(field, value) => {
                    setPluginRequiredField(pluginName, field, value)
                  }}
                />
              )
            })}
          </div>

          {visiblePluginNames.length === 0 && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Search className="w-12 h-12 text-muted-foreground/50" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    No plugins found
                  </p>
                  <p className="text-xs text-muted-foreground/80">
                    {query ? "Try adjusting your search query" : "Try changing the category filter"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Validation - Missing Essential Configs */}
          {missingConfigs.length > 0 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-md flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  Configuração sensível necessária
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                  Alguns plugins habilitados precisam de configurações sensíveis (API keys, tokens, etc.) antes de continuar.
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

            </TabsContent>

            {/* Tab 2: Configurar Plugins */}
            <TabsContent value="configure" className="space-y-6 mt-6">
              {enabledPlugins.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Settings2 className="w-12 h-12 text-muted-foreground/50" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        No plugins enabled
                      </p>
                      <p className="text-xs text-muted-foreground/80">
                        Enable at least one plugin in the "Selecionar" tab to configure it
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {enabledPlugins.length > 0 && !hasAtLeastOneSection && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-md flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                          No sections selected
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                          Select at least one section in the enabled plugins to continue.
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {enabledPlugins.map((name) => (
                            <Badge key={name} variant="outline" className="border-yellow-300 dark:border-yellow-700 text-xs">
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

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
                          essentialConfigs={essentialConfigs[pluginName] as Record<string, boolean | undefined>}
                        />
                      ))}
                    </Accordion>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Tab 3: Reordenar Plugins */}
            <TabsContent value="reorder" className="space-y-6 mt-6">
              {enabledPlugins.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <ArrowUpDown className="w-12 h-12 text-muted-foreground/50" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        No plugins enabled
                      </p>
                      <p className="text-xs text-muted-foreground/80">
                        Enable at least one plugin in the "Selecionar" tab to reorder them
                      </p>
                    </div>
                  </div>
                </div>
              ) : enabledPlugins.length === 1 ? (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <ArrowUpDown className="w-12 h-12 text-muted-foreground/50" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Only one plugin enabled
                      </p>
                      <p className="text-xs text-muted-foreground/80">
                        Enable at least two plugins to reorder them
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label className="text-base font-semibold flex items-center gap-2 mb-2">
                      <List className="w-4 h-4" />
                      Plugin Order
                    </Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag the blocks below to reorganize the order in which plugins will appear in the generated image
                    </p>
                  </div>
                  <PluginOrderList
                    plugins={plugins}
                    pluginsOrder={pluginsOrder}
                    onReorder={reorderPlugins}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
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
