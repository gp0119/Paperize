import { PenControlWorksheet } from './worksheet'

export function PenControlThumbnail() {
  return (
    <svg viewBox='0 0 794 730' className='block w-full' aria-hidden='true' focusable='false'>
      <foreignObject width={794} height={1123}>
        <div data-hide-header='true' data-hide-title='true' data-hide-footer='true'><PenControlWorksheet /></div>
      </foreignObject>
    </svg>
  )
}
