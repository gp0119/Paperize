'use client'

import { Select } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { CheckboxField } from './checkbox-field'
import { SettingsGroup } from './settings-group'

export type TracingOptions = {
  cellSize: number
  rowGap: number
  tracingCount: number
  color: string
  tracingColor: string
  tracingWidth: string
  tracingDashed: boolean
  blankRows: boolean
}

export function TracingSettings({ options, onChange }: { options: TracingOptions; onChange: (options: TracingOptions) => void }) {
  return (
    <SettingsGroup>
      {([
        { name: 'cellSize', label: '方格大小（mm）', min: 8, max: 25, step: 0.5 },
        { name: 'rowGap', label: '行间距（mm）', min: 0, max: 10, step: 0.5 },
        { name: 'tracingCount', label: '每行描红数量', min: 0, max: 25, step: 1 },
      ] as const).map(({ name, label, min, max, step }) => (
        <div key={name} className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-x-3'>
          <span className='text-sm font-medium'>{label}</span>
          <div className='flex min-w-0 items-center gap-3'>
            <Slider aria-label={label} min={min} max={max} step={step} value={[options[name]]}
              onValueChange={([value]) => onChange({ ...options, [name]: value })} />
            <span className='w-10 shrink-0 text-right text-sm tabular-nums text-muted-foreground'>{options[name]}</span>
          </div>
        </div>
      ))}
      {([['color', '方格颜色'], ['tracingColor', '描红颜色']] as const).map(([name, label]) => (
        <div key={name} className='flex items-center justify-between'>
          <label htmlFor={`tracing-${name}`} className='text-sm font-medium'>{label}</label>
          <input id={`tracing-${name}`} type='color' value={options[name]} onChange={(event) => onChange({ ...options, [name]: event.target.value })}
            className='h-9 w-14 cursor-pointer rounded-md border border-input p-1' />
        </div>
      ))}
      <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3'>
        <label htmlFor='tracing-tracing-width' className='text-sm font-medium'>描红粗细</label>
        <Select id='tracing-tracing-width' value={options.tracingWidth} onValueChange={(value) => onChange({ ...options, tracingWidth: value })}
          options={[{ value: '0.8', label: '细' }, { value: '1.2', label: '常规' }, { value: '2', label: '粗' }]} />
      </div>
      <CheckboxField label='图案虚线' checked={options.tracingDashed} onChange={(event) => onChange({ ...options, tracingDashed: event.target.checked })} />
      <CheckboxField label='插入空行' checked={options.blankRows} onChange={(event) => onChange({ ...options, blankRows: event.target.checked })} />
    </SettingsGroup>
  )
}
