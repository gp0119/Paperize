import type { TracingOptions } from '@/features/builder/tracing-settings'
import { defaultGridColor } from '@/features/builder/worksheet-chrome'
import { defaultPageVisibility, getReservedHeight, type PageVisibility } from '@/features/builder/page-visibility'
import { defaultPageMargins, getContentWidth, getContentHeight, type PageMargins } from '@/features/builder/page-margins'

export type CharacterStrokes = { character: string; strokes: string[] }
export const defaultOptions: TracingOptions = { cellSize: 15, rowGap: 4, tracingCount: 4, color: defaultGridColor, tracingColor: '#cbd0d8', tracingWidth: '1.2', tracingDashed: false, blankRows: false }

export function getColumns(margins: PageMargins = defaultPageMargins, options = defaultOptions) {
  return Math.floor((getContentWidth(margins) + 1.5) / (options.cellSize + 1.5))
}

export function parseCharacters(text: string) {
  return Array.from(text).filter((character) => /\p{Script=Han}/u.test(character))
}

export function getBlockHeight(character: CharacterStrokes, margins: PageMargins = defaultPageMargins, options = defaultOptions) {
  // 范字与逐笔示范按需换行，完整描红及空白练习单独占一行。
  return (Math.ceil((1 + character.strokes.length) / getColumns(margins, options)) + 1 + Number(options.blankRows)) * (options.cellSize + options.rowGap) + 4
}

export function paginateCharacters(characters: CharacterStrokes[], margins: PageMargins = defaultPageMargins, visibility: PageVisibility = defaultPageVisibility, options = defaultOptions) {
  const pages: CharacterStrokes[][] = []
  let height = 0
  for (const character of characters) {
    const blockHeight = getBlockHeight(character, margins, options)
    if (!pages.length || height + blockHeight > getContentHeight(margins) - getReservedHeight(visibility, true)) {
      pages.push([])
      height = 0
    }
    pages[pages.length - 1].push(character)
    height += blockHeight
  }
  return pages
}

export function validatePage(characters: CharacterStrokes[], margins: PageMargins, visibility: PageVisibility, options: TracingOptions) {
  return characters.some((character) => getBlockHeight(character, margins, options) > getContentHeight(margins) - getReservedHeight(visibility, true)) ? '当前设置无法在一页内放下完整笔顺，请缩小方格、间距或页边距。' : null
}
