"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Palette } from "lucide-react"
import { ReactNode } from "react"

interface WizardTabsProps {
  activeTab: "plugins" | "style"
  onTabChange: (tab: "plugins" | "style") => void
  children: ReactNode
}

export function WizardTabs({ activeTab, onTabChange, children }: WizardTabsProps) {
  const handleTabChange = (value: string) => {
    const tab = value as "plugins" | "style"
    onTabChange(tab)
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <div className="flex border-b border-border bg-muted/30">
        <TabsList className="w-full h-auto p-1 bg-transparent gap-1">
          <TabsTrigger
            value="plugins"
            className="flex-1 rounded-lg border-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 py-2.5 font-medium transition-all"
          >
            <Package className="h-4 w-4 mr-2" />
            Plugins
          </TabsTrigger>
          <TabsTrigger
            value="style"
            className="flex-1 rounded-lg border-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 py-2.5 font-medium transition-all"
          >
            <Palette className="h-4 w-4 mr-2" />
            Style
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Render children - Radix UI handles visibility automatically */}
      {children}
    </Tabs>
  )
}

// Compound component pattern for tab content
WizardTabs.Plugins = function WizardTabsPlugins({ children }: { children: ReactNode }) {
  return (
    <TabsContent value="plugins" className="p-4 m-0 mt-0">
      {children}
    </TabsContent>
  )
}

WizardTabs.Style = function WizardTabsStyle({ children }: { children: ReactNode }) {
  return (
    <TabsContent value="style" className="p-4 m-0 mt-0">
      {children}
    </TabsContent>
  )
}
