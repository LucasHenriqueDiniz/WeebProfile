import React from "react"
import { ImageComponent } from "../../../utils/image"
import type { WebsiteEntry } from "../types"

interface WebsitesGridProps {
  websites: WebsiteEntry[]
  size: "half" | "full"
  showThumbnail: boolean
  showDescription: boolean
}

/**
 * Grid de cards: thumbnail grande no topo, título e domínio abaixo.
 * 2 colunas no half, 4 no full — precisa bater com calculateHeight.
 */
export function WebsitesGrid({
  websites,
  size,
  showThumbnail,
  showDescription,
}: WebsitesGridProps): React.ReactElement {
  const thumbHeight = size === "half" ? 72 : 88

  return (
    <div className="grid grid-cols-4 gap-2.5 half:grid-cols-2">
      {websites.map((site) => (
        <div
          key={site.url}
          className="flex flex-col overflow-hidden rounded-lg border border-default-border/60 bg-default-muted/5"
        >
          {showThumbnail && (
            <div className="w-full overflow-hidden bg-default-muted/10" style={{ height: `${thumbHeight}px` }}>
              <ImageComponent
                url64={site.thumbnail}
                alt={site.title}
                className="w-full h-full object-cover"
                width={size === "half" ? 190 : 195}
                height={thumbHeight}
              />
            </div>
          )}
          <div className="flex flex-col gap-0.5 px-2 py-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              {!showThumbnail && (
                <ImageComponent
                  url64={site.favicon}
                  alt={`${site.domain} favicon`}
                  className="w-4 h-4 flex-shrink-0 rounded-sm"
                  width={16}
                  height={16}
                />
              )}
              <p className="text-sm half:text-xs font-semibold text-default-highlight truncate leading-tight">
                {site.title}
              </p>
            </div>
            {showDescription && site.description && (
              <p className="text-[11px] half:text-[10px] text-default-text truncate leading-tight">
                {site.description}
              </p>
            )}
            <p className="text-[11px] half:text-[10px] text-default-muted truncate leading-tight">{site.domain}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
