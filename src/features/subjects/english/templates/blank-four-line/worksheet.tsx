import { defaultPageMargins, getContentWidth, getContentHeight, type PageMargins } from '@/features/builder/page-margins'

import { WorksheetHeader, WorksheetFooter } from '@/features/builder/worksheet-chrome'

const lineSpacing = 4
const groupGap = 6
const lineStrokeWidth = 0.15

export function BlankFourLineWorksheet({ margins = defaultPageMargins }: { margins?: PageMargins }) {
  const svgWidth = getContentWidth(margins)
  const worksheetWidth = svgWidth - lineStrokeWidth
  // 姓名日期栏和间隔占 15 mm，页脚预留 8 mm。
  const groupCount = Math.floor((getContentHeight(margins) - 23 + groupGap - lineStrokeWidth) / (lineSpacing * 3 + groupGap))
  const worksheetHeight = groupCount * (lineSpacing * 3 + groupGap) - groupGap + lineStrokeWidth
  return (
    <article
      data-worksheet-page
      aria-label='空白英语四线三格练习纸，第 1 页，共 1 页'
      className='relative mx-auto mb-8 h-[297mm] w-[210mm] bg-white shadow-sm last:mb-0'
    >
      <WorksheetHeader />
      <svg
        viewBox={`-${lineStrokeWidth / 2} 0 ${svgWidth} ${worksheetHeight}`}
        style={{ width: `${svgWidth}mm`, height: `${worksheetHeight}mm` }}
        className='mt-[5mm] block'
        role='img'
        aria-label={`${groupCount} 组空白英语四线三格，每组 4 条等距横线`}
      >
        {Array.from({ length: groupCount }, (_, group) => {
          const groupOffset = group * ((lineSpacing * 3) + groupGap) + lineStrokeWidth / 2

          return (
            <g key={group} fill='none' stroke='#dedede' strokeWidth={lineStrokeWidth}>
              {Array.from({ length: 4 }, (_, line) => (
                <path
                  key={line}
                  d={`M 0 ${groupOffset + line * lineSpacing} H ${worksheetWidth}`}
                  stroke={line === 2 ? '#f6d9ce' : undefined}
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
