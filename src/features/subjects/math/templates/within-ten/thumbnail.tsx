import { defaultOptions, generateExercises } from './generator'
import { defaultLayout } from './layout'
import { WithinTenWorksheet } from './worksheet'

export function WithinTenThumbnail() {
  return (
    <svg viewBox='0 0 794 730' className='block w-full' aria-hidden='true' focusable='false'>
      <foreignObject width={794} height={1123}>
        <WithinTenWorksheet
          exercises={generateExercises(defaultOptions, 42)}
          layout={defaultLayout}
          pageIndex={0}
          pageCount={1}
        />
      </foreignObject>
    </svg>
  )
}
