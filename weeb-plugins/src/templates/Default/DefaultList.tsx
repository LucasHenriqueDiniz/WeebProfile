/**
 * DefaultList - Lista para estilo default
 */

import React from 'react'
import { ImageComponent } from '../../utils/image.js'
import type { ListItemProps } from '../types.js'

function ListItem({ right, center, left, image }: ListItemProps): React.ReactElement {
  const rightContent = typeof right === 'string' ? right : right
  const centerContent = typeof center === 'string' ? center : center
  const leftContent = typeof left === 'string' ? left : left
  const rightText = typeof right === 'string' ? right : String(right)
  
  return (
    <div className="flex gap-2 items-center min-h-[50px] max-h-[50px]">
      {image && (
        <div className="image-square-container-50 flex-shrink-0">
          <ImageComponent url64={image} alt={rightText} className="image-square" width={50} height={50} />
        </div>
      )}
      <div className="flex flex-col w-full h-full justify-evenly overflow-hidden">
        <div className="font-semibold text-lg text-default-highlight truncate flex items-center">
          {rightContent}
        </div>
        <div className="flex justify-between items-baseline gap-2">
          {center && (
            <div className="text-sm text-default-muted truncate flex items-center">
              {centerContent}
            </div>
          )}
          {left && (
            <div className="text-sm text-default-muted truncate w-fit ml-auto flex items-center">
              {leftContent}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface DefaultListProps {
  data: ListItemProps[]
}

export function DefaultList({ data }: DefaultListProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-1">
      {data.map((item, index) => (
        <ListItem key={`list-item-${index}`} {...item} />
      ))}
    </div>
  )
}

