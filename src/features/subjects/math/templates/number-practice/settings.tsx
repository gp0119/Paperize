'use client'

import { useRef, useState } from 'react'
import { Dialog } from 'radix-ui'
import { Pencil, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { CheckboxField } from '@/features/builder/checkbox-field'
import { SettingsGroup } from '@/features/builder/settings-group'
import { validateContent, type NumberPracticeOptions } from './layout'

type NumberPracticeSettingsProps = {
  content: string
  onContentChange: (content: string) => void
  options: NumberPracticeOptions
  onOptionsChange: (options: NumberPracticeOptions) => void
}

const sliders = [
  ['rowHeight', '行高', 10, 24, 0.5, 'mm'],
  ['rowGap', '行间距', 0, 10, 0.5, 'mm'],
  ['fontSize', '字体大小', 40, 100, 1, '%'],
  ['verticalOffset', '上下偏移', -10, 10, 1, '%'],
  ['tracingCount', '描红格数（含示范）', 1, 40, 1, ''],
] as const

export function NumberPracticeSettings({ content, onContentChange, options, onOptionsChange }: NumberPracticeSettingsProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(content)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const error = validateContent(draft)

  return (
    <div className='space-y-4'>
      <SettingsGroup>
        <Dialog.Root open={open} onOpenChange={(next) => { if (next) setDraft(content); setOpen(next) }}>
          <Dialog.Trigger asChild>
            <button type='button' className='flex w-full items-center justify-between gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
              <span className='min-w-0'>
                <span className='block text-sm font-medium'>练习内容</span>
                <span className='mt-1 block truncate text-sm text-muted-foreground'>{content.split('\n').join(' · ')}</span>
              </span>
              <Pencil aria-hidden='true' className='size-4 shrink-0 text-muted-foreground' />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay data-print-hidden className='fixed inset-0 z-50 bg-black/40' />
            <Dialog.Content data-print-hidden onOpenAutoFocus={(event) => { event.preventDefault(); inputRef.current!.focus() }} className='fixed top-1/2 left-1/2 z-50 flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border bg-background p-6 shadow-xl'>
              <Dialog.Title className='pr-8 text-xl font-semibold'>输入内容</Dialog.Title>
              <Dialog.Description id='number-content-help' className='mt-2 text-sm text-muted-foreground'>
                每行输入一组数字，同行数字循环描红，空行保留为练习行。较长内容会自动换行、分页。
              </Dialog.Description>
              <Dialog.Close asChild>
                <Button type='button' variant='ghost' size='icon' aria-label='关闭' className='absolute top-3 right-3'><X aria-hidden='true' /></Button>
              </Dialog.Close>
              <form className='mt-4 flex min-h-0 flex-1 flex-col gap-4' onSubmit={(event) => {
                event.preventDefault()
                if (error) return
                onContentChange(draft)
                setOpen(false)
              }}>
                <label htmlFor='number-content' className='sr-only'>练习数字</label>
                <textarea
                  ref={inputRef}
                  id='number-content'
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  maxLength={2000}
                  spellCheck={false}
                  aria-invalid={Boolean(error)}
                  aria-describedby={`number-content-help${error ? ' number-content-error' : ''}`}
                  className='h-[50dvh] min-h-24 w-full resize-none rounded-md border border-input bg-background p-3 text-base leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                />
                {error ? <p id='number-content-error' role='alert' className='text-sm text-destructive'>{error}</p> : null}
                <div className='flex justify-end gap-3'>
                  <Dialog.Close asChild><Button type='button' variant='outline'>取消</Button></Dialog.Close>
                  <Button type='submit' disabled={Boolean(error)}>确定</Button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </SettingsGroup>
      <SettingsGroup>
        {([
          ['highlightFirst', '首组数字高亮'],
          ['blankRows', '插入空行'],
          ['blankColumns', '插入空列'],
          ['bold', '字体加粗'],
          ['tracingDashed', '数字虚线'],
        ] as const).map(([key, label]) => (
          <CheckboxField key={key} label={label} checked={options[key]} onChange={(event) => onOptionsChange({ ...options, [key]: event.target.checked })} />
        ))}
      </SettingsGroup>
      <SettingsGroup>
        {sliders.map(([key, label, min, max, step, unit]) => (
          <div key={key} className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-x-3'>
            <span className='text-sm font-medium'>{label}</span>
            <div className='flex min-w-0 items-center gap-3'>
              <Slider aria-label={label} min={min} max={max} step={step} value={[options[key]]} onValueChange={([value]) => onOptionsChange({ ...options, [key]: value })} />
              <span className='w-14 shrink-0 text-right text-sm tabular-nums text-muted-foreground'>{Math.round(options[key] * 10) / 10}{unit}</span>
            </div>
          </div>
        ))}
      </SettingsGroup>
      <SettingsGroup>
        {([['tracingColor', '描红颜色'], ['gridColor', '线条颜色']] as const).map(([key, label]) => (
          <label key={key} className='flex items-center justify-between text-sm font-medium'>
            {label}
            <input type='color' value={options[key]} onChange={(event) => onOptionsChange({ ...options, [key]: event.target.value })} className='h-9 w-14 cursor-pointer rounded-md border border-input p-1' />
          </label>
        ))}
      </SettingsGroup>
    </div>
  )
}
