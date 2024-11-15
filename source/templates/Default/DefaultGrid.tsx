import React from "react"
import logger from "source/helpers/logger"
import { randomString } from "source/helpers/string"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import ImageComponent from "source/templates/ImageComponent"
import { GridItemProps } from "../types"

function GridItem({ image, title, value, subtitle, index }: GridItemProps & { index: number }): JSX.Element {
  return (
    <div
      className={`relative overflow-hidden rounded-lg min-w-0 w-auto min-h-100 
      ${index === 0 ? "col-span-2 row-span-2" : ""}`}
    >
      <div
        className={` 
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
      <div className="favorite-overlay">
        <div className="flex flex-col">
          <p className="font-semibold text-default truncate text-xs">{title}</p>
          {subtitle && <p className="text-xs text-default">{subtitle}</p>}
          <p className="text-xs text-default">{value}</p>
        </div>
      </div>
    </div>
  )
}

interface DefaultGridProps {
  data: GridItemProps[]
}

function DefaultGrid({ data }: DefaultGridProps): JSX.Element {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const size = env.size

  if (data.length > 5 && size === "half") {
    data = data.slice(0, 5)
  } else if (data.length > 13 && size === "full") {
    logger({
      message: `Limiting data to 13 items in DefaultGrid component`,
      level: "warn",
      __filename,
    })
    data = data.slice(0, 13)
  }

  return (
    <div className="grid grid-cols-8 gap-1 half-mode:grid-cols-4 grid-rows-2">
      {data.map((item, index) => (
        <GridItem key={randomString()} index={index} {...item} />
      ))}
    </div>
  )
}

export default DefaultGrid
