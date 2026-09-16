'use client'

import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { InputNumber } from '@/components/ui/input-number'
import { SettingsGroup } from '@/features/builder/settings-group'
import { defaultPageMargins } from '@/features/builder/page-margins'
import { TemplateWorkspace } from '@/features/builder/template-workspace'
import { defaultOptions, generateExercises, validateOptions } from './generator'
import { defaultLayout, getPageCapacity, validateLayout } from './layout'
import { ArithmeticWorksheet } from './worksheet'

export function ArithmeticTemplate({ maximum }: { maximum: 10 | 20 }) {
  const [margins, setMargins] = useState(defaultPageMargins)
  const [options, setOptions] = useState(defaultOptions)
  const [layout, setLayout] = useState(defaultLayout)
  const [seed, setSeed] = useState(42)
  const [error, setError] = useState<string | null>(null)
  const exercises = useMemo(() => generateExercises(options, seed, maximum), [options, seed, maximum])
  const pageCapacity = getPageCapacity(layout, margins)
  const pageCount = Math.ceil(exercises.length / pageCapacity)
  const additionCount = exercises.filter((exercise) => exercise.operator === '+').length

  return (
    <TemplateWorkspace margins={margins} onMarginsChange={setMargins} validateMargins={(next) => validateLayout(layout, next, maximum)}
      title={`${maximum} 以内加减法`}
      configuration={
        <form
          className='space-y-6'
          onChange={(event) => {
            const data = new FormData(event.currentTarget)
            const number = (name: string) => (data.get(name) === '' ? NaN : Number(data.get(name)))
            const next = {
              count: number('count'),
              includeZero: data.has('includeZero'),
              additionWeight: number('additionWeight'),
              subtractionWeight: number('subtractionWeight'),
            }
            const nextLayout = {
              columns: number('columns'),
              fontSize: number('fontSize'),
              rowGap: number('rowGap'),
              columnGap: number('columnGap'),
            }
            const message = validateOptions(next) || validateLayout(nextLayout, margins, maximum)
            setError(message)
            if (!message) {
              setOptions(next)
              setLayout(nextLayout)
            }
          }}
          onSubmit={(event) => {
            event.preventDefault()
            if (!error) setSeed(Math.floor(Math.random() * 4294967296))
          }}
        >
          <SettingsGroup title='内容'>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3 gap-y-2'>
              <label htmlFor='count' className='text-sm font-medium'>
                题目数量（10～300）
              </label>
              <InputNumber
                id='count'
                name='count'
                min={10}
                max={300}
                step={10}
                required
                defaultValue={defaultOptions.count}
                className='min-w-0'
              />
            </div>
            <div>
              <label className='flex items-center gap-3 text-sm font-medium'>
                <input name='includeZero' type='checkbox' defaultChecked={defaultOptions.includeZero} className='size-4 accent-slate-900' />
                包含 0（算式和结果）
              </label>
            </div>
            <fieldset>
              <legend className='text-sm font-medium'>加减比例</legend>
              <div className='mt-3 space-y-3'>
                <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3 gap-y-2'>
                  <label htmlFor='addition-weight' className='text-sm'>
                    加法
                  </label>
                  <InputNumber
                    id='addition-weight'
                    name='additionWeight'
                    min={0}
                    max={100}
                    step={1}
                    required
                    defaultValue={defaultOptions.additionWeight}
                    className='min-w-0'
                  />
                </div>
                <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3 gap-y-2'>
                  <label htmlFor='subtraction-weight' className='text-sm'>
                    减法
                  </label>
                  <InputNumber
                    id='subtraction-weight'
                    name='subtractionWeight'
                    min={0}
                    max={100}
                    step={1}
                    required
                    defaultValue={defaultOptions.subtractionWeight}
                    className='min-w-0'
                  />
                </div>
              </div>
            </fieldset>
          </SettingsGroup>
          <SettingsGroup title='版式'>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3 gap-y-2'>
              <label htmlFor='columns' className='text-sm font-medium'>列数（1～6）</label>
              <InputNumber
                id='columns'
                name='columns'
                min={1}
                max={6}
                step={1}
                required
                defaultValue={defaultLayout.columns}
                className='min-w-0'
              />
            </div>
            <fieldset>
              <legend className='text-sm font-medium'>字号与间距</legend>
              <div className='mt-3 space-y-3'>
                <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3 gap-y-2'>
                  <label htmlFor='font-size' className='text-sm'>字号（px）</label>
                  <InputNumber id='font-size' name='fontSize' min={12} max={36} step='any' required defaultValue={defaultLayout.fontSize} className='min-w-0' />
                </div>
                <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3 gap-y-2'>
                  <label htmlFor='row-gap' className='text-sm'>行间距（mm）</label>
                  <InputNumber id='row-gap' name='rowGap' min={0} max={20} step='any' required defaultValue={defaultLayout.rowGap} className='min-w-0' />
                </div>
                <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3 gap-y-2'>
                  <label htmlFor='column-gap' className='text-sm'>列间距（mm）</label>
                  <InputNumber id='column-gap' name='columnGap' min={0} max={20} step='any' required defaultValue={defaultLayout.columnGap} className='min-w-0' />
                </div>
              </div>
            </fieldset>
          </SettingsGroup>
          {error ? (
            <p role='alert' className='text-sm text-destructive'>
              {error}预览未更新。
            </p>
          ) : null}
          <div aria-live='polite' className='rounded-lg bg-muted p-4 text-sm leading-6'>
            共 {exercises.length} 题 · {pageCount} 页<br />
            加法 {additionCount} 题 · 减法 {exercises.length - additionCount} 题
          </div>
          <Button type='submit' variant='outline' className='w-full' disabled={Boolean(error)}>
            <RefreshCw aria-hidden='true' />
            换一批题目
          </Button>
        </form>
      }
      preview={
        Array.from({ length: pageCount }, (_, pageIndex) => (
          <ArithmeticWorksheet
            key={pageIndex}
            maximum={maximum}
            exercises={exercises.slice(pageIndex * pageCapacity, (pageIndex + 1) * pageCapacity)}
            layout={layout}
            pageIndex={pageIndex}
            pageCount={pageCount}
          />
        ))
      }
    />
  )
}
