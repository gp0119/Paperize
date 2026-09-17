import { defaultPageVisibility, getReservedHeight, type PageVisibility } from '@/features/builder/page-visibility'
import { defaultPageMargins, getContentWidth, getContentHeight, type PageMargins } from '@/features/builder/page-margins'

import { WorksheetHeader, WorksheetFooter } from '@/features/builder/worksheet-chrome'

export const defaultOptions = { cellSize: 12, rowGap: 6, color: '#dedede', baselineColor: '#f6d9ce' }
const lineStrokeWidth = 0.15

export function BlankFourLineWorksheet({ margins = defaultPageMargins, visibility = defaultPageVisibility, options = defaultOptions }: { margins?: PageMargins; visibility?: PageVisibility; options?: typeof defaultOptions }) {
  const lineSpacing = options.cellSize / 3
  const groupGap = options.rowGap
  const svgWidth = getContentWidth(margins)
  const worksheetWidth = svgWidth - lineStrokeWidth
  const groupCount = Math.floor((getContentHeight(margins) - getReservedHeight(visibility, false, 5) + groupGap - lineStrokeWidth) / (lineSpacing * 3 + groupGap))
  const worksheetHeight = groupCount * (lineSpacing * 3 + groupGap) - groupGap + lineStrokeWidth
  return (
    <article
      data-worksheet-page
      aria-label='空白英语四线三格练习纸，第 1 页，共 1 页'
      className='relative mb-8 h-[297mm] w-[210mm] bg-white shadow-sm last:mb-0'
    >
      <WorksheetHeader />
      <svg
        data-worksheet-content
        viewBox={`-${lineStrokeWidth / 2} 0 ${svgWidth} ${worksheetHeight}`}
        style={{ width: `${svgWidth}mm`, height: `${worksheetHeight}mm` }}
        className='mt-[5mm] block'
        role='img'
        aria-label={`${groupCount} 组空白英语四线三格，每组 4 条等距横线`}
      >
        {Array.from({ length: groupCount }, (_, group) => {
          const groupOffset = group * ((lineSpacing * 3) + groupGap) + lineStrokeWidth / 2

          return (
            <g key={group} fill='none' stroke={options.color} strokeWidth={lineStrokeWidth}>
              {Array.from({ length: 4 }, (_, line) => (
                <path
                  key={line}
                  d={`M 0 ${groupOffset + line * lineSpacing} H ${worksheetWidth}`}
                  stroke={line === 2 ? options.baselineColor : undefined}
                />
              ))}
            </g>
          )
        })}
      </svg>
      <WorksheetFooter />
    </article>
  )
}
