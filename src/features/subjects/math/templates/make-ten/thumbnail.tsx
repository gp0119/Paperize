import { defaultOptions, generateExercises } from './generator'
import { defaultLayout, getPageCapacity } from './layout'
import { MakeTenWorksheet } from './worksheet'

export function MakeTenThumbnail() {
  const exercises = generateExercises(defaultOptions, 42)
  const pageCapacity = getPageCapacity(defaultLayout)

  return (
    <svg viewBox='0 0 794 730' className='block w-full' aria-hidden='true' focusable='false'>
      <foreignObject width={794} height={1123}>
        <MakeTenWorksheet
          exercises={exercises.slice(0, pageCapacity)}
          layout={defaultLayout}
          pageIndex={0}
          pageCount={Math.ceil(exercises.length / pageCapacity)}
        />
      </foreignObject>
    </svg>
  )
}
