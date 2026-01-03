"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Lock, Unlock, Loader2, CheckCircle2, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SecretInputProps {
  plugin: string
  key: string
  label: string
  realValue: string  // Valor real (o que será salvo)
  exists: boolean
  updatedAt?: string
  onChange: (value: string) => Promise<void>
  onUnlock: () => void
  unlocked: boolean
  saving: boolean
  saved: boolean
  isMissing?: boolean
  helpUrl?: string
  placeholder?: string
  type?: "text" | "password"
}

/**
 * SecretInput component with masked display
 * 
 * CRÍTICO: Separar displayValue de realValue para evitar salvar placeholder por acidente.
 * - displayValue: o que aparece (pode ser "••••••••" quando locked)
 * - realValue: o que será salvo (nunca pode ser placeholder)
 */
export function SecretInput({ 
  plugin, 
  key, 
  label, 
  realValue, 
  exists, 
  updatedAt, 
  onChange, 
  onUnlock, 
  unlocked, 
  saving, 
  saved,
  isMissing,
  helpUrl,
  placeholder,
  type = "password"
}: SecretInputProps) {
  const isLocked = exists && !unlocked
  
  // CRÍTICO: Separar displayValue de realValue
  // displayValue é o que aparece (placeholder quando locked)
  // realValue é o que será salvo (nunca pode ser placeholder)
  const displayValue = isLocked ? "••••••••" : realValue
  
  const handleChange = (newValue: string) => {
    // NUNCA salvar placeholder
    if (newValue === "••••••••") return
    onChange(newValue)
  }
  
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Label className={cn(
          "text-xs font-medium",
          isMissing && "text-destructive"
        )}>
          {label}
        </Label>
        {helpUrl && (
          <a
            href={helpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Ajuda para ${label}`}
          >
            <HelpCircle className="w-3 h-3" />
          </a>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type={isLocked ? "password" : type}
            className={cn(
              "h-8 text-xs pr-8",
              isLocked && "bg-muted/50 text-muted-foreground italic cursor-not-allowed",
              isMissing && "border-destructive focus-visible:ring-destructive"
            )}
            placeholder={isLocked ? "Configurado" : (placeholder || `Digite ${label.toLowerCase()}`)}
            value={displayValue}  // Sempre usar displayValue
            disabled={isLocked || saving}
            onChange={(e) => !isLocked && handleChange(e.target.value)}
            aria-label={label}
            aria-required={isMissing}
          />
          {isLocked && (
            <Lock className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          )}
          {saving && (
            <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-primary animate-spin" />
          )}
          {saved && !saving && (
            <CheckCircle2 className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-green-600" />
          )}
        </div>
        {isLocked && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onUnlock}
            className="h-8 text-xs"
            aria-label={`Desbloquear ${label}`}
          >
            <Unlock className="h-3 w-3 mr-1" />
            Editar
          </Button>
        )}
      </div>
      {exists && updatedAt && (
        <p className="text-xs text-muted-foreground">
          Atualizado em {new Date(updatedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}

