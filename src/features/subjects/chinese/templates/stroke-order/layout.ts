export type CharacterStrokes = { character: string; strokes: string[] }
export const columns = 11
export const cellSize = 15

export function parseCharacters(text: string) {
  return Array.from(text).filter((character) => /\p{Script=Han}/u.test(character))
}

export function getBlockHeight(character: CharacterStrokes) {
  // 范字与逐笔示范按需换行，完整描红及空白练习单独占一行。
  return (Math.ceil((1 + character.strokes.length) / columns) + 1) * 19 + 4
}

export function paginateCharacters(characters: CharacterStrokes[]) {
  const pages: CharacterStrokes[][] = []
  let height = 0
  for (const character of characters) {
    const blockHeight = getBlockHeight(character)
    if (!pages.length || height + blockHeight > 235) {
      pages.push([])
      height = 0
    }
    pages[pages.length - 1].push(character)
    height += blockHeight
  }
  return pages
}
