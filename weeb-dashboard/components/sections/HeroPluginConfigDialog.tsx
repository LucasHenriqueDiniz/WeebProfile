"use client"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { PLUGINS_METADATA } from "@weeb/weeb-plugins/plugins/metadata"
import { memo } from "react"
import { SectionSelector } from "./SectionSelector"

interface HeroPluginConfigDialogProps {
	pluginId: string
	open: boolean
	onOpenChange: (open: boolean) => void
	selectedSections: string[]
	sectionConfigs: Record<string, any>
	onSectionsChange: (sections: string[]) => void
	onSectionConfigChange: (sectionId: string, config: Record<string, any>) => void
}

export const HeroPluginConfigDialog = memo(function HeroPluginConfigDialog({
	pluginId,
	open,
	onOpenChange,
	selectedSections,
	sectionConfigs,
	onSectionsChange,
	onSectionConfigChange,
}: HeroPluginConfigDialogProps) {
	const metadata = PLUGINS_METADATA[pluginId as keyof typeof PLUGINS_METADATA]

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Configure {metadata?.displayName || pluginId}</DialogTitle>
					<DialogDescription>
						Choose which sections to display (using demo data)
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<SectionSelector
							pluginId={pluginId}
							selectedSections={selectedSections}
							onSectionsChange={onSectionsChange}
							sectionConfigs={sectionConfigs}
							onSectionConfigChange={onSectionConfigChange}
						/>
					</div>
				</div>
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Done
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
})












