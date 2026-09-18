'use client'

import { useTemplateSettings, validMargins, validTracingOptions } from '@/features/builder/use-template-settings'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { defaultPageMargins } from '@/features/builder/page-margins'
import { TracingSettings } from '@/features/builder/tracing-settings'
import { SettingsGroup } from '@/features/builder/settings-group'
import { TemplateWorkspace } from '@/features/builder/template-workspace'
import { penPatterns } from './patterns'
import { defaultOptions, PatternPath, PenControlWorksheet, penControlVisibility } from './worksheet'

export function PenControlTemplate() {
  const { settings, updateSettings, restored, storageError } = useTemplateSettings('chinese/pen-control', {
    visibility: penControlVisibility,
    margins: defaultPageMargins,
    options: defaultOptions,
    patterns: penPatterns.slice(0, 6),
  }, (saved) => validMargins(saved.margins)
    && validTracingOptions(saved.options)
    && saved.patterns.length <= 200
    && saved.patterns.every((pattern) => penPatterns.some((known) => JSON.stringify(known) === JSON.stringify(pattern))))
  const { visibility, margins, options, patterns } = settings
  const setVisibility = (visibility: typeof settings.visibility) => updateSettings({ visibility })
  const setMargins = (margins: typeof settings.margins) => updateSettings({ margins })
  const setOptions = (options: typeof settings.options) => updateSettings({ options })
  const setPatterns = (patterns: typeof settings.patterns) => updateSettings({ patterns })
  const [selected, setSelected] = useState<number | null>(null)
  const content = patterns.map((pattern) => pattern.name).join(' ')

  function movePattern(index: number, target: number) {
    const next = [...patterns]
    ;[next[index], next[target]] = [next[target], next[index]]
    setPatterns(next)
    setSelected(target)
  }

  return (
    <TemplateWorkspace key={String(restored)} storageError={storageError} title='控笔练习' hasTitle={false} visibility={visibility} onVisibilityChange={setVisibility}
      margins={margins} onMarginsChange={setMargins}
      configuration={
        <div className='space-y-4'>
          <SettingsGroup>
            <div className='flex items-center justify-between'>
              <span id='pen-pattern-label' className='text-sm font-medium'>练习图案</span>
              <button type='button' className='rounded px-2 py-1 text-sm text-muted-foreground hover:bg-muted focus-visible:outline-2' onClick={() => { setPatterns([]); setSelected(null) }}>清空</button>
            </div>
            <div role='group' aria-labelledby='pen-pattern-label' aria-describedby='pen-pattern-help'
              className='flex max-h-56 min-h-28 flex-wrap content-start gap-1 overflow-y-auto rounded-md border border-input p-2'>
              {patterns.map((pattern, index) => (
                <button key={index} type='button' title={`第 ${index + 1} 行：${pattern.name}`} aria-label={`第 ${index + 1} 行：${pattern.name}`}
                  aria-pressed={selected === index} onClick={() => setSelected(index)}
                  className='size-10 shrink-0 rounded p-1 text-slate-500 hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring aria-pressed:bg-accent aria-pressed:ring-1 aria-pressed:ring-ring'>
                  <svg viewBox='0 0 100 100' className='size-full' fill='none' stroke='currentColor' strokeWidth={3} strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                    <PatternPath pattern={pattern} />
                  </svg>
                </button>
              ))}
              {!patterns.length ? <span className='p-1 text-sm text-muted-foreground'>点击下方图案添加练习</span> : null}
            </div>
            <div className='flex items-center gap-2'>
              <Button type='button' variant='outline' size='icon' aria-label='前移选中图案' title='前移' disabled={selected === null || selected === 0}
                onClick={() => { if (selected !== null) movePattern(selected, selected - 1) }}><ArrowLeft /></Button>
              <Button type='button' variant='outline' size='icon' aria-label='后移选中图案' title='后移' disabled={selected === null || selected === patterns.length - 1}
                onClick={() => { if (selected !== null) movePattern(selected, selected + 1) }}><ArrowRight /></Button>
              <Button type='button' variant='outline' size='icon' aria-label='删除选中图案' title='删除' disabled={selected === null}
                onClick={() => { setPatterns(patterns.filter((_, index) => index !== selected)); setSelected(null) }}><Trash2 /></Button>
              <span className='ml-auto text-xs text-muted-foreground'>{patterns.length} / 200</span>
            </div>
            <p id='pen-pattern-help' className='text-xs text-muted-foreground'>点击下方图案添加，每个图案练习一行。选中已添加的图案，可前移、后移或删除。</p>
            <div className='grid grid-cols-6 gap-2'>
              {penPatterns.map((pattern) => (
                <button key={pattern.name} type='button' title={pattern.name} aria-label={`添加${pattern.name}`}
                  disabled={patterns.length >= 200}
                  className='flex aspect-square items-center justify-center rounded-md border border-input bg-background p-1.5 text-slate-500 hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50'
                  onClick={() => { setPatterns([...patterns, pattern]); setSelected(patterns.length) }}>
                  <svg viewBox='0 0 100 100' className='size-full' fill='none' stroke='currentColor' strokeWidth={3} strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                    <PatternPath pattern={pattern} />
                  </svg>
                </button>
              ))}
            </div>
          </SettingsGroup>
          <TracingSettings options={options} onChange={setOptions} />
        </div>
      }
      preview={<PenControlWorksheet content={content} options={options} margins={margins} visibility={visibility} />}
    />
  )
}
