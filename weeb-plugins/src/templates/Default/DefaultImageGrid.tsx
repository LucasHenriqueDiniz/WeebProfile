/**
 * DefaultImageGrid - Grid de imagens para estilo default
 */

import React from 'react'
import { ImageComponent } from '../../utils/image.js'
import type { GridItemProps } from '../types.js'

function GridItem({ title, image, value }: GridItemProps): React.ReactElement {
  return (
    <div className="relative overflow-hidden rounded-lg min-w-0 w-auto min-h-100">
      <div className="image-square-container-100">
        <ImageComponent url64={image} alt={title} className="image-square" width={100} height={100} />
      </div>
      <div className="favorite-overlay">
        <div className="flex flex-col">
          <p className="font-semibold text-default truncate text-xs">{title}</p>
          <p className="text-xs text-default leading-none">{value}</p>
        </div>
      </div>
    </div>
  )
}

interface DefaultImageGridProps {
  data: GridItemProps[]
}

export function DefaultImageGrid({ data }: DefaultImageGridProps): React.ReactElement {
  // Limitar a múltiplos de 4
  let limitedData = data
  if (data.length % 4 !== 0) {
    limitedData = data.slice(0, Math.floor(data.length / 4) * 4)
  }

  return (
    <div className="grid grid-cols-8 gap-1 half:grid-cols-4">
      {limitedData.map((item, index) => (
        <GridItem key={`image-grid-item-${index}`} {...item} />
      ))}
    </div>
  )
}

