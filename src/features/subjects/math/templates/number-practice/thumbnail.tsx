import { NumberPracticeWorksheet } from './worksheet'

export function NumberPracticeThumbnail() {
  return (
    <svg viewBox='0 0 794 730' className='block w-full' aria-hidden='true' focusable='false'>
      <foreignObject width={794} height={1123}>
        <div
          data-hide-header='true'
          data-hide-footer='true'
          style={{ '--page-margin-top': '5mm', '--page-margin-right': '5mm', '--page-margin-bottom': '5mm', '--page-margin-left': '5mm' } as React.CSSProperties}
        >
          <NumberPracticeWorksheet />
        </div>
      </foreignObject>
    </svg>
  )
}
