import React from "react"

interface foreignObject {
  children: JSX.Element
  x?: number
  y?: number
}

function ForeignObject({ children, x = 0, y = 0 }: foreignObject): JSX.Element {
  return (
    <foreignObject width='100%' height='100%' x={x} y={y}>
      {/* @ts-expect-error expected error in xmlns */}
      <div xmlns='http://www.w3.org/1999/xhtml' xmlnsXlink='http://www.w3.org/1999/xlink' className='items-wrapper'>
        {children}
      </div>
    </foreignObject>
  )
}

export default ForeignObject
