'use client'

import { useState } from 'react'

import { Select } from '@/components/ui/select'
import { SettingsGroup } from '@/features/builder/settings-group'
import { defaultPageMargins } from '@/features/builder/page-margins'
import { TemplateWorkspace } from '@/features/builder/template-workspace'
import { defaultLayout, getGridDimensions, gridTypes, validateLayout, type GridLayout } from './layout'
import { BlankTianZiGeWorksheet } from './worksheet'

export function BlankTianZiGeTemplate() {
  const [margins, setMargins] = useState(defaultPageMargins)
  const [layout, setLayout] = useState(defaultLayout)
  const [error, setError] = useState<string | null>(null)
  const { rows, columns } = getGridDimensions(layout, margins)

  return (
    <TemplateWorkspace margins={margins} onMarginsChange={setMargins}
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
              color: String(data.get('color')),
            }
            const message = validateLayout(next)
            setError(message)
            if (!message) setLayout(next)
          }}
        >
          <SettingsGroup title='格子'>
            <div>
              <label htmlFor='grid-type' className='text-sm font-medium'>方格类型</label>
              <Select id='grid-type' name='gridType' defaultValue={defaultLayout.gridType} className='mt-2'
                options={gridTypes.map((type) => ({ value: type, label: type }))}
              />
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
            <div className='flex items-center justify-between'>
              <label htmlFor='grid-color' className='text-sm font-medium'>格子颜色</label>
              <input id='grid-color' name='color' type='color' defaultValue={defaultLayout.color} className='h-9 w-14 cursor-pointer rounded-md border border-input p-1' />
            </div>
          </SettingsGroup>
          {error ? <p role='alert' className='text-sm text-destructive'>{error}预览未更新。</p> : null}
          <div aria-live='polite' className='rounded-lg bg-muted p-4 text-sm leading-6'>
            {rows} 行 × {columns} 列 · {rows * columns} 格
          </div>
        </form>
      }
      preview={<BlankTianZiGeWorksheet layout={layout} margins={margins} />}
    />
  )
}
