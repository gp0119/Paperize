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

export function BreakTenWorksheet({ exercises, layout, showAnswers = false, pageIndex, pageCount }: {
  exercises: readonly Exercise[]
  layout: WorksheetLayout
  showAnswers?: boolean
  pageIndex: number
  pageCount: number
}) {
  return (
    <article data-worksheet-page aria-label={`第 ${pageIndex + 1} 页，共 ${pageCount} 页`} className='relative mx-auto mb-8 h-[297mm] w-[210mm] bg-white px-[14mm] py-[9mm] font-sans text-black shadow-sm last:mb-0'>
      <header className='flex items-center justify-between text-[16px]'>
        <span>姓名：____________</span>
        <span>日期：____月____日</span>
      </header>
      <h2 className='mt-6 text-center text-[24px] font-medium'>破十法{showAnswers ? '（答案）' : ''}</h2>
      <p className='mt-2 text-center text-[14px]'>把十几拆成 10 和几，先用 10 减，再加剩下的数。</p>
      <div
        className='mt-5 grid'
        style={{
          gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
          gridAutoRows: `${getExerciseHeight(layout)}mm`,
          rowGap: `${layout.rowGap}mm`,
          columnGap: `${columnGap}mm`,
        }}
      >
        {exercises.map((exercise, index) => (
          <BreakTenDiagram key={index} exercise={exercise} showAnswers={showAnswers} />
        ))}
      </div>
      <footer className='absolute inset-x-0 bottom-[6mm] text-center text-[16px]'>{pageIndex + 1}/{pageCount}</footer>
    </article>
  )
}
