'use client'

import { useState } from 'react'

import { defaultPageVisibility } from '@/features/builder/page-visibility'
import { defaultPageMargins } from '@/features/builder/page-margins'
import { TemplateWorkspace } from '@/features/builder/template-workspace'

import { SettingsGroup } from '@/features/builder/settings-group'
import { Slider } from '@/components/ui/slider'

import { defaultOptions, BlankFourLineWorksheet } from './worksheet'

export function BlankFourLineTemplate() {
  const [options, setOptions] = useState(defaultOptions)
  const [visibility, setVisibility] = useState(defaultPageVisibility)
  const [margins, setMargins] = useState(defaultPageMargins)
  return (
    <TemplateWorkspace visibility={visibility} onVisibilityChange={setVisibility} hasTitle={false} margins={margins} onMarginsChange={setMargins}
      title='空白四线三格'
      configuration={
        <SettingsGroup>
          {([
            ['cellSize', '线格大小（mm）', 6, 25],
            ['rowGap', '行间距（mm）', 0, 10],
          ] as const).map(([name, label, min, max]) => (
            <div key={name} className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-x-3'>
              <span className='text-sm font-medium'>{label}</span>
              <div className='flex min-w-0 items-center gap-3'>
                <Slider aria-label={label} min={min} max={max} step={0.5} value={[options[name]]} onValueChange={([value]) => setOptions({ ...options, [name]: value })} />
                <span className='w-10 shrink-0 text-right text-sm tabular-nums text-muted-foreground'>{options[name]}</span>
              </div>
            </div>
          ))}
          {([['color', '线条颜色'], ['baselineColor', '基线颜色']] as const).map(([name, label]) => (
            <label key={name} className='flex items-center justify-between text-sm font-medium'>
              {label}
              <input type='color' value={options[name]} onChange={(event) => setOptions({ ...options, [name]: event.target.value })} className='h-9 w-14 cursor-pointer rounded-md border border-input p-1' />
            </label>
          ))}
        </SettingsGroup>
      }
      preview={<BlankFourLineWorksheet options={options} margins={margins} visibility={visibility} />}
    />
  )
}
