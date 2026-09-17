import type { TracingOptions } from '@/features/builder/tracing-settings'
import { defaultPageMargins, type PageMargins } from '@/features/builder/page-margins'
import { WorksheetHeader, WorksheetFooter } from '@/features/builder/worksheet-chrome'

import { defaultOptions, getColumns, getBlockHeight, type CharacterStrokes } from './layout'

function TianZiCell({ strokes, step, tracing = false, options }: { strokes: string[]; step?: number; tracing?: boolean; options: TracingOptions }) {
  return (
    <svg viewBox='0 0 100 100' className='block overflow-visible' style={{ width: `${options.cellSize}mm`, height: `${options.cellSize}mm` }} aria-hidden='true'>
      <rect width={100} height={100} fill='none' stroke={options.color} strokeWidth={1} />
      <path d='M 50 0 V 100 M 0 50 H 100' fill='none' stroke={options.color} strokeWidth={0.6} strokeDasharray='3 3' />
      <g transform='translate(8 83.5) scale(0.082 -0.082)'>
        {strokes.slice(0, step === undefined ? strokes.length : step + 1).map((stroke, index) => (
          <path key={index} d={stroke} stroke={tracing ? options.tracingColor : undefined} strokeWidth={tracing ? ({ '0.8': options.tracingDashed ? 2 : 0, '1.2': 4, '2': 12 }[options.tracingWidth]) : undefined} strokeDasharray={tracing && options.tracingDashed ? '25 25' : undefined} fill={tracing ? (options.tracingDashed ? 'none' : options.tracingColor) : step === undefined ? '#111111' : index === step ? '#f4a7a7' : '#cbd0d8'} />
        ))}
      </g>
    </svg>
  )
}

export function StrokeOrderWorksheet({ characters, pageIndex = 0, pageCount = 1, options = defaultOptions, margins = defaultPageMargins }: { characters: CharacterStrokes[]; pageIndex?: number; pageCount?: number; options?: TracingOptions; margins?: PageMargins }) {
  const columns = getColumns(margins, options)
  const gridStyle = { gridAutoRows: `${options.cellSize + options.rowGap}mm`, gridTemplateColumns: `repeat(${columns}, ${options.cellSize}mm)` }

  return (
    <article data-worksheet-page aria-label={`笔顺字帖，第 ${pageIndex + 1} 页，共 ${pageCount} 页`} className='relative mb-8 h-[297mm] w-[210mm] bg-white text-[#333] shadow-sm last:mb-0'>
      <WorksheetHeader title='田字格 · 笔顺字帖' description='先看范字，再按笔顺写一写：浅红色为当前笔画，浅灰色为已写笔画，之后描红、独立书写。' />
      {characters.map((entry, entryIndex) => (
        <section key={entryIndex} aria-label={`${entry.character}，${entry.strokes.length} 画`} style={{ height: `${getBlockHeight(entry, margins, options)}mm` }}>
          <div className='grid gap-x-[1.5mm]' style={gridStyle}>
            <div aria-label={`${entry.character}，范字`}>
              <TianZiCell strokes={entry.strokes} options={options} />
            </div>
            {entry.strokes.map((_, step) => (
              <div key={step} aria-label={`第 ${step + 1} 笔`}>
                <TianZiCell strokes={entry.strokes} step={step} options={options} />
              </div>
            ))}
          </div>
          <div aria-label='描红与独立书写练习' className='grid gap-x-[1.5mm]' style={gridStyle}>
            {Array.from({ length: columns }, (_, index) => (
              <div key={`practice-${index}`} aria-label={index < options.tracingCount ? '描红' : '独立书写'}>
                <TianZiCell strokes={index < options.tracingCount ? entry.strokes : []} tracing options={options} />
              </div>
            ))}
          </div>
          {options.blankRows ? <div aria-label='空白练习行' className='grid gap-x-[1.5mm]' style={gridStyle}>{Array.from({ length: columns }, (_, index) => <TianZiCell key={index} strokes={[]} options={options} />)}</div> : null}
        </section>
      ))}
      <WorksheetFooter pageIndex={pageIndex} pageCount={pageCount} />
    </article>
  )
}
