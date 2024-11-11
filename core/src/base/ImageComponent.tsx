import React from "react"
import isNodeEnvironment from "source/plugins/@utils/isNodeEnv"

interface img64Props {
  url64: string | undefined
  alt: string
  className?: string
  width?: number
  height?: number
  defaultType?: string
}

function Img64({ url64, alt, className, width = 70, height = 110 }: img64Props): JSX.Element {
  const isNodeEnv = isNodeEnvironment()
  const devMode = true

  const getDefaultImg = () => {
    return devMode ? `https://placekitten.com/${width}/${height}` : "default_base64_string_here"
  }

  if (!url64) {
    const defaultUrl64 = getDefaultImg()
    return (
      <img
        src={defaultUrl64}
        alt={alt}
        data-name={alt}
        {...(className && { className })}
        width={width}
        height={height}
      />
    )
  }

  return (
    <img
      src={devMode ? url64 : `${isNodeEnv ? "data:image/jpeg;base64," : ""}${url64}`}
      alt={alt}
      data-name={alt}
      {...(className && { className })}
      width={width}
      height={height}
    />
  )
}

export default Img64
