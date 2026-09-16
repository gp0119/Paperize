'use client'

import { useState } from 'react'

import { defaultGridColor } from '@/features/builder/worksheet-chrome'

import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { SettingsGroup } from '@/features/builder/settings-group'
import { defaultPageMargins } from '@/features/builder/page-margins'
import { TemplateWorkspace } from '@/features/builder/template-workspace'
import { paginateCharacters, parseCharacters, type CharacterStrokes } from './layout'
import { sampleCharacters } from './sample'
import { StrokeOrderWorksheet } from './worksheet'

export function StrokeOrderTemplate() {
  const [margins, setMargins] = useState(defaultPageMargins)
  const [text, setText] = useState('永山水木')
  const [characters, setCharacters] = useState(sampleCharacters)
  const [color, setColor] = useState(defaultGridColor)
  const [tracingCount, setTracingCount] = useState(4)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pages = paginateCharacters(characters, margins)
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
    <TemplateWorkspace margins={margins} onMarginsChange={setMargins} title='笔顺字帖' configuration={
      <form className='space-y-6' onSubmit={(event) => { event.preventDefault(); if (!loading) void generate() }}>
        <SettingsGroup title='内容'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='characters' className='text-sm font-medium'>自定义汉字</label>
            <textarea id='characters' value={text} onChange={(event) => setText(event.target.value)} disabled={loading} rows={4} maxLength={1000} aria-describedby='characters-help' className='min-w-0 w-full rounded-md border border-input bg-background p-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50' />
            <p id='characters-help' className='text-xs text-muted-foreground'>{inputCharacters.length} / 40 字</p>
          </div>
          <Button type='submit' className='w-full' disabled={loading}>{loading ? '正在生成…' : '生成字帖'}</Button>
          <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3 gap-y-2'>
            <label htmlFor='tracing-count' className='text-sm font-medium'>每字描红格数</label>
            <Select id='tracing-count' value={String(tracingCount)} onValueChange={(value) => setTracingCount(Number(value))} className='min-w-0'
              options={[0, 2, 4, 6, 8].map((count) => ({ value: String(count), label: `${count} 格描红` }))}
            />
          </div>
        </SettingsGroup>
        <SettingsGroup title='外观'>
          <div className='flex items-center justify-between'>
            <label htmlFor='stroke-grid-color' className='text-sm font-medium'>田字格颜色</label>
            <input id='stroke-grid-color' type='color' value={color} onChange={(event) => setColor(event.target.value)} className='h-9 w-14 cursor-pointer rounded-md border border-input p-1' />
          </div>
        </SettingsGroup>
        {error ? <p role='alert' className='text-sm text-destructive'>{error}预览未更新。</p> : null}
        <div aria-live='polite' className='rounded-lg bg-muted p-4 text-sm leading-6'>
          {characters.length} 字 · {pages.length} 页
          {changed ? <p className='mt-2'>内容已修改，请重新生成。</p> : null}
        </div>
        <p className='text-xs text-muted-foreground'>笔顺数据：<a href='https://github.com/chanind/hanzi-writer-data' className='underline'>Hanzi Writer Data</a>（Arphic Public License）</p>
      </form>
    } preview={pages.map((page, index) => <StrokeOrderWorksheet margins={margins} key={index} characters={page} pageIndex={index} pageCount={pages.length} color={color} tracingCount={tracingCount} />)} />
  )
}
