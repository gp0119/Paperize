const lineSpacing = 4
const groupGap = 6
const groupCount = 14
const lineStrokeWidth = 0.15
const worksheetWidth = 182
const worksheetHeight = 246.25
const svgWidth = worksheetWidth + lineStrokeWidth

export function BlankFourLineWorksheet() {
  return (
    <article
      data-worksheet-page
      aria-label='空白英语四线三格练习纸，第 1 页，共 1 页'
      className='mx-auto mb-8 h-[297mm] w-[210mm] bg-white px-[14mm] pt-[20mm] shadow-sm last:mb-0'
    >
      <svg
        viewBox={`-${lineStrokeWidth / 2} 0 ${svgWidth} ${worksheetHeight}`}
        style={{ width: `${svgWidth}mm`, height: `${worksheetHeight}mm` }}
        className='block'
        role='img'
        aria-label='14 组空白英语四线三格，每组 4 条等距横线'
      >
        {Array.from({ length: groupCount }, (_, group) => {
          const groupOffset = group * ((lineSpacing * 3) + groupGap) + lineStrokeWidth / 2

          return (
            <g key={group} fill='none' stroke='#dedede' strokeWidth={lineStrokeWidth}>
              {Array.from({ length: 4 }, (_, line) => (
                <path
                  key={line}
                  d={`M 0 ${groupOffset + line * lineSpacing} H ${worksheetWidth}`}
                  stroke={line === 2 ? '#f6d9ce' : undefined}
                />
              ))}
            </g>
          )
        })}
      </svg>
    </article>
  )
}
