'use client'

import { useTemplateSettings, validMargins, validTracingOptions } from '@/features/builder/use-template-settings'

import { useRef, useState } from 'react'
import { Dialog } from 'radix-ui'
import { Pencil, X } from 'lucide-react'

import { TracingSettings } from '@/features/builder/tracing-settings'

import { Button } from '@/components/ui/button'
import { SettingsGroup } from '@/features/builder/settings-group'
import { defaultPageVisibility } from '@/features/builder/page-visibility'
import { defaultPageMargins } from '@/features/builder/page-margins'
import { TemplateWorkspace } from '@/features/builder/template-workspace'
import { defaultOptions, validatePage, paginateCharacters, parseCharacters, type CharacterStrokes } from './layout'
import { sampleCharacters } from './sample'
import { StrokeOrderWorksheet } from './worksheet'

export function StrokeOrderTemplate() {
  const { settings, updateSettings, restored, storageError } = useTemplateSettings('chinese/stroke-order', {
    visibility: defaultPageVisibility,
    margins: defaultPageMargins,
    options: defaultOptions,
    characters: sampleCharacters,
  }, (saved) => validMargins(saved.margins)
    && validTracingOptions(saved.options)
    && saved.characters.length > 0 && saved.characters.length <= 40
    && saved.characters.every((entry) => parseCharacters(entry.character).length === 1 && entry.strokes.length > 0)
    && !validatePage(saved.characters, saved.margins, saved.visibility, saved.options))
  const { visibility, margins, options, characters } = settings
  const setVisibility = (visibility: typeof settings.visibility) => updateSettings({ visibility })
  const setMargins = (margins: typeof settings.margins) => updateSettings({ margins })
  const setOptions = (options: typeof settings.options) => updateSettings({ options })
  const setCharacters = (characters: typeof settings.characters) => updateSettings({ characters })
  const [text, setText] = useState('永山水木')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [layoutError, setLayoutError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pages = paginateCharacters(characters, margins, visibility, options)
  const inputCharacters = parseCharacters(text)

  async function generate() {
    if (!inputCharacters.length || inputCharacters.length > 40) {
      setError('请输入 1～40 个汉字，空格、标点和其他字符会自动忽略。')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/strokes?characters=${encodeURIComponent(inputCharacters.join(''))}`)
      if (!response.ok) throw new Error('笔顺数据加载失败，请重试。')
      const data: { character: string; strokes: string[] | null }[] = await response.json()
      const missing = data.filter((entry) => !entry.strokes).map((entry) => entry.character)
      if (missing.length) throw new Error(`暂未收录这些字的笔顺：${missing.join('、')}。请替换后重试。`)
      const byCharacter = new Map(data.map((entry) => [entry.character, entry.strokes!]))
      const next = inputCharacters.map((character): CharacterStrokes => ({ character, strokes: byCharacter.get(character)! }))
      const message = validatePage(next, margins, visibility, options)
      if (message) throw new Error(message)
      setCharacters(next)
      setOpen(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : '生成失败，请重试。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <TemplateWorkspace key={String(restored)} storageError={storageError} visibility={visibility} onVisibilityChange={(next) => { const message = validatePage(characters, margins, next, options); setLayoutError(message); if (!message) setVisibility(next) }} margins={margins} onMarginsChange={setMargins} validateMargins={(next) => validatePage(characters, next, visibility, options)} title='笔顺字帖' configuration={
      <div className='space-y-6'>
        <SettingsGroup>
          <Dialog.Root open={open} onOpenChange={(next) => {
            if (loading) return
            if (next) {
              setText(characters.map((entry) => entry.character).join(''))
              setError(null)
            }
            setOpen(next)
          }}>
            <Dialog.Trigger asChild>
              <button type='button' className='flex w-full items-center justify-between gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
                <span className='min-w-0'>
                  <span className='block text-sm font-medium'>自定义汉字</span>
                  <span className='mt-1 block truncate text-sm text-muted-foreground'>{characters.map((entry) => entry.character).join('')}</span>
                </span>
                <Pencil aria-hidden='true' className='size-4 shrink-0 text-muted-foreground' />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay data-print-hidden className='fixed inset-0 z-50 bg-black/40' />
              <Dialog.Content data-print-hidden onOpenAutoFocus={(event) => { event.preventDefault(); inputRef.current!.focus() }} className='fixed top-1/2 left-1/2 z-50 flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-xl border bg-background p-6 shadow-xl'>
                <Dialog.Title className='pr-8 text-xl font-semibold'>自定义汉字</Dialog.Title>
                <Dialog.Description id='characters-help' className='mt-2 text-sm text-muted-foreground'>请输入 1～40 个汉字，空格、标点和其他字符会自动忽略。</Dialog.Description>
                <Dialog.Close asChild>
                  <Button type='button' variant='ghost' size='icon' disabled={loading} aria-label='关闭' className='absolute top-3 right-3'><X aria-hidden='true' /></Button>
                </Dialog.Close>
                <form className='mt-4 flex min-h-0 flex-1 flex-col gap-4' aria-busy={loading} onSubmit={(event) => { event.preventDefault(); if (!loading) void generate() }}>
                  <label htmlFor='characters' className='sr-only'>练习汉字</label>
                  <textarea ref={inputRef} id='characters' value={text} onChange={(event) => { setText(event.target.value); setError(null) }} disabled={loading} rows={6} maxLength={1000} spellCheck={false} aria-invalid={Boolean(error)} aria-describedby={`characters-help characters-count${error ? ' characters-error' : ''}`} className='min-h-24 w-full resize-none rounded-md border border-input bg-background p-3 text-base leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50' />
                  <p id='characters-count' className='text-xs text-muted-foreground'>{inputCharacters.length} / 40 字</p>
                  {error ? <p id='characters-error' role='alert' className='text-sm text-destructive'>{error}预览未更新。</p> : null}
                  <div className='flex justify-end gap-3'>
                    <Dialog.Close asChild><Button type='button' variant='outline' disabled={loading}>取消</Button></Dialog.Close>
                    <Button type='submit' disabled={loading}>{loading ? '正在生成…' : '确定并生成'}</Button>
                  </div>
                </form>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </SettingsGroup>
        <TracingSettings options={options} onChange={(next) => { const message = validatePage(characters, margins, visibility, next); setLayoutError(message); if (!message) setOptions(next) }} />
        {layoutError ? <p role='alert' className='text-sm text-destructive'>{layoutError}</p> : null}
        <p className='text-xs text-muted-foreground'>笔顺数据：<a href='https://github.com/chanind/hanzi-writer-data' className='underline'>Hanzi Writer Data</a>（Arphic Public License）</p>
      </div>
    } preview={pages.map((page, index) => <StrokeOrderWorksheet margins={margins} key={index} characters={page} pageIndex={index} pageCount={pages.length} options={options} />)} />
  )
}
