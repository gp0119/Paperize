import { readFile } from 'node:fs/promises'
import path from 'node:path'

export async function GET(request: Request) {
  const text = new URL(request.url).searchParams.get('characters') ?? ''
  const characters = Array.from(text)
  if (!characters.length || characters.length > 40 || characters.some((character) => !/^\p{Script=Han}$/u.test(character))) {
    return Response.json({ error: '请输入 1～40 个汉字。' }, { status: 400 })
  }

  try {
    const entries = await Promise.all([...new Set(characters)].map(async (character) => {
      try {
        const data = JSON.parse(await readFile(path.join(process.cwd(), 'node_modules/hanzi-writer-data', `${character}.json`), 'utf8'))
        return { character, strokes: data.strokes as string[] }
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { character, strokes: null }
        throw error
      }
    }))
    return Response.json(entries)
  } catch {
    return Response.json({ error: '笔顺数据加载失败，请重试。' }, { status: 500 })
  }
}
