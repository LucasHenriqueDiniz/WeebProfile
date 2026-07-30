import React from "react"
import { ImageComponent } from "../../../utils/image"
import { WebsitesList } from "./WebsitesList"
import type { WebsiteEntry } from "../types"

interface WebsitesFeaturedProps {
  websites: WebsiteEntry[]
  size: "half" | "full"
  showThumbnail: boolean
  showDescription: boolean
}

/**
 * O primeiro site em destaque, com thumbnail grande; os demais na lista compacta.
 */
export function WebsitesFeatured({
  websites,
  size,
  showThumbnail,
  showDescription,
}: WebsitesFeaturedProps): React.ReactElement {
  const [featured, ...rest] = websites
  if (!featured) return <></>

  const heroHeight = size === "half" ? 120 : 140

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-xl border border-default-highlight/40">
        {showThumbnail && (
          <div className="w-full overflow-hidden bg-default-muted/10" style={{ height: `${heroHeight}px` }}>
            <ImageComponent
              url64={featured.thumbnail}
              alt={featured.title}
              className="w-full h-full object-cover"
              width={size === "half" ? 400 : 815}
              height={heroHeight}
            />
          </div>
        )}
        <div className="flex items-center gap-2 px-2.5 py-2">
          <ImageComponent
            url64={featured.favicon}
            alt={`${featured.domain} favicon`}
            className="flex-shrink-0 rounded-sm"
            width={24}
            height={24}
          />
          <div className="flex-1 min-w-0">
            <p className="text-base half:text-sm font-semibold text-default-highlight truncate leading-tight">
              {featured.title}
            </p>
            {showDescription && featured.description && (
              <p className="text-xs half:text-[11px] text-default-text truncate leading-tight">
                {featured.description}
              </p>
            )}
          </div>
          <span className="text-[11px] half:text-[10px] text-default-muted whitespace-nowrap">{featured.domain}</span>
        </div>
      </div>

      {rest.length > 0 && <WebsitesList websites={rest} size={size} showDescription={showDescription} />}
    </div>
  )
}
