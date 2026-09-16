export const defaultGridColor = '#596273'

export function WorksheetHeader({ title, description }: { title?: string; description?: string }) {
  return (
    <header data-worksheet-header className={title ? 'h-[28mm] text-[#333]' : 'flex h-[10mm] items-center text-[#333]'}>
      <div className='flex w-full items-center justify-between whitespace-nowrap text-[13px]'>
        <span>姓名：__________</span>
        <span>日期：____ 年 ____ 月 ____ 日</span>
      </div>
      {title ? <h2 className='mt-2 text-center text-[24px] font-semibold tracking-widest'>{title}</h2> : null}
      {description ? <p className='mt-2 text-center text-[12px] text-[#666]'>{description}</p> : null}
    </header>
  )
}

export function WorksheetFooter({ pageIndex = 0, pageCount = 1 }: { pageIndex?: number; pageCount?: number }) {
  return (
    <footer data-worksheet-footer className='absolute text-[12px] text-[#666]'>
      第 {pageIndex + 1} 页 / 共 {pageCount} 页
    </footer>
  )
}
