import type { ReactNode } from 'react'

export function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className='min-w-0 space-y-4 rounded-lg border p-4'>
      <legend className='px-1 text-sm font-semibold'>{title}</legend>
      {children}
    </fieldset>
  )
}
