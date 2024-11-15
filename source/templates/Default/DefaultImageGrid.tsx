import { randomString } from "source/helpers/string"
import ImageComponent from "source/templates/ImageComponent"
import { GridItemProps } from "../types"
import React from "react"

function GridItem({ title, image, value }: GridItemProps): JSX.Element {
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

interface ImageGridProps {
  data: GridItemProps[]
}

function ImageGrid({ data }: ImageGridProps): JSX.Element {
  if (data.length % 4 !== 0) {
    data = data.slice(0, 4)
  }

  return (
    <div className="grid grid-cols-8 gap-1 half-mode:grid-cols-4">
      {data.map((item) => (
        <GridItem key={randomString()} {...item} />
      ))}
    </div>
  )
}

export default ImageGrid
