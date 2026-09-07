'use client'

import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { TemplateWorkspace } from '@/features/builder/template-workspace'
import { defaultLayout, getGridDimensions, gridTypes, validateLayout, type GridLayout } from './layout'
import { BlankTianZiGeWorksheet } from './worksheet'

export function BlankTianZiGeTemplate() {
  const [layout, setLayout] = useState(defaultLayout)
  const [error, setError] = useState<string | null>(null)
  const { rows, columns } = getGridDimensions(layout)

  return (
    <TemplateWorkspace
      title='空白田字格'
      configuration={
        <form
          className='space-y-6'
          onSubmit={(event) => event.preventDefault()}
          onChange={(event) => {
            const data = new FormData(event.currentTarget)
            const number = (name: string) => data.get(name) === '' ? NaN : Number(data.get(name))
            const next: GridLayout = {
              gridType: data.get('gridType') as GridLayout['gridType'],
              cellSize: number('cellSize'),
              rowGap: number('rowGap'),
              marginTop: number('marginTop'),
              marginRight: number('marginRight'),
              marginBottom: number('marginBottom'),
              marginLeft: number('marginLeft'),
              color: String(data.get('color')),
            }
            const message = validateLayout(next)
            setError(message)
            if (!message) setLayout(next)
          }}
        >
          <p className='text-sm leading-6 text-muted-foreground'>调整配置即可预览，按方格大小和页边距自动排满一页。</p>
          <div>
            <label htmlFor='grid-type' className='text-sm font-medium'>方格类型</label>
            <select id='grid-type' name='gridType' defaultValue={defaultLayout.gridType} className='mt-2 h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
              {gridTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <div className='flex items-center justify-between text-sm'>
              <label htmlFor='cell-size' className='font-medium'>方格大小</label>
              <output htmlFor='cell-size'>{layout.cellSize} mm</output>
            </div>
            <input id='cell-size' name='cellSize' type='range' min={8} max={25} step={0.5} defaultValue={defaultLayout.cellSize} className='mt-3 w-full accent-slate-900' />
          </div>
          <div>
            <div className='flex items-center justify-between text-sm'>
              <label htmlFor='row-gap' className='font-medium'>行间距</label>
              <output htmlFor='row-gap'>{layout.rowGap} mm</output>
            </div>
            <input id='row-gap' name='rowGap' type='range' min={0} max={10} step={0.5} defaultValue={defaultLayout.rowGap} className='mt-3 w-full accent-slate-900' />
          </div>
          <fieldset>
            <legend className='text-sm font-medium'>页边距（mm）</legend>
            <div className='mt-3 grid grid-cols-2 gap-3'>
              {([
                ['marginTop', '上'], ['marginRight', '右'], ['marginBottom', '下'], ['marginLeft', '左'],
              ] as const).map(([name, label]) => (
                <div key={name}>
                  <label htmlFor={name} className='text-sm'>{label}</label>
                  <Input id={name} name={name} type='number' min={5} max={30} step={0.5} required defaultValue={defaultLayout[name]} className='mt-2' />
                </div>
              ))}
            </div>
          </fieldset>
          <div className='flex items-center justify-between'>
            <label htmlFor='grid-color' className='text-sm font-medium'>格子颜色</label>
            <input id='grid-color' name='color' type='color' defaultValue={defaultLayout.color} className='h-9 w-14 cursor-pointer rounded-md border border-input p-1' />
          </div>
          {error ? <p role='alert' className='text-sm text-destructive'>{error}预览保留上次有效配置。</p> : null}
          <div aria-live='polite' className='rounded-lg bg-muted p-4 text-sm leading-6'>
            A4 纵向 · 1 页 · {rows * columns} 格<br />
            每行 {columns} 格，共 {rows} 行
          </div>
          <p className='text-xs leading-5 text-muted-foreground'>保留姓名和日期栏，底部仅显示页码。打印内容与当前预览一致。</p>
        </form>
      }
      preview={<BlankTianZiGeWorksheet layout={layout} />}
    />
  )
}
