import React from "react"

type ImageProps = {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  style?: React.CSSProperties
  priority?: boolean
  onError?: React.ReactEventHandler<HTMLImageElement>
  onLoad?: React.ReactEventHandler<HTMLImageElement>
  objectFit?: string
  unoptimized?: boolean
  sizes?: string
  quality?: number
  placeholder?: string
  blurDataURL?: string
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ src, alt, width, height, fill, className, style, priority: _p, unoptimized: _u, sizes: _s, quality: _q, placeholder: _ph, blurDataURL: _b, ...rest }, ref) => {
    const imgStyle: React.CSSProperties = fill
      ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style }
      : style ?? {}

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={imgStyle}
        {...rest}
      />
    )
  }
)
Image.displayName = "Image"

export default Image
