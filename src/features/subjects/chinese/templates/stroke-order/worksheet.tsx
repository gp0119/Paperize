import { cellSize, columns, getBlockHeight, type CharacterStrokes } from './layout'

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

export function StrokeOrderWorksheet({ characters, pageIndex = 0, pageCount = 1, color = '#596273', tracingCount = 4 }: { characters: CharacterStrokes[]; pageIndex?: number; pageCount?: number; color?: string; tracingCount?: number }) {
  return (
    <article data-worksheet-page aria-label={`笔顺字帖，第 ${pageIndex + 1} 页，共 ${pageCount} 页`} className='relative mx-auto mb-8 h-[297mm] w-[210mm] bg-white px-[15mm] py-[14mm] text-[#333] shadow-sm last:mb-0'>
      <header className='h-[28mm]'>
        <div className='flex items-center justify-between'>
          <h2 className='text-[24px] font-semibold tracking-widest'>田字格 · 笔顺字帖</h2>
          <span className='text-[13px]'>姓名：________　日期：________</span>
        </div>
        <p className='mt-2 text-[12px] text-[#666]'>先看范字，再按笔顺写一写：浅红色为当前笔画，浅灰色为已写笔画，之后描红、独立书写。</p>
      </header>
      {characters.map((entry, entryIndex) => (
        <section key={entryIndex} aria-label={`${entry.character}，${entry.strokes.length} 画`} style={{ height: `${getBlockHeight(entry)}mm` }}>
          <div className='grid grid-cols-11 auto-rows-[19mm] gap-x-[1.5mm]'>
            <div aria-label={`${entry.character}，范字`}>
              <TianZiCell strokes={entry.strokes} color={color} />
            </div>
            {entry.strokes.map((_, step) => (
              <div key={step} aria-label={`第 ${step + 1} 笔`}>
                <TianZiCell strokes={entry.strokes} step={step} color={color} />
              </div>
            ))}
          </div>
          <div aria-label='描红与独立书写练习' className='grid grid-cols-11 auto-rows-[19mm] gap-x-[1.5mm]'>
            {Array.from({ length: columns }, (_, index) => (
              <div key={`practice-${index}`} aria-label={index < tracingCount ? '描红' : '独立书写'}>
                <TianZiCell strokes={index < tracingCount ? entry.strokes : []} tracing color={color} />
              </div>
            ))}
          </div>
        </section>
      ))}
      <footer className='absolute right-[15mm] bottom-[10mm] text-[12px]'>第 {pageIndex + 1} 页 [共 {pageCount} 页]</footer>
    </article>
  )
}
