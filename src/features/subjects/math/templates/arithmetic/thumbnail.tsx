import { defaultOptions, generateExercises } from './generator'
import { defaultLayout } from './layout'
import { ArithmeticWorksheet } from './worksheet'

export function ArithmeticThumbnail({ maximum }: { maximum: 10 | 20 }) {
  return (
    <svg viewBox='0 0 794 730' className='block w-full' aria-hidden='true' focusable='false'>
      <foreignObject width={794} height={1123}>
        <ArithmeticWorksheet
          maximum={maximum}
          exercises={generateExercises(defaultOptions, 42, maximum)}
          layout={defaultLayout}
          pageIndex={0}
          pageCount={1}
        />
      </foreignObject>
    </svg>
  )
}
