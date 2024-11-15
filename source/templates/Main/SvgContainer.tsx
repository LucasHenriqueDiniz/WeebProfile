import getSvgWidth from "core/utils/getSvgWidth"
import React, { ReactNode } from "react"
import PluginStyles from "source/styles/PluginStyles"

interface SvgContainerProps {
  children: JSX.Element | ReactNode
  size: string
  height: number | string
  style: string
  asDiv?: boolean
  defs?: ReactNode
}

function SvgContainer({ children, size, height, style, asDiv, defs }: SvgContainerProps) {
  const containerClass = `${size} ${style} flex flex-col relative`

  if (asDiv) {
    return (
      <div className={containerClass} style={{ width: getSvgWidth(size === "half") }} id="svg-main">
        {defs}
        <PluginStyles style={style}>{children}</PluginStyles>
      </div>
    )
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="svg-main"
      width={getSvgWidth(size === "half")}
      height={height}
      className={containerClass}
    >
      {defs}
      <foreignObject width="100%" height="100%">
        <div
          // @ts-expect-error -- xmlns attributes required for SVG foreignObject
          xmlns="http://www.w3.org/1999/xhtml"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <PluginStyles style={style}>{children}</PluginStyles>
        </div>
      </foreignObject>
    </svg>
  )
}

export default SvgContainer
