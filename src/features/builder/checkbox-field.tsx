import type { ComponentProps } from 'react'

type CheckboxFieldProps = Omit<ComponentProps<'input'>, 'type' | 'className'> & {
  label: string
}

export function CheckboxField({ label, ...props }: CheckboxFieldProps) {
  return (
    <label className='grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 text-sm font-medium'>
      {label}
      <input type='checkbox' className='size-4 accent-slate-900' {...props} />
    </label>
  )
}
