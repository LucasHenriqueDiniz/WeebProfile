"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NumberInput } from "@/components/ui/number-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react"

export interface ObjectArrayItemField {
  key: string
  label: string
  type: "string" | "boolean" | "number" | "select"
  placeholder?: string
  description?: string
  required?: boolean
  options?: { value: string; label: string }[]
}

export type ObjectArrayItem = Record<string, string | number | boolean>

interface ObjectArrayInputProps {
  value: ObjectArrayItem[]
  itemFields: ObjectArrayItemField[]
  onChange: (value: ObjectArrayItem[]) => void
  maxItems?: number
  addLabel?: string
  emptyHint?: string
}

function emptyItem(itemFields: ObjectArrayItemField[]): ObjectArrayItem {
  const item: ObjectArrayItem = {}
  itemFields.forEach((field) => {
    item[field.key] = field.type === "boolean" ? false : field.type === "number" ? 0 : ""
  })
  return item
}

/**
 * Editor de lista de objetos: cada item é um card com os sub-campos declarados
 * em `itemFields` da configOption. Usado pelo tipo `object-array`.
 */
export function ObjectArrayInput({
  value,
  itemFields,
  onChange,
  maxItems,
  addLabel = "Adicionar item",
  emptyHint = "Nenhum item adicionado ainda.",
}: ObjectArrayInputProps) {
  const items = Array.isArray(value) ? value : []
  const atLimit = maxItems !== undefined && items.length >= maxItems

  const updateItem = (index: number, patch: ObjectArrayItem) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-xs text-muted-foreground">{emptyHint}</p>}

      {items.map((item, index) => {
        const missingRequired = itemFields.filter(
          (field) => field.required && String(item?.[field.key] ?? "").trim() === ""
        )

        return (
          <div
            key={index}
            className={`space-y-3 rounded-lg border p-3 ${
              missingRequired.length > 0 ? "border-destructive/50" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  aria-label="Mover para cima"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  aria-label="Mover para baixo"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => removeItem(index)}
                  aria-label="Remover item"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {itemFields.map((field) => {
              const fieldId = `object-array-${index}-${field.key}`
              const fieldValue = item?.[field.key]

              return (
                <div key={field.key} className="space-y-1.5">
                  <Label htmlFor={fieldId} className="text-xs">
                    {field.label}
                    {field.required && <span className="ml-0.5 text-destructive">*</span>}
                  </Label>

                  {field.type === "string" && (
                    <Input
                      id={fieldId}
                      type="text"
                      value={typeof fieldValue === "string" ? fieldValue : ""}
                      placeholder={field.placeholder}
                      onChange={(e) => updateItem(index, { [field.key]: e.target.value })}
                    />
                  )}

                  {field.type === "number" && (
                    <NumberInput
                      id={fieldId}
                      value={typeof fieldValue === "number" ? fieldValue : 0}
                      onChange={(newValue) => updateItem(index, { [field.key]: newValue })}
                    />
                  )}

                  {field.type === "boolean" && (
                    <Switch
                      id={fieldId}
                      checked={fieldValue === true}
                      onCheckedChange={(checked) => updateItem(index, { [field.key]: checked })}
                    />
                  )}

                  {field.type === "select" && field.options && (
                    <Select
                      value={typeof fieldValue === "string" ? fieldValue : ""}
                      onValueChange={(newValue) => updateItem(index, { [field.key]: newValue })}
                    >
                      <SelectTrigger id={fieldId}>
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
                </div>
              )
            })}

            {missingRequired.length > 0 && (
              <p className="text-xs text-destructive">
                Preencha: {missingRequired.map((field) => field.label).join(", ")}
              </p>
            )}
          </div>
        )
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => onChange([...items, emptyItem(itemFields)])}
        disabled={atLimit}
      >
        <Plus className="mr-1.5 h-4 w-4" />
        {addLabel}
      </Button>

      {maxItems !== undefined && (
        <p className="text-xs text-muted-foreground">
          {items.length} de {maxItems}
        </p>
      )}
    </div>
  )
}
