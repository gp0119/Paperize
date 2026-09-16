import { defaultPageMargins, type PageMargins } from '@/features/builder/page-margins'
import { WorksheetHeader, WorksheetFooter, defaultGridColor } from '@/features/builder/worksheet-chrome'

import { cellSize, getColumns, getBlockHeight, type CharacterStrokes } from './layout'

function TianZiCell({ strokes, step, tracing = false, color }: { strokes: string[]; step?: number; tracing?: boolean; color: string }) {
  return (
    <svg viewBox='0 0 100 100' className='block overflow-visible' style={{ width: `${cellSize}mm`, height: `${cellSize}mm` }} aria-hidden='true'>
      <rect width={100} height={100} fill='none' stroke={color} strokeWidth={1} />
      <path d='M 50 0 V 100 M 0 50 H 100' fill='none' stroke={color} strokeWidth={0.6} strokeDasharray='3 3' />
      <g transform='translate(8 83.5) scale(0.082 -0.082)'>
        {strokes.slice(0, step === undefined ? strokes.length : step + 1).map((stroke, index) => (
          <path key={index} d={stroke} fill={tracing ? '#cbd0d8' : step === undefined ? '#111111' : index === step ? '#f4a7a7' : '#cbd0d8'} />
        ))}
      </g>
    </svg>
  )
}

export function StrokeOrderWorksheet({ characters, pageIndex = 0, pageCount = 1, color = defaultGridColor, tracingCount = 4, margins = defaultPageMargins }: { characters: CharacterStrokes[]; pageIndex?: number; pageCount?: number; color?: string; tracingCount?: number; margins?: PageMargins }) {
  const columns = getColumns(margins)
  const gridStyle = { gridTemplateColumns: `repeat(${columns}, ${cellSize}mm)` }

  return (
    <article data-worksheet-page aria-label={`笔顺字帖，第 ${pageIndex + 1} 页，共 ${pageCount} 页`} className='relative mx-auto mb-8 h-[297mm] w-[210mm] bg-white text-[#333] shadow-sm last:mb-0'>
      <WorksheetHeader title='田字格 · 笔顺字帖' description='先看范字，再按笔顺写一写：浅红色为当前笔画，浅灰色为已写笔画，之后描红、独立书写。' />
      {characters.map((entry, entryIndex) => (
        <section key={entryIndex} aria-label={`${entry.character}，${entry.strokes.length} 画`} style={{ height: `${getBlockHeight(entry, margins)}mm` }}>
          <div className='grid auto-rows-[19mm] gap-x-[1.5mm]' style={gridStyle}>
            <div aria-label={`${entry.character}，范字`}>
              <TianZiCell strokes={entry.strokes} color={color} />
            </div>
            {entry.strokes.map((_, step) => (
              <div key={step} aria-label={`第 ${step + 1} 笔`}>
                <TianZiCell strokes={entry.strokes} step={step} color={color} />
              </div>
            ))}
          </div>
          <div aria-label='描红与独立书写练习' className='grid auto-rows-[19mm] gap-x-[1.5mm]' style={gridStyle}>
            {Array.from({ length: columns }, (_, index) => (
              <div key={`practice-${index}`} aria-label={index < tracingCount ? '描红' : '独立书写'}>
                <TianZiCell strokes={index < tracingCount ? entry.strokes : []} tracing color={color} />
              </div>
            ))}
          </div>
        </section>
      ))}
      <WorksheetFooter pageIndex={pageIndex} pageCount={pageCount} />
    </article>
  )
}
