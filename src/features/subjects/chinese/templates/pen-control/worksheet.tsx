import localFont from 'next/font/local'

import { defaultPageMargins, type PageMargins } from '@/features/builder/page-margins'
import type { PageVisibility } from '@/features/builder/page-visibility'
import { WorksheetHeader, WorksheetFooter } from '@/features/builder/worksheet-chrome'
import { getGridDimensions } from '../blank-tian-zi-ge/layout'
import { defaultContent, parsePatterns, type PenPattern } from './patterns'

const penControlFont = localFont({ src: './pen-control.woff2', weight: '400', adjustFontFallback: false })

export const penControlVisibility: PageVisibility = { hideHeader: true, hideTitle: true, hideFooter: true }
export const defaultOptions = {
  cellSize: 14,
  rowGap: 0,
  color: '#71829e',
  tracingColor: '#94a3b8',
  tracingWidth: '1.2',
  tracingDashed: false,
  tracingCount: 20,
  blankRows: false,
}
export type PenControlOptions = typeof defaultOptions

export function PatternGlyph({ pattern, dashed = false, strokeWidth = 0 }: { pattern: PenPattern; dashed?: boolean; strokeWidth?: number }) {
  return (
    <text className={penControlFont.className} x={50} y={88} fontSize={100} fontWeight={400} textAnchor='middle'
      fill={dashed ? 'none' : 'currentColor'} stroke={strokeWidth || dashed ? 'currentColor' : 'none'}
      strokeWidth={strokeWidth} strokeDasharray={dashed ? '5 5' : undefined} aria-hidden='true'>
      {pattern.glyph}
    </text>
  )
}

export function PenControlWorksheet({ content = defaultContent, options = defaultOptions, margins = defaultPageMargins, visibility = penControlVisibility }: {
  content?: string
  options?: PenControlOptions
  margins?: PageMargins
  visibility?: PageVisibility
}) {
  const { rows, columns, width, height } = getGridDimensions({ ...options, gridType: '作文格' }, margins, visibility)
  const patterns = parsePatterns(content).flatMap((pattern) => options.blankRows ? [pattern, undefined] : [pattern])
  const pageCount = Math.max(1, Math.ceil(patterns.length / rows))
  const size = options.cellSize

  return Array.from({ length: pageCount }, (_, page) => (
    <article key={page} data-worksheet-page aria-label={`控笔练习，第 ${page + 1} 页，共 ${pageCount} 页`}
      className='relative mb-8 h-[297mm] w-[210mm] bg-white font-sans text-[#333] shadow-sm last:mb-0'>
      <WorksheetHeader />
      <svg data-worksheet-content viewBox={`0 0 ${width} ${height}`} style={{ width: `${width}mm`, height: `${height}mm` }}
        className='mx-auto mt-[5mm] block overflow-visible' role='img' aria-label={`控笔练习，${rows} 行，每行 ${columns} 格`}>
        {Array.from({ length: rows }, (_, row) => {
          const pattern = patterns[page * rows + row]
          return (
            <g key={row} transform={`translate(0 ${row * (size + options.rowGap)})`} fill='none'>
              <path stroke={options.color} strokeWidth={0.25}
                d={`M 0 0 H ${width} V ${size} H 0 Z ${Array.from({ length: columns - 1 }, (_, column) => `M ${(column + 1) * size} 0 V ${size}`).join(' ')}`} />
              {pattern ? Array.from({ length: Math.min(columns, options.tracingCount) }, (_, column) => (
                <g key={column} transform={`translate(${column * size} 0) scale(${size / 100})`}
                  color={options.tracingColor} strokeLinecap='round' strokeLinejoin='round'>
                  <PatternGlyph pattern={pattern} dashed={options.tracingDashed}
                    strokeWidth={options.tracingDashed ? Number(options.tracingWidth) : Number(options.tracingWidth) - 0.8} />
                </g>
              )) : null}
            </g>
          )
        })}
      </svg>
      <WorksheetFooter pageIndex={page} pageCount={pageCount} />
    </article>
  ))
}
