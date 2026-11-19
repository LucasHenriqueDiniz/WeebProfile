/**
 * DefaultGrid - Grid para estilo default
 */

import React from "react"
import { ImageComponent } from "../../utils/image"
import type { GridItemProps } from "../types"
import { useItemCascade, withCascade } from "../animations"

/**
 * Cell heights: 100px, and the first cell two rows and the gap between them. Fixed, so the
 * image cannot size the row: with `h-full` on an auto-height cell the image took its own
 * aspect ratio, and a portrait first image grew the grid by 58px past the card's height
 * (measured 18/11/2026, Chrome 158, Firefox 150, WebKit 26.4).
 */
export const DEFAULT_GRID_CELL = 100
export const DEFAULT_GRID_GAP = 4
export const DEFAULT_GRID_HEIGHT = 2 * DEFAULT_GRID_CELL + DEFAULT_GRID_GAP

function GridItem({ image, title, value, subtitle, index }: GridItemProps & { index: number }): React.ReactElement {
  return (
    <div
      className={`relative overflow-hidden rounded-lg min-w-0 w-auto min-h-100 
      ${index === 0 ? "col-span-2 row-span-2" : ""}`}
      style={{ height: index === 0 ? DEFAULT_GRID_HEIGHT : DEFAULT_GRID_CELL }}
    >
      <div
        className={`w-full h-full
        ${index === 0 ? "image-square-container-200" : "image-square-container-100"}`}
      >
        <ImageComponent
          url64={image}
          alt={title}
          className="image-square"
          width={index === 0 ? 200 : 100}
          height={index === 0 ? 200 : 100}
        />
      </div>
      <div className={`favorite-overlay ${index === 0 ? "p-2" : "p-1"}`}>
        <div className={`flex flex-col ${index === 0 ? "gap-1" : "gap-0.5"}`}>
          <p className={`font-semibold text-default truncate line-clamp-1 ${index === 0 ? "text-xs" : "text-[10px]"}`}>
            {title}
          </p>
          {subtitle && (
            <p className={`text-default line-clamp-1 ${index === 0 ? "text-xs" : "text-[10px]"}`}>{subtitle}</p>
          )}
          <p className={`text-default line-clamp-1 ${index === 0 ? "text-xs" : "text-[10px]"}`}>{value}</p>
        </div>
      </div>
    </div>
  )
}

interface DefaultGridProps {
  data: GridItemProps[]
  size?: "half" | "full"
}

export function DefaultGrid({ data, size = "full" }: DefaultGridProps): React.ReactElement {
  // Limitar dados baseado no tamanho
  let limitedData = data
  if (data.length > 5 && size === "half") {
    limitedData = data.slice(0, 5)
  } else if (data.length > 13 && size === "full") {
    limitedData = data.slice(0, 13)
  }

  const cascade = useItemCascade(limitedData.length)
  return (
    <div className={withCascade("grid grid-cols-8 gap-1 half:grid-cols-4 grid-rows-2", cascade)} style={cascade?.style}>
      {limitedData.map((item, index) => (
        <GridItem key={`grid-item-${index}`} index={index} {...item} />
      ))}
    </div>
  )
}
