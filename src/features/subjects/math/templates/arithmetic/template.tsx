'use client'

import { useTemplateSettings, validMargins } from '@/features/builder/use-template-settings'

import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CheckboxField } from '@/features/builder/checkbox-field'
import { SettingsGroup } from '@/features/builder/settings-group'
import { SliderField } from '@/features/builder/slider-field'
import { defaultPageVisibility } from '@/features/builder/page-visibility'
import { defaultPageMargins } from '@/features/builder/page-margins'
import { TemplateWorkspace } from '@/features/builder/template-workspace'
import { defaultOptions, generateExercises, validateOptions } from './generator'
import { defaultLayout, getPageCapacity, validateLayout } from './layout'
import { ArithmeticWorksheet } from './worksheet'

export function ArithmeticTemplate({ maximum }: { maximum: 10 | 20 }) {
  const { settings, updateSettings, restored, storageError } = useTemplateSettings(`math/within-${maximum}`, {
    visibility: defaultPageVisibility,
    margins: defaultPageMargins,
    options: defaultOptions,
    layout: defaultLayout,
    seed: 42,
  }, (saved) => validMargins(saved.margins)
    && !validateOptions(saved.options) && !validateLayout(saved.layout, saved.margins, maximum)
    && Number.isInteger(saved.seed) && saved.seed >= 0 && saved.seed <= 4294967295)
  const { visibility, margins, options, layout, seed } = settings
  const setVisibility = (visibility: typeof settings.visibility) => updateSettings({ visibility })
  const setMargins = (margins: typeof settings.margins) => updateSettings({ margins })
  const setOptions = (options: typeof settings.options) => updateSettings({ options })
  const setLayout = (layout: typeof settings.layout) => updateSettings({ layout })
  const setSeed = (seed: typeof settings.seed) => updateSettings({ seed })
  const [error, setError] = useState<string | null>(null)
  const exercises = useMemo(() => generateExercises(options, seed, maximum), [options, seed, maximum])
  const pageCapacity = getPageCapacity(layout, margins, visibility)
  const pageCount = Math.ceil(exercises.length / pageCapacity)

  return (
    <TemplateWorkspace key={String(restored)} storageError={storageError} visibility={visibility} onVisibilityChange={setVisibility} margins={margins} onMarginsChange={setMargins} validateMargins={(next) => validateLayout(layout, next, maximum)}
      title={`${maximum} 以内加减法`}
      configuration={
        <form
          className='space-y-6'
          onChange={(event) => {
            const data = new FormData(event.currentTarget)
            const number = (name: string) => (data.get(name) === '' ? NaN : Number(data.get(name)))
            const next = {
              count: number('count'),
              includeZero: data.has('includeZero'),
              additionWeight: number('additionWeight'),
              subtractionWeight: number('subtractionWeight'),
            }
            const nextLayout = {
              columns: number('columns'),
              fontSize: number('fontSize'),
              rowGap: number('rowGap'),
              columnGap: number('columnGap'),
            }
            const message = validateOptions(next) || validateLayout(nextLayout, margins, maximum)
            setError(message)
            if (!message) {
              setOptions(next)
              setLayout(nextLayout)
            }
          }}
          onSubmit={(event) => {
            event.preventDefault()
            if (!error) setSeed(Math.floor(Math.random() * 4294967296))
          }}
        >
          <SettingsGroup>
            <SliderField name='count' label='题目数量' min={10} max={300} step={10} defaultValue={options.count} />
            <CheckboxField name='includeZero' label='包含 0（算式和结果）' defaultChecked={options.includeZero} />
            <SliderField name='additionWeight' label='加法比例' min={0} max={100} step={1} defaultValue={options.additionWeight} />
            <SliderField name='subtractionWeight' label='减法比例' min={0} max={100} step={1} defaultValue={options.subtractionWeight} />
          </SettingsGroup>
          <SettingsGroup>
            <SliderField name='columns' label='列数' min={1} max={6} step={1} defaultValue={layout.columns} />
            <SliderField name='fontSize' label='字号（px）' min={12} max={36} step={0.5} defaultValue={layout.fontSize} />
            <SliderField name='rowGap' label='行间距（mm）' min={0} max={20} step={0.1} defaultValue={layout.rowGap} />
            <SliderField name='columnGap' label='列间距（mm）' min={0} max={20} step={0.1} defaultValue={layout.columnGap} />
          </SettingsGroup>
          {error ? (
            <p role='alert' className='text-sm text-destructive'>
              {error}预览未更新。
            </p>
          ) : null}
          <Button type='submit' variant='outline' className='w-full' disabled={Boolean(error)}>
            <RefreshCw aria-hidden='true' />
            换一批题目
          </Button>
        </form>
      }
      preview={
        Array.from({ length: pageCount }, (_, pageIndex) => (
          <ArithmeticWorksheet
            key={pageIndex}
            maximum={maximum}
            exercises={exercises.slice(pageIndex * pageCapacity, (pageIndex + 1) * pageCapacity)}
            layout={layout}
            pageIndex={pageIndex}
            pageCount={pageCount}
          />
        ))
      }
    />
  )
}
