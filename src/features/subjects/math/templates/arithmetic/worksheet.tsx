import { WorksheetHeader, WorksheetFooter } from '@/features/builder/worksheet-chrome'

import type { Exercise } from './generator'
import { exerciseLineHeight, type WorksheetLayout } from './layout'

type ArithmeticWorksheetProps = {
  maximum: 10 | 20
  exercises: readonly Exercise[]
  layout: WorksheetLayout
  pageIndex: number
  pageCount: number
}

export function ArithmeticWorksheet({ maximum, exercises, layout, pageIndex, pageCount }: ArithmeticWorksheetProps) {
  return (
    <article data-worksheet-page aria-label={`第 ${pageIndex + 1} 页，共 ${pageCount} 页`} className='relative mx-auto mb-8 h-[297mm] w-[210mm] bg-white font-sans text-[#333] shadow-sm last:mb-0'>
      <WorksheetHeader title={`${maximum} 以内加减法`} description='用时：____ 分 ____ 秒　　正确率：____ / ____' />
      <div
        className='mt-3 grid'
        style={{
          gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
          gridAutoRows: `${layout.fontSize * exerciseLineHeight}px`,
          rowGap: `${layout.rowGap}mm`,
          columnGap: `${layout.columnGap}mm`,
          fontSize: `${layout.fontSize}px`,
          lineHeight: exerciseLineHeight,
        }}
      >
        {exercises.map((exercise, index) => (
          <div key={index} className='flex items-center whitespace-nowrap tracking-[0.06em] tabular-nums'>
            {exercise.left} {exercise.operator} {exercise.right} =
          </div>
        ))}
      </div>
      <WorksheetFooter pageIndex={pageIndex} pageCount={pageCount} />
    </article>
  )
}
