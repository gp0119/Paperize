import { TemplateWorkspace } from '@/features/builder/template-workspace'

import { BlankFourLineWorksheet } from './worksheet'

export function BlankFourLineTemplate() {
  return (
    <TemplateWorkspace
      title='空白四线三格'
      configuration={
        <p className='text-sm leading-6 text-muted-foreground'>
          固定 A4 纵向单页，无预填内容。
        </p>
      }
      preview={<BlankFourLineWorksheet />}
    />
  )
}
