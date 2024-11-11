import React from "react"
import Img64 from "core/src/base/ImageComponent"
import { ListItemProps } from "../types"
import { randomString } from "source/helpers/string"

function ListItem({ right, center, left, image }: ListItemProps): JSX.Element {
  return (
    <div className="flex gap-4 items-center h-40">
      <div className="music-image-container">
        <Img64 url64={image} alt={right} defaultType="lastfm" className="music-image" />
      </div>
      <div className="flex-d w100 h100 justify-evenly overflow-hidden">
        <p className="md-text-bold text-overflow text-nowrap">{right}</p>
        <div className="flex justify-between items-baseline">
          {center && <p className="md-2-text text-gray line-100 text-nowrap text-overflow">{center}</p>}
          <p className="sm-text text-gray line-100 text-nowrap w-fit">{left}</p>
        </div>
      </div>
    </div>
  )
}

function List({ data }: { data: ListItemProps[] }): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      {data.map((item) => (
        <ListItem key={randomString()} {...item} />
      ))}
    </div>
  )
}

export default List
