import { defaultPageMargins, type PageMargins } from '@/features/builder/page-margins'
import { WorksheetHeader, WorksheetFooter } from '@/features/builder/worksheet-chrome'

import type { Exercise } from './generator'
import { columnGap, diagramHeight, diagramWidth, getExerciseHeight, type WorksheetLayout } from './layout'

export function MakeTenDiagram({ exercise, showAnswers = false }: { exercise: Exercise; showAnswers?: boolean }) {
  const { left, right } = exercise
  const complement = 10 - left

  return (
    <svg
      viewBox={`0 0 ${diagramWidth} ${diagramHeight}`}
      className='block h-full w-full text-black'
      role='img'
      aria-label={`${left} 加 ${right}${showAnswers ? ` 等于 ${left + right}，把 ${right} 拆成 ${complement} 和 ${right - complement}，${left} 加 ${complement} 凑成 10` : `，把 ${right} 拆成两部分，与 ${left} 凑成 10，填写分解数和结果`}`}
    >
      <g fill='currentColor' fontFamily='Arial, sans-serif' fontSize='28' textAnchor='middle'>
        <text x='24' y='43'>{left}</text>
        <text x='82' y='43'>+</text>
        <text x='140' y='43'>{right}</text>
        <text x='198' y='43'>=</text>
        <text x='62' y='255'>10</text>
      </g>
      <g fill='none' stroke='currentColor' strokeWidth='1.8'>
        <rect x='244' y='10' width='80' height='44' />
        <path d='M 119 72 L 112 98 M 161 72 L 168 98' />
        <rect x='80' y='125' width='44' height='44' />
        <rect x='168' y='125' width='44' height='44' />
        <path d='M 24 72 V 211 H 102 V 182' />
      </g>
      {showAnswers ? (
        <g fill='currentColor' fontFamily='Arial, sans-serif' fontSize='28' textAnchor='middle'>
          <text x='284' y='43'>{left + right}</text>
          <text x='102' y='157'>{complement}</text>
          <text x='190' y='157'>{right - complement}</text>
        </g>
      ) : null}
    </svg>
  )
}

export function MakeTenWorksheet({ exercises, layout, margins = defaultPageMargins, showAnswers = false, pageIndex, pageCount }: {
  exercises: readonly Exercise[]
  layout: WorksheetLayout
  margins?: PageMargins
  showAnswers?: boolean
  pageIndex: number
  pageCount: number
}) {
  return (
    <article data-worksheet-page aria-label={`第 ${pageIndex + 1} 页，共 ${pageCount} 页`} className='relative mb-8 h-[297mm] w-[210mm] bg-white font-sans text-[#333] shadow-sm last:mb-0'>
      <WorksheetHeader title={`凑十法${showAnswers ? '（答案）' : ''}`} description='拆第二个数，先凑成 10，再加剩下的数。' />
      <div
        data-worksheet-content
        className='mt-5 grid'
        style={{
          gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
          gridAutoRows: `${getExerciseHeight(layout, margins)}mm`,
          rowGap: `${layout.rowGap}mm`,
          columnGap: `${columnGap}mm`,
        }}
      >
        {exercises.map((exercise, index) => (
          <MakeTenDiagram key={index} exercise={exercise} showAnswers={showAnswers} />
        ))}
      </div>
      <WorksheetFooter pageIndex={pageIndex} pageCount={pageCount} />
    </article>
  )
}
