'use client'

import { useState } from 'react'

import { Slider } from '@/components/ui/slider'

type SliderFieldProps = {
  name: string
  label: string
  min: number
  max: number
  step: number
  defaultValue: number
}

export function SliderField({ name, label, min, max, step, defaultValue }: SliderFieldProps) {
  const [value, setValue] = useState(defaultValue)

  return (
    <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-x-3'>
      <span className='text-sm font-medium'>{label}</span>
      <div className='flex min-w-0 items-center gap-3'>
        <Slider
          name={name}
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={([next]) => setValue(next)}
        />
        <span className='w-10 shrink-0 text-right text-sm tabular-nums text-muted-foreground'>{value}</span>
      </div>
    </div>
  )
}
