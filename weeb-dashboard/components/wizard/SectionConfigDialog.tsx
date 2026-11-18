"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NumberInput } from "@/components/ui/number-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  PLUGINS_METADATA,
  getSectionConfigOptions as getSectionConfigOptionsFromMetadata,
} from "@weeb/weeb-plugins/plugins/metadata"
import { Settings, X, Plus, HelpCircle, ExternalLink } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ObjectArrayInput, type ObjectArrayItem, type ObjectArrayItemField } from "./ObjectArrayInput"
import { ImageInput } from "./ImageInput"
import { usePluginI18n } from "@/lib/plugins/i18n-helper"
import { translateItemFields } from "@/lib/plugins/item-fields-i18n"
import { useTranslations } from "@/i18n/use-translations"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define SectionConfigOption locally since it's not exported from metadata path
interface SectionConfigOption {
  key: string
  label: string
  type: "number" | "boolean" | "string" | "select" | "array" | "object-array" | "image"
  defaultValue?: any
  min?: number
  max?: number
  step?: number
  description?: string
  options?: { value: string; label: string }[]
  itemFields?: ObjectArrayItemField[]
  maxItems?: number
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

export function SectionConfigDialog({ plugin, section, sectionConfig, onConfigChange }: SectionConfigDialogProps) {
  const [open, setOpen] = useState(false)
  const { tWithFallback } = usePluginI18n()
  const tPlugins = useTranslations("wizard.plugins")
  const t = useTranslations("wizard.sectionConfig")
  const options = getSectionConfigOptions(plugin, section.id)
  const prevOpenRef = useRef(false)

  // Get full section metadata for i18n
  const pluginMetadata = PLUGINS_METADATA[plugin as keyof typeof PLUGINS_METADATA] as any
  const sectionMetadata = pluginMetadata?.sections?.find((s: any) => s.id === section.id)

  // Create stable key from sectionConfig to avoid unnecessary re-renders
  const sectionConfigKey = useMemo(() => JSON.stringify(sectionConfig), [sectionConfig])

  // An unset option starts at the plugin's own default, the text the card already
  // shows. Not the translated one (i18nKey.defaultValue): the field then disagreed
  // with the card ("Estatísticas de Anime" over "Anime Statistics"), and the first
  // change to any option here saved it, switching the card title's language without
  // the user touching the title.
  const getInitialConfig = () => {
    const config: Record<string, any> = {}
    options.forEach((option) => {
      const current = sectionConfig[option.key]
      config[option.key] = current !== undefined && current !== null ? current : option.defaultValue
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

  // Sem "Salvar": cada mudança já propaga pro pai (que alimenta o preview ao vivo),
  // o drawer só junta os campos - fechar ou continuar aberto não muda o resultado.
  const updateConfig = (patch: Record<string, any>) => {
    const next = { ...localConfig, ...patch }
    setLocalConfig(next)
    onConfigChange(next)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 rounded-full hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-colors"
          onClick={(e) => e.stopPropagation()}
          title={t("open")}
        >
          <Settings className="w-3 h-3" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {t("title", {
              section: sectionMetadata?.i18nKey?.name
                ? tWithFallback(sectionMetadata.i18nKey.name.replace(/^plugins\./, ""), section.name)
                : section.name,
            })}
          </SheetTitle>
          <SheetDescription>{t("live")}</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          {options.map((option) => {
            const value = localConfig[option.key] ?? option.defaultValue
            const optionMetadata = sectionMetadata?.configOptions?.find((opt: any) => opt.key === option.key)

            // Get translated values
            const optionLabel = optionMetadata?.i18nKey?.label
              ? tWithFallback(optionMetadata.i18nKey.label.replace(/^plugins\./, ""), option.label)
              : option.label
            const optionDescription =
              option.description && optionMetadata?.i18nKey?.description
                ? tWithFallback(optionMetadata.i18nKey.description.replace(/^plugins\./, ""), option.description)
                : option.description
            const optionTooltip =
              option.tooltip && optionMetadata?.i18nKey?.tooltip
                ? tWithFallback(optionMetadata.i18nKey.tooltip.replace(/^plugins\./, ""), option.tooltip)
                : option.tooltip

            return (
              <div key={option.key} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={option.key}>{optionLabel}</Label>
                    {optionTooltip ? (
                      // Se tiver tooltip, mostrar tooltip com o texto
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="text-sm whitespace-pre-line">{optionTooltip}</p>
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
                                {optionDescription ? `${optionDescription}\n\n${t("helpLinkMore")}` : t("helpLink")}
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
                          title={t("openHelp")}
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
                      value={typeof value === "number" ? value : option.defaultValue || 0}
                      onChange={(newValue) => updateConfig({ [option.key]: newValue })}
                      min={option.min}
                      max={option.max}
                      step={option.step}
                      showStepper={true}
                    />
                    {optionDescription && <p className="text-xs text-muted-foreground">{optionDescription}</p>}
                  </>
                )}
                {option.type === "boolean" && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={option.key}
                      checked={value}
                      onCheckedChange={(checked) => updateConfig({ [option.key]: checked })}
                    />
                    <Label htmlFor={option.key} className="cursor-pointer">
                      {value ? t("on") : t("off")}
                    </Label>
                  </div>
                )}
                {option.type === "string" && (
                  <Input
                    id={option.key}
                    type="text"
                    value={value}
                    // O placeholder é o texto que o card mostra quando o campo está
                    // vazio -- o `defaultValue` do metadata é o mesmo fallback que o
                    // componente usa. Sem isso o campo ficava em branco e não havia
                    // como saber qual header ele controla.
                    placeholder={typeof option.defaultValue === "string" ? option.defaultValue : undefined}
                    onChange={(e) => updateConfig({ [option.key]: e.target.value })}
                  />
                )}
                {option.type === "image" && (
                  <>
                    <ImageInput
                      id={option.key}
                      value={typeof value === "string" ? value : ""}
                      onChange={(newValue) => updateConfig({ [option.key]: newValue })}
                    />
                    {optionDescription && <p className="text-xs text-muted-foreground">{optionDescription}</p>}
                  </>
                )}
                {option.type === "select" && option.options && (
                  <Select
                    value={value || option.defaultValue}
                    onValueChange={(newValue) => updateConfig({ [option.key]: newValue })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={tPlugins("selectOption")} />
                    </SelectTrigger>
                    <SelectContent>
                      {option.options.map((opt: { value: string; label: string }) => {
                        // Translate select option labels
                        const optionI18nKey = optionMetadata?.i18nKey?.options?.[opt.value]
                        const translatedLabel = optionI18nKey
                          ? tWithFallback(optionI18nKey.replace(/^plugins\./, ""), opt.label)
                          : opt.label
                        return (
                          <SelectItem key={opt.value} value={opt.value}>
                            {translatedLabel}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                )}
                {option.type === "array" && (
                  <ArrayInput
                    value={Array.isArray(value) ? value : []}
                    onChange={(newArray) => updateConfig({ [option.key]: newArray })}
                    placeholder={option.description || t("arrayPlaceholder")}
                  />
                )}
                {option.type === "object-array" && option.itemFields && (
                  <>
                    <ObjectArrayInput
                      value={(Array.isArray(value) ? value : []) as ObjectArrayItem[]}
                      itemFields={translateItemFields(option.itemFields, tWithFallback)}
                      maxItems={option.maxItems}
                      addLabel={t("addItem", { item: optionLabel.toLowerCase() })}
                      onChange={(newItems) => updateConfig({ [option.key]: newItems })}
                    />
                    {optionDescription && <p className="text-xs text-muted-foreground">{optionDescription}</p>}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
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
  const t = useTranslations("wizard.sectionConfig")
  const [inputValue, setInputValue] = useState("")

  const handleAdd = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
      setInputValue("")
    }
  }

  const handleRemove = (itemToRemove: string) => {
    onChange(value.filter((item) => item !== itemToRemove))
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
          placeholder={placeholder || t("arrayPlaceholder")}
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
            <Badge key={index} variant="secondary" className="flex items-center gap-1.5 px-2 py-1">
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(item)}
                className="ml-1 rounded-full hover:bg-destructive/20 p-0.5 transition-colors"
                aria-label={t("removeValue", { item })}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {value.length === 0 && <p className="text-xs text-muted-foreground">{t("arrayEmpty")}</p>}
    </div>
  )
}
