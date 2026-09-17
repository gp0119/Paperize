import { getContentHeight, getContentWidth, type PageMargins } from '@/features/builder/page-margins'
import { getReservedHeight, type PageVisibility } from '@/features/builder/page-visibility'

export const numberPracticeMargins: PageMargins = { marginTop: 5, marginRight: 5, marginBottom: 5, marginLeft: 5 }
export const numberPracticeVisibility: PageVisibility = { hideHeader: true, hideTitle: true, hideFooter: true }
export const defaultContent = Array.from({ length: 16 }, (_, row) => String((row + 1) % 10)).join('\n')
export const defaultOptions = {
  highlightFirst: true,
  blankRows: false,
  blankColumns: false,
  rowHeight: 16,
  rowGap: 2,
  fontSize: 78,
  verticalOffset: 0,
  bold: false,
  tracingDashed: false,
  tracingCount: 20,
  tracingColor: '#94a3b8',
  gridColor: '#71829e',
}
export type NumberPracticeOptions = typeof defaultOptions
export const strokeWidth = 0.25

export function validateContent(content: string) {
  if (!/^[0-9\s]*$/.test(content)) return '请输入数字 0～9，使用换行分隔，空格会自动忽略。'
  if (!/[0-9]/.test(content)) return '请至少输入一个数字。'
  if (content.length > 2000 || content.split('\n').length > 200) return '最多输入 2000 个字符、200 行。'
  return null
}

export function getLayout(options: NumberPracticeOptions, margins: PageMargins, visibility: PageVisibility) {
  const width = getContentWidth(margins)
  const gridWidth = width - strokeWidth
  const columns = Math.floor(gridWidth / (options.rowHeight / 2 - 0.1))
  const rows = Math.floor((getContentHeight(margins) - getReservedHeight(visibility, false, 5) + options.rowGap - strokeWidth) / (options.rowHeight + options.rowGap))
  return { width, gridWidth, columns, cellWidth: gridWidth / columns, rows }
}

export function paginateContent(content: string, options: NumberPracticeOptions, columns: number, rows: number) {
  const digitsPerRow = Math.min(options.tracingCount, Math.ceil(columns / (options.blankColumns ? 2 : 1)))
  const lines: string[] = []
  for (const line of content.split('\n')) {
    const digits = line.replace(/\s/g, '')
    if (!digits) lines.push('')
    for (let start = 0; start < digits.length; start += digitsPerRow) {
      lines.push(digits.slice(start, start + digitsPerRow))
      if (options.blankRows) lines.push('')
    }
  }
  return Array.from({ length: Math.ceil(lines.length / rows) }, (_, page) => lines.slice(page * rows, (page + 1) * rows))
}
