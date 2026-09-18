const patternNames = [
  '横线', '竖线', '横折线', '竖折线', '顺时针螺旋', '逆时针螺旋',
  '网格', '斜网格', '横折', '竖折', '竖虚线', '横虚线',
  '方螺旋', '反向方螺旋', '横阶梯', '竖阶梯', '上尖折线', '下尖折线',
  '横波浪', '竖波浪', '右斜线', '左斜线', '横绕圈', '竖绕圈',
  '连拱', '斜阶梯', '反向连拱', '圆圈', '方框', '五角星', '椭圆', '爱心',
]

const glyphs = '123456789ABCDEFGHIJKLMNOPQRSTUVW'

export const penPatterns = patternNames.map((name, index) => ({ name, glyph: glyphs[index] }))

export type PenPattern = typeof penPatterns[number]
export const defaultContent = penPatterns.slice(0, 6).map((pattern) => pattern.name).join(' ')

export function parsePatterns(content: string) {
  return content.trim() ? content.trim().split(/\s+/).map((name) => penPatterns.find((pattern) => pattern.name === name)) : []
}
