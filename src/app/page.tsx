import Link from 'next/link'
import { ArrowRight, BookOpenText, Calculator, Languages, LayoutTemplate } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'

const subjectCards = [
  {
    href: '/worksheets/chinese',
    name: '语文',
    description: '字帖与田字格',
    icon: BookOpenText,
    iconClassName: 'bg-blue-50 text-blue-600',
  },
  {
    href: '/worksheets/math',
    name: '数学',
    description: '10 以内加减法',
    icon: Calculator,
    iconClassName: 'bg-orange-50 text-orange-600',
  },
  {
    href: '/worksheets/english',
    name: '英语',
    description: '四线三格练习',
    icon: Languages,
    iconClassName: 'bg-emerald-50 text-emerald-600',
  },
] as const

export default function Home() {
  return (
    <main className='paper-grid flex flex-1'>
      <section className='mx-auto grid w-full max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-24'>
        <div>
          <p className='text-sm font-medium tracking-[0.18em] text-muted-foreground'>语文 · 数学 · 英语练习</p>
          <h1 className='mt-6 text-5xl font-semibold tracking-tighter text-foreground sm:text-6xl'>
            把每一次练习，
            <span className='mt-2 block text-slate-500'>变成看得见的进步。</span>
          </h1>
          <p className='mt-7 max-w-xl text-lg leading-8 text-muted-foreground'>选择语文、数学或英语模板，调整内容和排版，预览后打印成 A4 练习纸。</p>

          <div className='mt-9 flex flex-wrap items-center gap-3'>
            <Link href='/worksheets/math' className={buttonVariants({ variant: 'default', size: 'lg' })}>
              制作数学练习
              <ArrowRight aria-hidden='true' />
            </Link>
            <Link href='#subjects' className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              查看全部模板
            </Link>
          </div>

          <div className='mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground'>
            <span>语文描红</span>
            <span aria-hidden='true' className='h-4 w-px bg-border' />
            <span>10 以内口算</span>
            <span aria-hidden='true' className='h-4 w-px bg-border' />
            <span>英语四线三格</span>
          </div>
        </div>

        <div id='subjects' className='rounded-3xl border bg-background/90 p-4 shadow-xl shadow-slate-200/50 sm:p-5'>
          <div className='rounded-2xl border border-dashed border-blue-400 bg-blue-50/60 p-5 sm:p-6'>
            <div className='flex items-center gap-3'>
              <span className='flex size-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm'>
                <LayoutTemplate aria-hidden='true' className='size-5' />
              </span>
              <div>
                <h2 className='font-semibold'>练习模板示例</h2>
                <p className='mt-1 text-sm text-muted-foreground'>描红、口算和英语书写，从模板开始。</p>
              </div>
            </div>

            <div className='mt-5 grid grid-cols-3 gap-3'>
              <div>
                <div className='aspect-square rounded-xl bg-white p-2 shadow-sm'>
                  <svg viewBox='0 0 100 100' role='img' aria-label='描红示例：沿田字格中的山字轮廓书写' focusable='false' className='block size-full'>
                    <rect x='0.5' y='0.5' width='99' height='99' fill='none' stroke='currentColor' strokeWidth='1' className='text-blue-300' />
                    <path d='M 50 0 V 100 M 0 50 H 100' fill='none' stroke='currentColor' strokeWidth='0.6' strokeDasharray='3 3' className='text-blue-300' />
                    <text x='50' y='50' textAnchor='middle' dominantBaseline='middle' fill='none' stroke='currentColor' strokeWidth='1.2' strokeDasharray='3 2' className='text-rose-400 text-[52px] font-semibold'>山</text>
                  </svg>
                </div>
                <p className='mt-2 text-center text-xs font-medium text-muted-foreground'>描红</p>
              </div>
              <div>
                <div className='aspect-square rounded-xl bg-white p-2 shadow-sm'>
                  <svg viewBox='0 0 100 100' role='img' aria-label='10以内减法口算示例：6减2等于空格' focusable='false' className='block size-full'>
                    <text x='50' y='43' textAnchor='middle' className='fill-slate-700 text-[26px] font-semibold'>6 − 2</text>
                    <path d='M 30 60 H 70 V 82 H 30 Z' fill='none' stroke='currentColor' strokeWidth='1.5' className='text-orange-300' />
                  </svg>
                </div>
                <p className='mt-2 text-center text-xs font-medium text-muted-foreground'>口算</p>
              </div>
              <div>
                <div className='aspect-square rounded-xl bg-white p-2 shadow-sm'>
                  <svg viewBox='0 0 100 100' role='img' aria-label='英语四线三格书写示例：小写字母 b' focusable='false' className='block size-full'>
                    <path d='M 8 28 H 92 M 8 42 H 92 M 8 58 H 92 M 8 72 H 92' fill='none' stroke='currentColor' strokeWidth='1' className='text-emerald-300' />
                    <text x='50' y='60' textAnchor='middle' className='fill-emerald-600 text-[42px] font-medium'>b</text>
                  </svg>
                </div>
                <p className='mt-2 text-center text-xs font-medium text-muted-foreground'>英语书写</p>
              </div>
            </div>
          </div>

          <div className='mt-4 grid gap-3 sm:grid-cols-3'>
            {subjectCards.map((subject) => {
              const Icon = subject.icon

              return (
                <Link
                  key={subject.href}
                  href={subject.href}
                  className='group flex items-center gap-3 rounded-2xl border bg-background p-4 outline-none transition-colors hover:border-foreground/20 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50'
                >
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${subject.iconClassName}`}>
                    <Icon aria-hidden='true' className='size-5' />
                  </span>
                  <span className='min-w-0 flex-1'>
                    <span className='block font-medium'>{subject.name}</span>
                    <span className='mt-1 block text-xs text-muted-foreground'>{subject.description}</span>
                  </span>
                  <ArrowRight aria-hidden='true' className='size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5' />
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
