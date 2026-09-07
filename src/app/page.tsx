import Link from 'next/link'
import { ArrowRight, BookOpenText, Calculator, Languages, LayoutTemplate } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'

const subjectCards = [
  {
    href: '/worksheets/chinese',
    name: '语文',
    description: '进入语文模板',
    icon: BookOpenText,
    iconClassName: 'bg-blue-50 text-blue-600',
  },
  {
    href: '/worksheets/math',
    name: '数学',
    description: '进入数学模板',
    icon: Calculator,
    iconClassName: 'bg-orange-50 text-orange-600',
  },
  {
    href: '/worksheets/english',
    name: '英语',
    description: '进入英语模板',
    icon: Languages,
    iconClassName: 'bg-emerald-50 text-emerald-600',
  },
] as const

export default function Home() {
  return (
    <main className='paper-grid flex flex-1'>
      <section className='mx-auto grid w-full max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-24'>
        <div>
          <p className='text-sm font-medium tracking-[0.18em] text-muted-foreground'>题目生成 · 练习制作 · 即时打印</p>
          <h1 className='mt-6 text-5xl font-semibold tracking-tighter text-foreground sm:text-6xl'>
            练习题，
            <span className='mt-2 block'>生成就能打印。</span>
          </h1>
          <p className='mt-7 max-w-xl text-lg leading-8 text-muted-foreground'>从内置模板开始，调整题目配置并同步查看纸张效果，为孩子快速准备语文、数学和英语练习。</p>

          <div className='mt-9 flex flex-wrap items-center gap-3'>
            <Link href='/worksheets/math' className={buttonVariants({ variant: 'default', size: 'lg' })}>
              开始创建
              <ArrowRight aria-hidden='true' />
            </Link>
            <Link href='#subjects' className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              浏览科目
            </Link>
          </div>

          <div className='mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground'>
            <span>三科入口</span>
            <span aria-hidden='true' className='h-4 w-px bg-border' />
            <span>即时预览</span>
            <span aria-hidden='true' className='h-4 w-px bg-border' />
            <span>A4 打印</span>
          </div>
        </div>

        <div id='subjects' className='rounded-3xl border bg-background/90 p-4 shadow-xl shadow-slate-200/50 sm:p-5'>
          <div className='rounded-2xl border border-dashed border-blue-400 bg-blue-50/60 p-5 sm:p-6'>
            <div className='flex items-center gap-3'>
              <span className='flex size-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm'>
                <LayoutTemplate aria-hidden='true' className='size-5' />
              </span>
              <div>
                <h2 className='font-semibold'>练习工作台</h2>
                <p className='mt-1 text-sm text-muted-foreground'>选择模板 · 调整配置 · 即时预览</p>
              </div>
            </div>

            <div className='mt-5 grid grid-cols-3 gap-3'>
              <div className='flex aspect-square items-center justify-center rounded-xl border border-blue-100 bg-white text-lg font-semibold text-slate-700 shadow-sm'>拼 音</div>
              <div className='flex aspect-square items-center justify-center rounded-xl border border-blue-100 bg-white text-lg font-semibold text-slate-700 shadow-sm'>7 + 5</div>
              <div className='flex aspect-square items-center justify-center rounded-xl border border-blue-100 bg-white text-xl font-semibold text-slate-700 shadow-sm'>A a</div>
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
