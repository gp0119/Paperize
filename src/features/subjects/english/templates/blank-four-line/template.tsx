'use client'

import { useState } from 'react'

import { defaultPageMargins } from '@/features/builder/page-margins'
import { TemplateWorkspace } from '@/features/builder/template-workspace'

import { BlankFourLineWorksheet } from './worksheet'

export function BlankFourLineTemplate() {
  const [margins, setMargins] = useState(defaultPageMargins)
  return (
    <TemplateWorkspace margins={margins} onMarginsChange={setMargins}
      title='空白四线三格'
      configuration={null}
      preview={<BlankFourLineWorksheet margins={margins} />}
    />
  )
}
