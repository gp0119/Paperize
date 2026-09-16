'use client'

import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { InputNumber } from '@/components/ui/input-number'
import { Select } from '@/components/ui/select'
import { SettingsGroup } from '@/features/builder/settings-group'
import { defaultPageMargins } from '@/features/builder/page-margins'
import { TemplateWorkspace } from '@/features/builder/template-workspace'
import { defaultOptions, generateExercises, validateOptions } from './generator'
import { defaultLayout, getPageCapacity, validateLayout } from './layout'
import { MakeTenWorksheet } from './worksheet'

export function MakeTenTemplate() {
  const [margins, setMargins] = useState(defaultPageMargins)
  const [options, setOptions] = useState(defaultOptions)
  const [layout, setLayout] = useState(defaultLayout)
  const [showAnswers, setShowAnswers] = useState(false)
  const [seed, setSeed] = useState(42)
  const [error, setError] = useState<string | null>(null)
  const exercises = useMemo(() => generateExercises(options, seed), [options, seed])
  const pageCapacity = getPageCapacity(layout, margins)
  const pageCount = Math.ceil(exercises.length / pageCapacity)

  return (
    <TemplateWorkspace margins={margins} onMarginsChange={setMargins}
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
          <SettingsGroup title='内容'>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3 gap-y-2'>
              <label htmlFor='count' className='text-sm font-medium'>题目数量（1～300）</label>
              <InputNumber id='count' name='count' min={1} max={300} step={1} required defaultValue={defaultOptions.count} className='min-w-0' />
            </div>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3 gap-y-2'>
              <label htmlFor='first-addend' className='text-sm font-medium'>第一加数</label>
              <Select id='first-addend' name='firstAddend' defaultValue={String(defaultOptions.firstAddend)} className='min-w-0'
                options={[
                  { value: '0', label: '混合练习（2～9）' },
                  ...Array.from({ length: 8 }, (_, index) => {
                    const value = index + 2
                    return { value: String(value), label: `${value} + 几` }
                  }),
                ]}
              />
            </div>
            <label className='flex items-center gap-3 text-sm font-medium'>
              <input name='showAnswers' type='checkbox' defaultChecked={false} className='size-4 accent-slate-900' />
              显示答案（含分解数）
            </label>
          </SettingsGroup>
          <SettingsGroup title='版式'>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3 gap-y-2'>
              <label htmlFor='columns' className='text-sm font-medium'>列数（1～3）</label>
              <InputNumber id='columns' name='columns' min={1} max={3} step={1} required defaultValue={defaultLayout.columns} className='min-w-0' />
            </div>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3 gap-y-2'>
              <label htmlFor='row-gap' className='text-sm font-medium'>行间距（mm）</label>
              <InputNumber id='row-gap' name='rowGap' min={0} max={20} step='any' required defaultValue={defaultLayout.rowGap} className='min-w-0' />
            </div>
          </SettingsGroup>
          {error ? <p role='alert' className='text-sm text-destructive'>{error}预览未更新。</p> : null}
          <div aria-live='polite' className='rounded-lg bg-muted p-4 text-sm leading-6'>
            {exercises.length} 题 · {pageCount} 页
          </div>
          <Button type='submit' variant='outline' className='w-full' disabled={Boolean(error)}>
            <RefreshCw aria-hidden='true' />
            换一批题目
          </Button>
        </form>
      }
      preview={Array.from({ length: pageCount }, (_, pageIndex) => (
        <MakeTenWorksheet
          key={pageIndex}
          exercises={exercises.slice(pageIndex * pageCapacity, (pageIndex + 1) * pageCapacity)}
          layout={layout} margins={margins}
          showAnswers={showAnswers}
          pageIndex={pageIndex}
          pageCount={pageCount}
        />
      ))}
    />
  )
}
