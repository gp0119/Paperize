'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { TemplateWorkspace } from '@/features/builder/template-workspace'
import { paginateCharacters, parseCharacters, type CharacterStrokes } from './layout'
import { sampleCharacters } from './sample'
import { StrokeOrderWorksheet } from './worksheet'

export function StrokeOrderTemplate() {
  const [text, setText] = useState('永山水木')
  const [characters, setCharacters] = useState(sampleCharacters)
  const [color, setColor] = useState('#596273')
  const [tracingCount, setTracingCount] = useState(4)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pages = paginateCharacters(characters)
  const inputCharacters = parseCharacters(text)
  const changed = inputCharacters.join('') !== characters.map((entry) => entry.character).join('')

  async function generate() {
    if (!inputCharacters.length || inputCharacters.length > 40) {
      setError('请输入 1～40 个汉字，空格、标点和其他字符会自动忽略。')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/strokes?characters=${encodeURIComponent(inputCharacters.join(''))}`)
      if (!response.ok) throw new Error('笔顺数据加载失败，请重试。')
      const data: { character: string; strokes: string[] | null }[] = await response.json()
      const missing = data.filter((entry) => !entry.strokes).map((entry) => entry.character)
      if (missing.length) throw new Error(`暂未收录这些字的笔顺：${missing.join('、')}。请替换后重试。`)
      const byCharacter = new Map(data.map((entry) => [entry.character, entry.strokes!]))
      setCharacters(inputCharacters.map((character): CharacterStrokes => ({ character, strokes: byCharacter.get(character)! })))
    } catch (error) {
      setError(error instanceof Error ? error.message : '生成失败，请重试。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <TemplateWorkspace title='笔顺字帖' configuration={
      <form className='space-y-6' onSubmit={(event) => { event.preventDefault(); if (!loading) void generate() }}>
        <p className='text-sm leading-6 text-muted-foreground'>上方为范字和逐笔示范，完整描红与空白练习另起一行。浅红色突出当前笔画，浅灰色保留已写笔画。</p>
        <div>
          <label htmlFor='characters' className='text-sm font-medium'>自定义汉字</label>
          <textarea id='characters' value={text} onChange={(event) => setText(event.target.value)} disabled={loading} rows={4} maxLength={1000} aria-describedby='characters-help' className='mt-2 w-full rounded-md border border-input bg-background p-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50' />
          <p id='characters-help' className='mt-2 text-xs leading-5 text-muted-foreground'>已输入 {inputCharacters.length} / 40 个汉字。自动忽略空格和标点，保留重复字及输入顺序。</p>
        </div>
        <Button type='submit' className='w-full' disabled={loading}>{loading ? '正在生成…' : '生成字帖'}</Button>
        <div>
          <label htmlFor='tracing-count' className='text-sm font-medium'>每字描红格数</label>
          <select id='tracing-count' value={tracingCount} onChange={(event) => setTracingCount(Number(event.target.value))} className='mt-2 h-9 w-full rounded-md border border-input bg-background px-3 text-sm'>
            {[0, 2, 4, 6, 8].map((count) => <option key={count} value={count}>{count} 格描红</option>)}
          </select>
          <p className='mt-2 text-xs leading-5 text-muted-foreground'>练习行共 11 格，描红后留空白格；上方长笔顺会自动换行。</p>
        </div>
        <div className='flex items-center justify-between'>
          <label htmlFor='stroke-grid-color' className='text-sm font-medium'>田字格颜色</label>
          <input id='stroke-grid-color' type='color' value={color} onChange={(event) => setColor(event.target.value)} className='h-9 w-14 cursor-pointer rounded-md border border-input p-1' />
        </div>
        {error ? <p role='alert' className='text-sm text-destructive'>{error}预览保留上次生成的字帖。</p> : null}
        <div aria-live='polite' className='rounded-lg bg-muted p-4 text-sm leading-6'>
          当前预览：{characters.map((entry) => entry.character).join(' ')}<br />
          A4 纵向 · {pages.length} 页 · 15 mm 田字格
          {changed ? <p className='mt-2'>内容已修改，点击「生成字帖」更新预览。</p> : null}
        </div>
        <p className='text-xs leading-5 text-muted-foreground'>打印或保存为 PDF 时使用当前预览。笔顺数据来自 <a href='https://github.com/chanind/hanzi-writer-data' className='underline'>Hanzi Writer Data</a>（Arphic Public License），部分生僻字暂未收录。</p>
      </form>
    } preview={pages.map((page, index) => <StrokeOrderWorksheet key={index} characters={page} pageIndex={index} pageCount={pages.length} color={color} tracingCount={tracingCount} />)} />
  )
}
