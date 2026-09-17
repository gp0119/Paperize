'use client'

import { useState } from 'react'

import { Select } from '@/components/ui/select'
import { SettingsGroup } from '@/features/builder/settings-group'
import { SliderField } from '@/features/builder/slider-field'
import { defaultPageVisibility } from '@/features/builder/page-visibility'
import { defaultPageMargins } from '@/features/builder/page-margins'
import { TemplateWorkspace } from '@/features/builder/template-workspace'
import { defaultLayout, gridTypes, validateLayout, type GridLayout } from './layout'
import { BlankTianZiGeWorksheet } from './worksheet'

export function BlankTianZiGeTemplate() {
  const [visibility, setVisibility] = useState(defaultPageVisibility)
  const [margins, setMargins] = useState(defaultPageMargins)
  const [layout, setLayout] = useState(defaultLayout)
  const [error, setError] = useState<string | null>(null)

  return (
    <TemplateWorkspace visibility={visibility} onVisibilityChange={setVisibility} hasTitle={false} margins={margins} onMarginsChange={setMargins}
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
          <SettingsGroup>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3 gap-y-2'>
              <label htmlFor='grid-type' className='text-sm font-medium'>方格类型</label>
              <Select id='grid-type' name='gridType' defaultValue={defaultLayout.gridType} className='min-w-0'
                options={gridTypes.map((type) => ({ value: type, label: type }))}
              />
            </div>
            <SliderField name='cellSize' label='方格大小（mm）' min={8} max={25} step={0.5} defaultValue={defaultLayout.cellSize} />
            <SliderField name='rowGap' label='行间距（mm）' min={0} max={10} step={0.5} defaultValue={defaultLayout.rowGap} />
            <div className='flex items-center justify-between'>
              <label htmlFor='grid-color' className='text-sm font-medium'>格子颜色</label>
              <input id='grid-color' name='color' type='color' defaultValue={defaultLayout.color} className='h-9 w-14 cursor-pointer rounded-md border border-input p-1' />
            </div>
          </SettingsGroup>
          {error ? <p role='alert' className='text-sm text-destructive'>{error}预览未更新。</p> : null}
        </form>
      }
      preview={<BlankTianZiGeWorksheet layout={layout} margins={margins} visibility={visibility} />}
    />
  )
}
