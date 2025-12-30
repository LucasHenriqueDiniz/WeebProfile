"use client"

import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface EmptyStateProps {
  query: string
  category: string
  onlyEnabled: boolean
  onClearFilters: () => void
}

export function EmptyState({ query, category, onlyEnabled, onClearFilters }: EmptyStateProps) {
  const hasFilters = query || category !== "all" || onlyEnabled

  return (
    <div className="text-center py-12 px-4">
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Nenhum plugin encontrado
          </h3>
          {hasFilters ? (
            <>
              <p className="text-sm text-muted-foreground">
                Não encontramos plugins que correspondam aos seus filtros atuais.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {query && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm">
                    <span className="text-muted-foreground">Busca:</span>
                    <span className="font-medium">"{query}"</span>
                  </div>
                )}
                {category !== "all" && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm">
                    <span className="text-muted-foreground">Categoria:</span>
                    <span className="font-medium capitalize">{category}</span>
                  </div>
                )}
                {onlyEnabled && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm">
                    <span className="font-medium">Apenas habilitados</span>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="mt-4"
              >
                <X className="h-4 w-4 mr-2" />
                Limpar todos os filtros
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Não há plugins disponíveis no momento.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}





