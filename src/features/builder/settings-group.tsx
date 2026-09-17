import type { ReactNode } from 'react'

export function SettingsGroup({ children }: { children: ReactNode }) {
  return (
    <fieldset className='min-w-0 divide-y divide-border rounded-xl bg-background shadow-sm *:min-h-14 *:px-4 *:py-2'>
      {children}
    </fieldset>
  )
}
