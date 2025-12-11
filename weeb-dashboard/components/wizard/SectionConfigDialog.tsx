"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NumberInput } from "@/components/ui/number-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  PLUGINS_METADATA,
  getSectionConfigOptions as getSectionConfigOptionsFromMetadata
} from "@weeb/weeb-plugins/plugins/metadata"
import { Settings } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

// Define SectionConfigOption locally since it's not exported from metadata path
interface SectionConfigOption {
  key: string
  label: string
  type: "number" | "boolean" | "string" | "select"
  defaultValue?: any
  min?: number
  max?: number
  step?: number
  description?: string
  options?: { value: string; label: string }[]
}

// Usar metadata centralizada
const getSectionConfigOptions = (plugin: string, sectionId: string): SectionConfigOption[] => {
  return getSectionConfigOptionsFromMetadata(plugin as keyof typeof PLUGINS_METADATA, sectionId)
}

// Legacy function and configs removed - all section config options are now defined in PLUGINS_METADATA

interface SectionConfigDialogProps {
  plugin: string
  section: {
    id: string
    name: string
  }
  sectionConfig: Record<string, any>
  onConfigChange: (config: Record<string, any>) => void
}

export function SectionConfigDialog({
  plugin,
  section,
  sectionConfig,
  onConfigChange,
}: SectionConfigDialogProps) {
  const [open, setOpen] = useState(false)
  const options = getSectionConfigOptions(plugin, section.id)
  const prevOpenRef = useRef(false)

  // Create stable key from sectionConfig to avoid unnecessary re-renders
  const sectionConfigKey = useMemo(() => JSON.stringify(sectionConfig), [sectionConfig])

  // Calculate initial config function
  const getInitialConfig = () => {
    const config: Record<string, any> = {}
    options.forEach((option) => {
      config[option.key] = sectionConfig[option.key] ?? option.defaultValue
    })
    return config
  }

  const [localConfig, setLocalConfig] = useState(() => getInitialConfig())

  // Update local config when dialog opens (not when it closes)
  useEffect(() => {
    // Only update when dialog transitions from closed to open
    if (open && !prevOpenRef.current) {
      setLocalConfig(getInitialConfig())
    }
    prevOpenRef.current = open
  }, [open, plugin, section.id, sectionConfigKey])

  if (options.length === 0) return null

  const handleSave = () => {
    onConfigChange(localConfig)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 rounded-full hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-colors" 
          onClick={(e) => e.stopPropagation()}
          title="Configurar seção"
        >
          <Settings className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações: {section.name}</DialogTitle>
          <DialogDescription>
            Configure opções específicas desta seção
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {options.map((option) => {
            const value = localConfig[option.key] ?? option.defaultValue

            return (
              <div key={option.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={option.key}>{option.label}</Label>
                  {option.min !== undefined && option.max !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {option.min} - {option.max}
                    </span>
                  )}
                </div>
                {option.type === "number" && (
                  <>
                    <NumberInput
                      id={option.key}
                      value={typeof value === "number" ? value : (option.defaultValue || 0)}
                      onChange={(newValue) =>
                        setLocalConfig({
                          ...localConfig,
                          [option.key]: newValue,
                        })
                      }
                      min={option.min}
                      max={option.max}
                      step={option.step}
                      showStepper={true}
                    />
                    {option.description && (
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    )}
                  </>
                )}
                {option.type === "boolean" && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={option.key}
                      checked={value}
                      onCheckedChange={(checked) =>
                        setLocalConfig({
                          ...localConfig,
                          [option.key]: checked,
                        })
                      }
                    />
                    <Label htmlFor={option.key} className="cursor-pointer">
                      {value ? "Ativado" : "Desativado"}
                    </Label>
                  </div>
                )}
                {option.type === "string" && (
                  <Input
                    id={option.key}
                    type="text"
                    value={value}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        [option.key]: e.target.value,
                      })
                    }
                  />
                )}
                {option.type === "select" && option.options && (
                  <Select
                    value={value || option.defaultValue}
                    onValueChange={(newValue) =>
                      setLocalConfig({
                        ...localConfig,
                        [option.key]: newValue,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      {option.options.map((opt: { value: string; label: string }) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )
          })}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

