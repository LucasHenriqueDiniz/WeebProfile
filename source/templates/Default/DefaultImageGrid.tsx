import randomString from "core/utils/randomString"
import Img64 from "core/src/base/ImageComponent"
import { GridItemProps } from "../types"
import React from "react"

function GridItem({ title, image, value }: GridItemProps): JSX.Element {
  return (
    <div className='relative overflow-hidden radius-8 min-w-200 min-h-200 half:min-w-0 half:w-auto half:min-h-100'>
      <Img64 url64={image} alt={title} defaultType='lastfm' className='image-center-full' />
      <div className='fav-overlay'>
        <div className='flex-d'>
          <p className='md-text-bold text-nowrap text-overflow half:sm-text'>{title}</p>
          <p className='sm-text text-slate line-100 half:xs-text'>{value}</p>
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
    <div className='image-grid-container'>
      {data.map((item) => (
        <GridItem key={randomString()} {...item} />
      ))}
    </div>
  )
}

export default ImageGrid
