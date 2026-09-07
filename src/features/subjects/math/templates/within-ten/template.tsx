'use client'

import { useMemo, useState } from 'react'
import { BookOpenText, CalendarDays, CircleCheck, RefreshCw, Timer } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TemplateWorkspace } from '@/features/builder/template-workspace'
import { defaultOptions, generateExercises, validateOptions } from './generator'
import { defaultLayout, exerciseLineHeight, getPageCapacity, validateLayout } from './layout'

export function WithinTenTemplate() {
  const [options, setOptions] = useState(defaultOptions)
  const [layout, setLayout] = useState(defaultLayout)
  const [seed, setSeed] = useState(42)
  const [error, setError] = useState<string | null>(null)
  const exercises = useMemo(() => generateExercises(options, seed), [options, seed])
  const pageCapacity = getPageCapacity(layout)
  const pageCount = Math.ceil(exercises.length / pageCapacity)
  const additionCount = exercises.filter((exercise) => exercise.operator === '+').length

  return (
    <TemplateWorkspace
      title='10 以内加减法'
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
            const message = validateOptions(next) || validateLayout(nextLayout)
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
          <p className='text-sm leading-6 text-muted-foreground'>调整配置即可预览。运算数与结果均不超过 10，减法不出现负数。</p>
          <div>
            <label htmlFor='count' className='text-sm font-medium'>
              题目数量
            </label>
            <Input
              id='count'
              name='count'
              type='number'
              min={10}
              max={300}
              step={10}
              required
              defaultValue={defaultOptions.count}
              className='mt-2'
              aria-describedby='count-help'
            />
            <p id='count-help' className='mt-2 text-xs text-muted-foreground'>
              10～300 题，每次增减 10 题，按字号、间距和列数自动分页。
            </p>
          </div>
          <div>
            <label htmlFor='columns' className='text-sm font-medium'>列数</label>
            <Input
              id='columns'
              name='columns'
              type='number'
              min={1}
              max={6}
              step={1}
              required
              defaultValue={defaultLayout.columns}
              className='mt-2'
              aria-describedby='columns-help'
            />
            <p id='columns-help' className='mt-2 text-xs text-muted-foreground'>
              可选 1～6 列，字号和间距保持你的设置。
            </p>
          </div>
          <fieldset>
            <legend className='text-sm font-medium'>字号与间距</legend>
            <div className='mt-3 grid grid-cols-2 gap-3'>
              <div>
                <label htmlFor='font-size' className='text-sm'>字号（px）</label>
                <Input id='font-size' name='fontSize' type='number' min={12} max={36} step='any' required defaultValue={defaultLayout.fontSize} className='mt-2' />
              </div>
              <div>
                <label htmlFor='row-gap' className='text-sm'>行间距（mm）</label>
                <Input id='row-gap' name='rowGap' type='number' min={0} max={20} step='any' required defaultValue={defaultLayout.rowGap} className='mt-2' />
              </div>
              <div>
                <label htmlFor='column-gap' className='text-sm'>列间距（mm）</label>
                <Input id='column-gap' name='columnGap' type='number' min={0} max={20} step='any' required defaultValue={defaultLayout.columnGap} className='mt-2' />
              </div>
            </div>
          </fieldset>
          <div>
            <label className='flex items-center gap-3 text-sm font-medium'>
              <input name='includeZero' type='checkbox' defaultChecked={defaultOptions.includeZero} className='size-4 accent-blue-600' aria-describedby='zero-help' />
              包含 0
            </label>
            <p id='zero-help' className='mt-2 text-xs leading-5 text-muted-foreground'>
              关闭后，运算数和结果都不含 0。
            </p>
          </div>
          <fieldset>
            <legend className='text-sm font-medium'>加减法权重</legend>
            <div className='mt-3 grid grid-cols-2 gap-3'>
              <div>
                <label htmlFor='addition-weight' className='text-sm'>
                  加法
                </label>
                <Input
                  id='addition-weight'
                  name='additionWeight'
                  type='number'
                  min={0}
                  max={100}
                  step={1}
                  required
                  defaultValue={defaultOptions.additionWeight}
                  className='mt-2'
                />
              </div>
              <div>
                <label htmlFor='subtraction-weight' className='text-sm'>
                  减法
                </label>
                <Input
                  id='subtraction-weight'
                  name='subtractionWeight'
                  type='number'
                  min={0}
                  max={100}
                  step={1}
                  required
                  defaultValue={defaultOptions.subtractionWeight}
                  className='mt-2'
                />
              </div>
            </div>
            <p className='mt-2 text-xs leading-5 text-muted-foreground'>例如 2 : 1 约为两道加法配一道减法；设为 0 可排除该运算，两项不能同时为 0。</p>
          </fieldset>
          {error ? (
            <p role='alert' className='text-sm text-destructive'>
              {error}预览保留上次有效配置。
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
          <p className='text-xs leading-5 text-muted-foreground'>同类算式用完后才会重复。打印内容与当前预览一致。</p>
        </form>
      }
      preview={
        Array.from({ length: pageCount }, (_, pageIndex) => (
          <article key={pageIndex} data-worksheet-page aria-label={`第 ${pageIndex + 1} 页，共 ${pageCount} 页`} className='relative mx-auto mb-8 h-[297mm] w-[210mm] bg-white px-[14mm] py-[9mm] font-sans text-[#444] shadow-sm last:mb-0'>
            <header className='flex items-center justify-between gap-3 whitespace-nowrap text-[16px]'>
              <BookOpenText aria-hidden='true' className='size-11 shrink-0 text-[#82b9e8]' strokeWidth={1.5} />
              <div className='flex items-center gap-2'>
                <CalendarDays aria-hidden='true' className='size-6 text-[#64a9f7]' />
                <span className='rounded-md bg-[#dff3ff] px-2'>日期：___月___日</span>
              </div>
              <div className='flex items-center gap-2'>
                <Timer aria-hidden='true' className='size-6 text-[#64a9f7]' />
                <span className='rounded-md bg-[#dff3ff] px-2'>用时：___分___秒</span>
              </div>
              <div className='flex items-center gap-2'>
                <CircleCheck aria-hidden='true' className='size-6 text-[#64a9f7]' />
                <span className='rounded-md bg-[#dff3ff] px-2'>正确率：___/___</span>
              </div>
            </header>
            <div className='mt-7 flex items-center text-[18px] text-[#83baff]'>
              <h2>10以内加减法</h2>
              <span aria-hidden='true' className='ml-2 flex-1 border-t border-dashed border-[#a4ceff]' />
            </div>
            <div
              className='mt-3 grid'
              style={{
                gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
                gridAutoRows: `${layout.fontSize * exerciseLineHeight}px`,
                rowGap: `${layout.rowGap}mm`,
                columnGap: `${layout.columnGap}mm`,
                fontSize: `${layout.fontSize}px`,
                lineHeight: exerciseLineHeight,
              }}
            >
              {exercises.slice(pageIndex * pageCapacity, (pageIndex + 1) * pageCapacity).map((exercise, index) => (
                <div key={index} className='flex items-center whitespace-nowrap tracking-[0.06em] tabular-nums'>
                  {exercise.left} {exercise.operator} {exercise.right} =
                </div>
      
        ))}
          </div>
          <footer className='absolute inset-x-0 bottom-[6mm] text-center text-[18px]'>{pageIndex + 1}/{pageCount}</footer>
        </article>
        ))
      }
    />
  )
}
