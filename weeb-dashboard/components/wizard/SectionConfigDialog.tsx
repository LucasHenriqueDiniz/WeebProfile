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
} from "@/lib/plugin-metadata"
import { Settings, X, Plus, HelpCircle, ExternalLink } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Define SectionConfigOption locally since it's not exported from metadata path
interface SectionConfigOption {
  key: string
  label: string
  type: "number" | "boolean" | "string" | "select" | "array"
  defaultValue?: any
  min?: number
  max?: number
  step?: number
  description?: string
  options?: { value: string; label: string }[]
  helpUrl?: string
  tooltip?: string
  docUrl?: string
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
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={option.key}>{option.label}</Label>
                    {option.tooltip ? (
                      // Se tiver tooltip, mostrar tooltip com o texto
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="text-sm whitespace-pre-line">{option.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : option.helpUrl ? (
                      // Se não tiver tooltip mas tiver helpUrl, mostrar ícone de ajuda com tooltip + link
                      <div className="flex items-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <p className="text-sm whitespace-pre-line">
                                {option.description 
                                  ? `${option.description}\n\nClique no link ao lado para obter mais informações.`
                                  : "Clique no link ao lado para abrir o link de ajuda e obter mais informações."}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <a
                          href={option.helpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                          title="Abrir link de ajuda"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ) : null}
                  </div>
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
                {option.type === "array" && (
                  <ArrayInput
                    value={Array.isArray(value) ? value : []}
                    onChange={(newArray) =>
                      setLocalConfig({
                        ...localConfig,
                        [option.key]: newArray,
                      })
                    }
                    placeholder={option.description || "Digite um valor e pressione Enter"}
                  />
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

/**
 * Array Input Component - Allows adding/removing items from an array
 */
interface ArrayInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

function ArrayInput({ value, onChange, placeholder }: ArrayInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleAdd = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
      setInputValue("")
    }
  }

  const handleRemove = (itemToRemove: string) => {
    onChange(value.filter(item => item !== itemToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Digite um valor e pressione Enter"}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={!inputValue.trim() || value.includes(inputValue.trim())}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1.5 px-2 py-1"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(item)}
                className="ml-1 rounded-full hover:bg-destructive/20 p-0.5 transition-colors"
                aria-label={`Remover ${item}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {value.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Nenhum item adicionado. Digite um valor e pressione Enter ou clique no botão +.
        </p>
      )}
    </div>
  )
}

