import { sampleCharacters } from './sample'
import { StrokeOrderWorksheet } from './worksheet'

export function StrokeOrderThumbnail() {
  return (
    <svg viewBox='0 0 794 730' className='block w-full' aria-hidden='true' focusable='false'>
      <foreignObject width={794} height={1123}>
        <StrokeOrderWorksheet characters={sampleCharacters} />
      </foreignObject>
    </svg>
  )
}
