import { defaultPageVisibility, getReservedHeight, type PageVisibility } from '@/features/builder/page-visibility'
import { defaultPageMargins, getContentWidth, getContentHeight, type PageMargins } from '@/features/builder/page-margins'

import { defaultGridColor } from '@/features/builder/worksheet-chrome'

export const gridTypes = ['作文格', '田字格', '米字格', '回宫格', '九宫格', '回田格', '回米格'] as const

export type GridLayout = {
  gridType: typeof gridTypes[number]
  cellSize: number
  rowGap: number
  color: string
}

export const defaultLayout: GridLayout = {
  gridType: '田字格',
  cellSize: 14,
  rowGap: 2,
  color: defaultGridColor,
}

export function validateLayout(layout: GridLayout): string | null {
  if (!gridTypes.includes(layout.gridType)) return '请选择有效的方格类型。'
  if (!Number.isFinite(layout.cellSize) || layout.cellSize < 8 || layout.cellSize > 25) return '方格大小需在 8～25 mm 之间。'
  if (!Number.isFinite(layout.rowGap) || layout.rowGap < 0 || layout.rowGap > 10) return '行间距需在 0～10 mm 之间。'
  if (!/^#[0-9a-f]{6}$/i.test(layout.color)) return '请选择有效的格子颜色。'
  return null
}

export function getGridDimensions(layout: GridLayout, margins: PageMargins = defaultPageMargins, visibility: PageVisibility = defaultPageVisibility) {
  const columns = Math.floor((getContentWidth(margins)) / layout.cellSize)
  const rows = Math.floor((getContentHeight(margins) - getReservedHeight(visibility, false, 5) + layout.rowGap) / (layout.cellSize + layout.rowGap))
  return {
    columns,
    rows,
    width: columns * layout.cellSize,
    height: rows * layout.cellSize + (rows - 1) * layout.rowGap,
  }
}
