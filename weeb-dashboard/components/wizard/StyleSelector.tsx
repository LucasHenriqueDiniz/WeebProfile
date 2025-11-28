"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface StyleOption {
  value: string
  label: string
  description: string
}

interface StyleSelectorProps {
  options: StyleOption[]
  value: string
  onChange: (value: string) => void
}

export function StyleSelector({ options, value, onChange }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {options.map((option) => {
        const isSelected = value === option.value

        return (
          <Card
            key={option.value}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              isSelected && "ring-2 ring-primary bg-primary/5"
            )}
            onClick={() => onChange(option.value)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold mb-1">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
                {isSelected && (
                  <div className="ml-2 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}


