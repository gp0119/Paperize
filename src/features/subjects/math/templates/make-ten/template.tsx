'use client'

import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TemplateWorkspace } from '@/features/builder/template-workspace'
import { defaultOptions, generateExercises, validateOptions } from './generator'
import { defaultLayout, getPageCapacity, validateLayout } from './layout'
import { MakeTenWorksheet } from './worksheet'

export function MakeTenTemplate() {
  const [options, setOptions] = useState(defaultOptions)
  const [layout, setLayout] = useState(defaultLayout)
  const [showAnswers, setShowAnswers] = useState(false)
  const [seed, setSeed] = useState(42)
  const [error, setError] = useState<string | null>(null)
  const exercises = useMemo(() => generateExercises(options, seed), [options, seed])
  const pageCapacity = getPageCapacity(layout)
  const pageCount = Math.ceil(exercises.length / pageCapacity)

  return (
    <TemplateWorkspace
      title='凑十法'
      configuration={
        <form
          className='space-y-6'
          onChange={(event) => {
            const data = new FormData(event.currentTarget)
            const number = (name: string) => (data.get(name) === '' ? NaN : Number(data.get(name)))
            const next = { count: number('count'), firstAddend: number('firstAddend') }
            const nextLayout = { columns: number('columns'), rowGap: number('rowGap') }
            const message = validateOptions(next) || validateLayout(nextLayout)
            setError(message)
            if (!message) {
              setOptions(next)
              setLayout(nextLayout)
              setShowAnswers(data.has('showAnswers'))
            }
          }}
          onSubmit={(event) => {
            event.preventDefault()
            if (!error) setSeed(Math.floor(Math.random() * 4294967296))
          }}
        >
          <p className='text-sm leading-6 text-muted-foreground'>两个一位数相加，和为 11～18。拆分第二个加数，与第一个加数凑成 10。</p>
          <div>
            <label htmlFor='count' className='text-sm font-medium'>题目数量</label>
            <Input id='count' name='count' type='number' min={1} max={300} step={1} required defaultValue={defaultOptions.count} className='mt-2' />
          </div>
          <div>
            <label htmlFor='first-addend' className='text-sm font-medium'>第一加数</label>
            <select id='first-addend' name='firstAddend' defaultValue={defaultOptions.firstAddend} className='mt-2 h-9 w-full rounded-md border border-input bg-background px-3 text-sm'>
              <option value={0}>混合练习（2～9）</option>
              {Array.from({ length: 8 }, (_, index) => index + 2).map((value) => (
                <option key={value} value={value}>{value} + 几</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor='columns' className='text-sm font-medium'>列数</label>
            <Input id='columns' name='columns' type='number' min={1} max={3} step={1} required defaultValue={defaultLayout.columns} className='mt-2' aria-describedby='columns-help' />
            <p id='columns-help' className='mt-2 text-xs text-muted-foreground'>1～3 列，图形随列宽等比缩放，自动分页。</p>
          </div>
          <div>
            <label htmlFor='row-gap' className='text-sm font-medium'>行间距（mm）</label>
            <Input id='row-gap' name='rowGap' type='number' min={0} max={20} step='any' required defaultValue={defaultLayout.rowGap} className='mt-2' />
          </div>
          <label className='flex items-center gap-3 text-sm font-medium'>
            <input name='showAnswers' type='checkbox' defaultChecked={false} className='size-4 accent-blue-600' />
            显示答案（含分解数）
          </label>
          {error ? <p role='alert' className='text-sm text-destructive'>{error}预览保留上次有效配置。</p> : null}
          <div aria-live='polite' className='rounded-lg bg-muted p-4 text-sm leading-6'>
            共 {exercises.length} 题 · {pageCount} 页 · 每页最多 {pageCapacity} 题
          </div>
          <Button type='submit' variant='outline' className='w-full' disabled={Boolean(error)}>
            <RefreshCw aria-hidden='true' />
            换一批题目
          </Button>
          <p className='text-xs leading-5 text-muted-foreground'>可选算式用完后才会重复。打印内容与当前预览一致，打印练习前请关闭显示答案。</p>
        </form>
      }
      preview={Array.from({ length: pageCount }, (_, pageIndex) => (
        <MakeTenWorksheet
          key={pageIndex}
          exercises={exercises.slice(pageIndex * pageCapacity, (pageIndex + 1) * pageCapacity)}
          layout={layout}
          showAnswers={showAnswers}
          pageIndex={pageIndex}
          pageCount={pageCount}
        />
      ))}
    />
  )
}
