const repeat = (count: number, draw: (index: number) => string) => Array.from({ length: count }, (_, index) => draw(index)).join(' ')
const horizontal = repeat(7, (i) => `M 12 ${14 + i * 12} H 88`)
const zigzag = `M 12 12 ${repeat(5, (i) => `H 88 L 12 ${27 + i * 15}`)} H 88`
const spiral = repeat(181, (i) => {
  const angle = i / 180 * Math.PI * 5.5
  const radius = 2 + i / 180 * 40
  return `${i ? 'L' : 'M'} ${(50 + Math.cos(angle) * radius).toFixed(3)} ${(50 + Math.sin(angle) * radius).toFixed(3)}`
})
const grid = repeat(7, (i) => `M 12 ${14 + i * 12} H 88 M ${14 + i * 12} 12 V 88`)
const corner = repeat(5, (i) => `M 12 ${12 + i * 15} H ${88 - i * 15} V 88`)
const squareSpiral = 'M 88 88 V 12 H 12 V 76 H 76 V 24 H 24 V 64 H 64 V 36 H 36 V 52 H 52'
const steps = repeat(2, (i) => `M 12 ${12 + i * 45} v 28 h 18 v -28 h 18 v 28 h 18 v -28 h 18 v 28`)
const peaks = repeat(3, (i) => `M 12 ${30 + i * 25} l 19 -18 l 19 18 l 19 -18 l 19 18`)
const waves = repeat(3, (i) => `M 12 ${22 + i * 28} q 9 -12 19 0 t 19 0 t 19 0 t 19 0`)
const diagonal = repeat(6, (i) => `M ${12 + i * 9} 12 L ${43 + i * 9} 88`)
const loops = repeat(2, (i) => `M 12 ${22 + i * 42} ${repeat(3, () => 'c 32 -15 32 28 16 20 c -16 -8 0 -28 9 -20')}`)
const arches = repeat(3, (i) => `M 12 ${32 + i * 25} a 19 16 0 0 1 38 0 a 19 16 0 0 1 38 0`)
const circles = repeat(4, (i) => `M ${45 + i % 2 * 40} ${28 + Math.floor(i / 2) * 42} a 17 17 0 1 0 -34 0 a 17 17 0 1 0 34 0`)

export const penPatterns = [
  { name: '横线', path: horizontal },
  { name: '竖线', path: horizontal, transform: 'rotate(90 50 50)' },
  { name: '横折线', path: zigzag },
  { name: '竖折线', path: zigzag, transform: 'rotate(90 50 50)' },
  { name: '顺时针螺旋', path: spiral },
  { name: '逆时针螺旋', path: spiral, transform: 'translate(100 0) scale(-1 1)' },
  { name: '网格', path: grid },
  { name: '斜网格', path: grid, transform: 'translate(50 50) rotate(45) scale(.7) translate(-50 -50)' },
  { name: '横折', path: corner },
  { name: '竖折', path: corner, transform: 'rotate(180 50 50)' },
  { name: '竖虚线', path: horizontal, transform: 'rotate(90 50 50)', dash: '12 5' },
  { name: '横虚线', path: horizontal, dash: '12 5' },
  { name: '方螺旋', path: squareSpiral },
  { name: '反向方螺旋', path: squareSpiral, transform: 'rotate(90 50 50)' },
  { name: '横阶梯', path: steps },
  { name: '竖阶梯', path: steps, transform: 'rotate(90 50 50)' },
  { name: '上尖折线', path: peaks },
  { name: '下尖折线', path: peaks, transform: 'rotate(180 50 50)' },
  { name: '横波浪', path: waves },
  { name: '竖波浪', path: waves, transform: 'rotate(90 50 50)' },
  { name: '右斜线', path: diagonal },
  { name: '左斜线', path: diagonal, transform: 'translate(100 0) scale(-1 1)' },
  { name: '横绕圈', path: loops },
  { name: '竖绕圈', path: loops, transform: 'rotate(90 50 50)' },
  { name: '连拱', path: arches },
  { name: '斜阶梯', path: steps, transform: 'translate(50 50) skewX(-15) scale(.85) translate(-50 -50)' },
  { name: '反向连拱', path: arches, transform: 'rotate(180 50 50)' },
  { name: '圆圈', path: circles },
  { name: '方框', path: 'M 12 15 h 30 v 25 H 12 Z M 58 15 h 30 v 25 H 58 Z M 12 60 h 30 v 25 H 12 Z M 58 60 h 30 v 25 H 58 Z' },
  { name: '五角星', path: 'M 50 10 L 60 38 L 90 38 L 66 57 L 75 87 L 50 69 L 25 87 L 34 57 L 10 38 L 40 38 Z' },
  { name: '椭圆', path: circles, transform: 'translate(15 0) scale(.7 1)' },
  { name: '爱心', path: 'M 50 88 C -20 43 14 -8 50 26 C 86 -8 120 43 50 88 Z M 50 73 C 0 40 24 12 50 39 C 76 12 100 40 50 73 Z' },
]

export type PenPattern = typeof penPatterns[number]
export const defaultContent = penPatterns.slice(0, 6).map((pattern) => pattern.name).join(' ')

export function parsePatterns(content: string) {
  return content.trim() ? content.trim().split(/\s+/).map((name) => penPatterns.find((pattern) => pattern.name === name)) : []
}
