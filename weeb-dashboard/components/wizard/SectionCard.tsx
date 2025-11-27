"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { getSectionPreview } from "@/lib/section-previews"
import Image from "next/image"

interface SectionCardProps {
  plugin: string
  section: {
    id: string
    name: string
    description?: string
  }
  selected: boolean
  onToggle: () => void
  style?: "default" | "terminal"
}

export function SectionCard({ plugin, section, selected, onToggle, style = "default" }: SectionCardProps) {
  const previewUrl = getSectionPreview(plugin, section.id, style)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selected && "ring-2 ring-primary bg-primary/5"
            )}
            onClick={onToggle}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 flex items-center justify-center w-5 h-5 rounded border-2 transition-colors",
                    selected
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  )}
                >
                  {selected && <Check className="w-3 h-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{section.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{section.description}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        {previewUrl && (
          <TooltipContent side="right" className="p-0 max-w-md">
            <div className="relative w-full max-w-sm">
              <Image
                src={previewUrl}
                alt={`Preview: ${section.name}`}
                width={600}
                height={300}
                className="rounded-md"
                unoptimized
                onError={(e) => {
                  // Se a imagem não existir, esconder o tooltip
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

