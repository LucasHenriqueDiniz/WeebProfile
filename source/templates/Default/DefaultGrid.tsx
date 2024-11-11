import React from "react"
import { randomString } from "source/helpers/string"
import Img64 from "core/src/base/ImageComponent"
import { GridItemProps } from "../types"

function GridItem({ image, title, value, subtitle, index }: GridItemProps & { index: number }): JSX.Element {
  return (
    <div className={`relative overflow-hidden rounded-lg ${index === 0 ? "col-span-2 row-span-2" : ""}`}>
      <Img64 url64={image} alt={title} defaultType="lastfm" className="w-full h-full object-cover object-center" />
      <div className="absolute bottom-0 left-0 w-full bg-black/65 text-white px-1.5 py-1">
        <div className="flex flex-col">
          <p className="text-base font-bold truncate half-mode:text-sm">{title}</p>
          {subtitle && <p className="text-xs text-gray-300 leading-none">{subtitle}</p>}
          <p className="text-xs text-gray-300 leading-none">{value}</p>
        </div>
      </div>
    </div>
  )
}

interface DefaultGridProps {
  data: GridItemProps[]
}

function DefaultGrid({ data }: DefaultGridProps): JSX.Element {
  if (data.length > 5) {
    data = data.slice(0, 5)
  }

  return (
    <div className="grid grid-cols-3 gap-2 auto-rows-fr">
      {data.map((item, index) => (
        <GridItem key={randomString()} index={index} {...item} />
      ))}
    </div>
  )
}

export default DefaultGrid
