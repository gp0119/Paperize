import localFont from 'next/font/local'

import type { PageMargins } from '@/features/builder/page-margins'
import type { PageVisibility } from '@/features/builder/page-visibility'
import { WorksheetFooter, WorksheetHeader } from '@/features/builder/worksheet-chrome'
import { defaultContent, defaultOptions, getLayout, numberPracticeMargins, numberPracticeVisibility, strokeWidth, type NumberPracticeOptions } from './layout'

const digitsFont = localFont({ src: './digits.woff', weight: '400', adjustFontFallback: false })

type NumberPracticeWorksheetProps = {
  margins?: PageMargins
  visibility?: PageVisibility
  options?: NumberPracticeOptions
  lines?: string[]
  pageIndex?: number
  pageCount?: number
}

export function NumberPracticeWorksheet({ margins = numberPracticeMargins, visibility = numberPracticeVisibility, options = defaultOptions, lines = defaultContent.split('\n'), pageIndex = 0, pageCount = 1 }: NumberPracticeWorksheetProps) {
  const { width, gridWidth, columns, cellWidth, rows } = getLayout(options, margins, visibility)
  const { rowHeight, rowGap } = options
  const columnStep = options.blankColumns ? 2 : 1
  const filledColumns = Math.min(options.tracingCount, Math.ceil(columns / columnStep))
  const height = rows * (rowHeight + rowGap) - rowGap + strokeWidth
  const fontSize = rowHeight * options.fontSize / 100

  return (
    <article
      data-worksheet-page
      aria-label={`数字练习，第 ${pageIndex + 1} 页，共 ${pageCount} 页`}
      className='relative mb-8 h-[297mm] w-[210mm] bg-white shadow-sm last:mb-0'
    >
      <WorksheetHeader />
      <svg
        data-worksheet-content
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: `${width}mm`, height: `${height}mm` }}
        className='mt-[5mm] block'
        role='img'
        aria-label={`${rows} 行数字练习，浅色数字描红，空格独立练习`}
      >
        {Array.from({ length: rows }, (_, row) => {
          const digits = lines[row] ?? ''
          return (
            <g key={row} transform={`translate(${strokeWidth / 2} ${row * (rowHeight + rowGap) + strokeWidth / 2})`}>
              <path
                d={`M 0 ${rowHeight / 2} H ${gridWidth} ${Array.from({ length: columns - 1 }, (_, column) => `M ${(column + 1) * cellWidth} 0 V ${rowHeight}`).join(' ')}`}
                fill='none'
                stroke={options.gridColor} strokeOpacity={0.65}
                strokeWidth={strokeWidth}
                strokeDasharray='0.5 0.6'
              />
              <rect width={gridWidth} height={rowHeight} fill='none' stroke={options.gridColor} strokeWidth={strokeWidth} />
              <g className={digitsFont.className} style={{ fontWeight: options.bold ? 700 : 400 }} fontSize={fontSize} textAnchor='middle'>
                {Array.from({ length: digits ? filledColumns : 0 }, (_, column) => (
                  <text key={column} x={(column * columnStep + 0.5) * cellWidth - fontSize * 0.075} y={rowHeight / 2 + fontSize * 0.32 + rowHeight * options.verticalOffset / 100} fill={options.highlightFirst && column < digits.length ? '#111111' : options.tracingDashed ? 'none' : options.tracingColor}
                    stroke={options.tracingDashed && !(options.highlightFirst && column < digits.length) ? options.tracingColor : undefined}
                    strokeWidth={options.bold ? 0.3 : 0.15} strokeDasharray='0.5 0.5'>
                    {digits[column % digits.length]}
                  </text>
                ))}
              </g>
            </g>
          )
        })}
      </svg>
      <WorksheetFooter pageIndex={pageIndex} pageCount={pageCount} />
    </article>
  )
}
