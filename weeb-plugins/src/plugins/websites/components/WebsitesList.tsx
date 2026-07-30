import React from "react"
import { ImageComponent } from "../../../utils/image"
import type { WebsiteEntry } from "../types"

interface WebsitesListProps {
  websites: WebsiteEntry[]
  size: "half" | "full"
  showDescription: boolean
}

/**
 * Lista compacta: favicon + título/descrição à esquerda, domínio à direita.
 * Cabe bem mais sites em menos altura que o grid.
 */
export function WebsitesList({ websites, size, showDescription }: WebsitesListProps): React.ReactElement {
  const iconSize = size === "half" ? 20 : 24

  return (
    <div className="flex flex-col gap-1.5">
      {websites.map((site) => (
        <div
          key={site.url}
          className="flex items-center gap-2 rounded-lg border border-default-border/50 px-2 py-1.5 half:py-1"
        >
          <ImageComponent
            url64={site.favicon}
            alt={`${site.domain} favicon`}
            className="flex-shrink-0 rounded-sm"
            width={iconSize}
            height={iconSize}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm half:text-xs font-semibold text-default-highlight truncate leading-tight">
              {site.title}
            </p>
            {showDescription && site.description && (
              <p className="text-[11px] half:text-[10px] text-default-muted truncate leading-tight">
                {site.description}
              </p>
            )}
          </div>
          <span className="text-[11px] half:text-[10px] text-default-muted whitespace-nowrap">{site.domain}</span>
        </div>
      ))}
    </div>
  )
}
