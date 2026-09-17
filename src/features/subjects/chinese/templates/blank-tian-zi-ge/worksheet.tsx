import { defaultPageVisibility, type PageVisibility } from '@/features/builder/page-visibility'
import { defaultPageMargins, type PageMargins } from '@/features/builder/page-margins'
import { WorksheetHeader, WorksheetFooter } from '@/features/builder/worksheet-chrome'

import { defaultLayout, getGridDimensions, type GridLayout } from './layout'

export function BlankTianZiGeWorksheet({ layout = defaultLayout, margins = defaultPageMargins, visibility = defaultPageVisibility }: { layout?: GridLayout; margins?: PageMargins; visibility?: PageVisibility }) {
  const { rows, columns, width, height } = getGridDimensions(layout, margins, visibility)
  const size = layout.cellSize
  const hasCross = ['田字格', '米字格', '回田格', '回米格'].includes(layout.gridType)
  const hasDiagonals = ['米字格', '回米格'].includes(layout.gridType)
  const hasInnerBox = ['回宫格', '回田格', '回米格'].includes(layout.gridType)

  return (
    <article
      data-worksheet-page
      aria-label={`空白${layout.gridType}，第 1 页，共 1 页`}
      className='relative mb-8 h-[297mm] w-[210mm] bg-white font-sans text-[#333] shadow-sm last:mb-0'
    >
      <WorksheetHeader />
      <svg
        data-worksheet-content
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: `${width}mm`, height: `${height}mm` }}
        className='mx-auto mt-[5mm] block overflow-visible'
        role='img'
        aria-label={`${rows} 行、每行 ${columns} 个空白${layout.gridType}`}
      >
        {Array.from({ length: rows }, (_, row) => (
          <g key={row} transform={`translate(0 ${row * (size + layout.rowGap)})`} fill='none' stroke={layout.color} strokeWidth={0.25}>
            <rect width={width} height={size} />
            {Array.from({ length: columns - 1 }, (_, column) => (
              <path key={column} d={`M ${(column + 1) * size} 0 v ${size}`} />
            ))}
            {layout.gridType !== '作文格' ? (
              <g strokeWidth={size * 0.006} strokeDasharray={`${size * 0.03} ${size * 0.03}`}>
                {Array.from({ length: columns }, (_, column) => (
                  <g key={column} transform={`translate(${column * size} 0)`}>
                    {hasCross ? <path d={`M 0 ${size / 2} H ${size} M ${size / 2} 0 V ${size}`} /> : null}
                    {hasDiagonals ? <path d={`M 0 0 L ${size} ${size} M ${size} 0 L 0 ${size}`} /> : null}
                    {hasInnerBox ? <rect x={size / 4} y={size / 4} width={size / 2} height={size / 2} /> : null}
                    {layout.gridType === '九宫格' ? (
                      <path d={`M ${size / 3} 0 V ${size} M ${size * 2 / 3} 0 V ${size} M 0 ${size / 3} H ${size} M 0 ${size * 2 / 3} H ${size}`} />
                    ) : null}
                  </g>
                ))}
              </g>
            ) : null}
          </g>
        ))}
      </svg>
      <WorksheetFooter />
    </article>
  )
}
