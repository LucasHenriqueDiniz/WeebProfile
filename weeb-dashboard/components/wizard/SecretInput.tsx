"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Lock, Unlock, Loader2, CheckCircle2, HelpCircle, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react"

interface SecretInputProps {
  plugin: string
  label: string
  realValue: string  // Valor real (o que será salvo)
  exists: boolean
  updatedAt?: string
  onChange: (value: string) => void  // Apenas atualiza estado local (sem save)
  onSave: () => Promise<void>  // Salva no servidor
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
  label, 
  realValue, 
  exists, 
  updatedAt, 
  onChange, 
  onSave,
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
  const [localValue, setLocalValue] = React.useState(realValue || "")
  
  // Sincronizar localValue com realValue quando realValue mudar externamente (apenas se não estiver locked)
  // Se estiver locked, manter o placeholder
  React.useEffect(() => {
    if (!isLocked) {
      // Só atualizar se o realValue mudou externamente (não por edição do usuário)
      // Isso evita resetar o valor enquanto o usuário está digitando
      if (realValue !== localValue || (realValue === "" && localValue === "")) {
        setLocalValue(realValue || "")
      }
    }
  }, [realValue, isLocked]) // Remover localValue da dependência para evitar loop
  
  // Verificar se o valor local é diferente do valor salvo
  // hasChanges = true se:
  // - Não está locked
  // - O valor local é diferente do valor salvo
  // - O valor local não está vazio
  const realValueNormalized = (realValue || "").trim()
  const localValueNormalized = (localValue || "").trim()
  const hasChanges = !isLocked && localValueNormalized !== realValueNormalized && localValueNormalized !== ""
  
  // CRÍTICO: Separar displayValue de realValue
  // displayValue é o que aparece (placeholder quando locked)
  // realValue é o que será salvo (nunca pode ser placeholder)
  const displayValue = isLocked ? "••••••••" : localValue
  
  const handleChange = (newValue: string) => {
    // NUNCA salvar placeholder
    if (newValue === "••••••••") return
    setLocalValue(newValue)
    onChange(newValue)  // Apenas atualiza estado local (no PluginCard)
  }
  
  const handleSave = async () => {
    if (isLocked || saving) {
      return
    }
    
    // Permitir salvar se:
    // 1. Há mudanças (valor diferente do salvo)
    // 2. Campo não existe (campo novo) e tem valor
    if (!hasChanges && exists) {
      return
    }
    if (!hasChanges && !exists && localValueNormalized === "") {
      return
    }
    
    try {
      await onSave()
    } catch (error) {
      console.error(`Error saving ${label}:`, error)
    }
    // Após salvar, o realValue será atualizado pelo parent, então localValue será sincronizado
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
            onKeyDown={(e) => {
              // Salvar ao pressionar Enter
              if (e.key === "Enter" && !isLocked && hasChanges && !saving) {
                e.preventDefault()
                handleSave()
              }
            }}
            aria-label={label}
            aria-required={isMissing}
          />
          {isLocked && (
            <Lock className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          )}
          {saving && (
            <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-primary animate-spin" />
          )}
          {saved && !saving && !hasChanges && (
            <CheckCircle2 className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-green-600" />
          )}
        </div>
        {isLocked ? (
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
        ) : (
          // Sempre mostrar botão Salvar quando não está locked
          // Desabilitar apenas se não houver mudanças E já estiver salvo (exists)
          <Button
            type="button"
            variant={hasChanges ? "default" : "outline"}
            size="sm"
            onClick={handleSave}
            disabled={saving || (!hasChanges && exists)}
            className="h-8 text-xs"
            aria-label={`Salvar ${label}`}
          >
            {saving ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <Save className="h-3 w-3 mr-1" />
            )}
            Salvar
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

