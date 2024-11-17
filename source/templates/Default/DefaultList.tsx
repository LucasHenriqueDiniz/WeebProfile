import React from "react"
import ImageComponent from "source/templates/ImageComponent"
import { ListItemProps } from "../types"
import { randomString } from "source/helpers/string"

function ListItem({ right, center, left, image }: ListItemProps): JSX.Element {
  return (
    <div className="flex gap-2 items-center min-h-[50px] max-h-[50px]">
      <div className="image-square-container-50">
        <ImageComponent url64={image} alt={right} className="image-square" width={50} height={50} />
      </div>
      <div className="flex flex-col w-full h-full justify-evenly overflow-hidden">
        <p className="font-semibold text-lg text-default-highlight truncate">{right}</p>
        <div className="flex justify-between items-baseline">
          {center && <p className="text-sm text-default-muted truncate">{center}</p>}
          <p className="text-sm text-default-muted truncate w-fit">{left}</p>
        </div>
      </div>
    </div>
  )
}

function List({ data }: { data: ListItemProps[] }): JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      {data.map((item) => (
        <ListItem key={randomString()} {...item} />
      ))}
    </div>
  )
}

export default List
