import { BookOpenText, CalendarDays, CircleCheck, Timer } from 'lucide-react'

import type { Exercise } from './generator'
import { exerciseLineHeight, type WorksheetLayout } from './layout'

type WithinTenWorksheetProps = {
  exercises: readonly Exercise[]
  layout: WorksheetLayout
  pageIndex: number
  pageCount: number
}

export function WithinTenWorksheet({ exercises, layout, pageIndex, pageCount }: WithinTenWorksheetProps) {
  return (
    <article data-worksheet-page aria-label={`第 ${pageIndex + 1} 页，共 ${pageCount} 页`} className='relative mx-auto mb-8 h-[297mm] w-[210mm] bg-white px-[14mm] py-[9mm] font-sans text-[#444] shadow-sm last:mb-0'>
      <header className='flex items-center justify-between gap-3 whitespace-nowrap text-[16px]'>
        <BookOpenText aria-hidden='true' className='size-11 shrink-0 text-[#82b9e8]' strokeWidth={1.5} />
        <div className='flex items-center gap-2'>
          <CalendarDays aria-hidden='true' className='size-6 text-[#64a9f7]' />
          <span className='rounded-md bg-[#dff3ff] px-2'>日期：___月___日</span>
        </div>
        <div className='flex items-center gap-2'>
          <Timer aria-hidden='true' className='size-6 text-[#64a9f7]' />
          <span className='rounded-md bg-[#dff3ff] px-2'>用时：___分___秒</span>
        </div>
        <div className='flex items-center gap-2'>
          <CircleCheck aria-hidden='true' className='size-6 text-[#64a9f7]' />
          <span className='rounded-md bg-[#dff3ff] px-2'>正确率：___/___</span>
        </div>
      </header>
      <div className='mt-7 flex items-center text-[18px] text-[#83baff]'>
        <h2>10以内加减法</h2>
        <span aria-hidden='true' className='ml-2 flex-1 border-t border-dashed border-[#a4ceff]' />
      </div>
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
      <footer className='absolute inset-x-0 bottom-[6mm] text-center text-[18px]'>{pageIndex + 1}/{pageCount}</footer>
    </article>
  )
}
