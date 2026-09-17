import { defaultPageMargins, type PageMargins } from '@/features/builder/page-margins'
import { WorksheetHeader, WorksheetFooter } from '@/features/builder/worksheet-chrome'

import type { Exercise } from './generator'
import { columnGap, diagramHeight, diagramWidth, getExerciseHeight, type WorksheetLayout } from '../make-ten/layout'

export function BreakTenDiagram({ exercise, showAnswers = false }: { exercise: Exercise; showAnswers?: boolean }) {
  const { left, right } = exercise
  const units = left - 10
  const remainder = 10 - right

  return (
    <svg
      viewBox={`0 0 ${diagramWidth} ${diagramHeight}`}
      className='block h-full w-full text-black'
      role='img'
      aria-label={`${left} 减 ${right}，把 ${left} 拆成 10 和 ${showAnswers ? units : '几'}${showAnswers ? `，10 减 ${right} 等于 ${remainder}，${remainder} 加 ${units} 等于 ${left - right}` : '，先用 10 减，再加剩下的数，填写分解数和结果'}`}
    >
      <g fill='currentColor' fontFamily='Arial, sans-serif' fontSize='28' textAnchor='middle'>
        <text x='76' y='43'>{left}</text>
        <text x='132' y='43'>−</text>
        <text x='188' y='43'>{right}</text>
        <text x='244' y='43'>=</text>
        <text x='151' y='190'>−</text>
      </g>
      <g fill='none' stroke='currentColor' strokeWidth='1.8'>
        <rect x='290' y='10' width='44' height='44' />
        <path d='M 56 72 L 50 96 M 96 72 L 102 96' />
        <rect x='16' y='120' width='44' height='44' />
        <rect x='92' y='120' width='44' height='44' />
        <path d='M 114 176 V 202 H 188 V 72' />
        <rect x='129' y='218' width='44' height='44' />
      </g>
      {showAnswers ? (
        <g fill='currentColor' fontFamily='Arial, sans-serif' fontSize='28' textAnchor='middle'>
          <text x='312' y='43'>{left - right}</text>
          <text x='38' y='152'>{units}</text>
          <text x='114' y='152'>10</text>
          <text x='151' y='250'>{remainder}</text>
        </g>
      ) : null}
    </svg>
  )
}

export function BreakTenWorksheet({ exercises, layout, margins = defaultPageMargins, showAnswers = false, pageIndex, pageCount }: {
  exercises: readonly Exercise[]
  layout: WorksheetLayout
  margins?: PageMargins
  showAnswers?: boolean
  pageIndex: number
  pageCount: number
}) {
  return (
    <article data-worksheet-page aria-label={`第 ${pageIndex + 1} 页，共 ${pageCount} 页`} className='relative mb-8 h-[297mm] w-[210mm] bg-white font-sans text-[#333] shadow-sm last:mb-0'>
      <WorksheetHeader title={`破十法${showAnswers ? '（答案）' : ''}`} description='把十几拆成 10 和几，先用 10 减，再加剩下的数。' />
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
          <BreakTenDiagram key={index} exercise={exercise} showAnswers={showAnswers} />
        ))}
      </div>
      <WorksheetFooter pageIndex={pageIndex} pageCount={pageCount} />
    </article>
  )
}
