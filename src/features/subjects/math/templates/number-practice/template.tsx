'use client'

import { useTemplateSettings, validMargins, validColor } from '@/features/builder/use-template-settings'

import { TemplateWorkspace } from '@/features/builder/template-workspace'
import { NumberPracticeWorksheet } from './worksheet'
import { defaultContent, defaultOptions, validateContent, getLayout, numberPracticeMargins, numberPracticeVisibility, paginateContent } from './layout'
import { NumberPracticeSettings } from './settings'

export function NumberPracticeTemplate() {
  const { settings, updateSettings, restored, storageError } = useTemplateSettings('math/number-practice', {
    margins: numberPracticeMargins,
    visibility: numberPracticeVisibility,
    content: defaultContent,
    options: defaultOptions,
  }, (saved) => validMargins(saved.margins)
    && !validateContent(saved.content)
    && saved.options.rowHeight >= 10 && saved.options.rowHeight <= 24
    && saved.options.rowGap >= 0 && saved.options.rowGap <= 10
    && saved.options.fontSize >= 40 && saved.options.fontSize <= 100
    && saved.options.verticalOffset >= -10 && saved.options.verticalOffset <= 10
    && Number.isInteger(saved.options.tracingCount) && saved.options.tracingCount >= 1 && saved.options.tracingCount <= 40
    && validColor(saved.options.tracingColor) && validColor(saved.options.gridColor))
  const { margins, visibility, content, options } = settings
  const setMargins = (margins: typeof settings.margins) => updateSettings({ margins })
  const setVisibility = (visibility: typeof settings.visibility) => updateSettings({ visibility })
  const setContent = (content: typeof settings.content) => updateSettings({ content })
  const setOptions = (options: typeof settings.options) => updateSettings({ options })

  const { columns, rows } = getLayout(options, margins, visibility)
  const pages = paginateContent(content, options, columns, rows)

  return (
    <TemplateWorkspace key={String(restored)} storageError={storageError}
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
