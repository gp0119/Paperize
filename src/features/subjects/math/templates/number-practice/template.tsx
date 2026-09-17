'use client'

import { useState } from 'react'

import { TemplateWorkspace } from '@/features/builder/template-workspace'
import { NumberPracticeWorksheet } from './worksheet'
import { defaultContent, defaultOptions, getLayout, numberPracticeMargins, numberPracticeVisibility, paginateContent } from './layout'
import { NumberPracticeSettings } from './settings'

export function NumberPracticeTemplate() {
  const [margins, setMargins] = useState(numberPracticeMargins)
  const [visibility, setVisibility] = useState(numberPracticeVisibility)

  const [content, setContent] = useState(defaultContent)
  const [options, setOptions] = useState(defaultOptions)
  const { columns, rows } = getLayout(options, margins, visibility)
  const pages = paginateContent(content, options, columns, rows)

  return (
    <TemplateWorkspace
      title='数字练习'
      hasTitle={false}
      margins={margins}
      onMarginsChange={setMargins}
      visibility={visibility}
      onVisibilityChange={setVisibility}
      configuration={<NumberPracticeSettings content={content} onContentChange={setContent} options={options} onOptionsChange={setOptions} />}
      preview={pages.map((lines, pageIndex) => <NumberPracticeWorksheet key={pageIndex} margins={margins} visibility={visibility} options={options} lines={lines} pageIndex={pageIndex} pageCount={pages.length} />)}
    />
  )
}
