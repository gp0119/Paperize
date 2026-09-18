'use client'

import { useTemplateSettings, validMargins } from '@/features/builder/use-template-settings'

import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { CheckboxField } from '@/features/builder/checkbox-field'
import { SettingsGroup } from '@/features/builder/settings-group'
import { SliderField } from '@/features/builder/slider-field'
import { defaultPageVisibility } from '@/features/builder/page-visibility'
import { defaultPageMargins } from '@/features/builder/page-margins'
import { TemplateWorkspace } from '@/features/builder/template-workspace'
import { defaultOptions, generateExercises, validateOptions } from './generator'
import { defaultLayout, getPageCapacity, validateLayout } from '../make-ten/layout'
import { BreakTenWorksheet } from './worksheet'

export function BreakTenTemplate() {
  const { settings, updateSettings, restored, storageError } = useTemplateSettings('math/break-ten', {
    visibility: defaultPageVisibility,
    margins: defaultPageMargins,
    options: defaultOptions,
    layout: defaultLayout,
    showAnswers: false,
    seed: 42,
  }, (saved) => validMargins(saved.margins)
    && !validateOptions(saved.options) && !validateLayout(saved.layout)
    && Number.isInteger(saved.seed) && saved.seed >= 0 && saved.seed <= 4294967295)
  const { visibility, margins, options, layout, showAnswers, seed } = settings
  const setVisibility = (visibility: typeof settings.visibility) => updateSettings({ visibility })
  const setMargins = (margins: typeof settings.margins) => updateSettings({ margins })
  const setOptions = (options: typeof settings.options) => updateSettings({ options })
  const setLayout = (layout: typeof settings.layout) => updateSettings({ layout })
  const setShowAnswers = (showAnswers: typeof settings.showAnswers) => updateSettings({ showAnswers })
  const setSeed = (seed: typeof settings.seed) => updateSettings({ seed })
  const [error, setError] = useState<string | null>(null)
  const exercises = useMemo(() => generateExercises(options, seed), [options, seed])
  const pageCapacity = getPageCapacity(layout, margins, visibility)
  const pageCount = Math.ceil(exercises.length / pageCapacity)

  return (
    <TemplateWorkspace key={String(restored)} storageError={storageError} visibility={visibility} onVisibilityChange={setVisibility} margins={margins} onMarginsChange={setMargins}
      title='破十法'
      configuration={
        <form
          className='space-y-6'
          onChange={(event) => {
            const data = new FormData(event.currentTarget)
            const number = (name: string) => (data.get(name) === '' ? NaN : Number(data.get(name)))
            const next = { count: number('count'), subtrahend: number('subtrahend') }
            const nextLayout = { columns: number('columns'), rowGap: number('rowGap') }
            const message = validateOptions(next) || validateLayout(nextLayout)
            setError(message)
            if (!message) {
              setOptions(next)
              setLayout(nextLayout)
              setShowAnswers(data.has('showAnswers'))
            }
          }}
          onSubmit={(event) => {
            event.preventDefault()
            if (!error) setSeed(Math.floor(Math.random() * 4294967296))
          }}
        >
          <SettingsGroup>
            <SliderField name='count' label='题目数量' min={1} max={300} step={1} defaultValue={options.count} />
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-x-3 gap-y-2'>
              <label htmlFor='subtrahend' className='text-sm font-medium'>减数</label>
              <Select id='subtrahend' name='subtrahend' defaultValue={String(options.subtrahend)} className='min-w-0'
                options={[
                  { value: '0', label: '混合练习（2～9）' },
                  ...Array.from({ length: 8 }, (_, index) => {
                    const value = index + 2
                    return { value: String(value), label: `十几 − ${value}` }
                  }),
                ]}
              />
            </div>
            <CheckboxField name='showAnswers' label='显示答案（含分解数）' defaultChecked={showAnswers} />
          </SettingsGroup>
          <SettingsGroup>
            <SliderField name='columns' label='列数' min={1} max={3} step={1} defaultValue={layout.columns} />
            <SliderField name='rowGap' label='行间距（mm）' min={0} max={20} step={0.1} defaultValue={layout.rowGap} />
          </SettingsGroup>
          {error ? <p role='alert' className='text-sm text-destructive'>{error}预览未更新。</p> : null}
          <Button type='submit' variant='outline' className='w-full' disabled={Boolean(error)}>
            <RefreshCw aria-hidden='true' />
            换一批题目
          </Button>
        </form>
      }
      preview={Array.from({ length: pageCount }, (_, pageIndex) => (
        <BreakTenWorksheet
          key={pageIndex}
          exercises={exercises.slice(pageIndex * pageCapacity, (pageIndex + 1) * pageCapacity)}
          layout={layout} margins={margins}
          showAnswers={showAnswers}
          pageIndex={pageIndex}
          pageCount={pageCount}
        />
      ))}
    />
  )
}
