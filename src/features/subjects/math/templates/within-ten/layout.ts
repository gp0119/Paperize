export type WorksheetLayout = {
  columns: number;
  fontSize: number;
  rowGap: number;
  columnGap: number;
};

export const defaultLayout: WorksheetLayout = {
  columns: 3,
  fontSize: 20,
  rowGap: 3.2,
  columnGap: 8,
};

// A4 预留页眉、标题和页脚后的题目区域，单位为 mm。
const contentHeight = 232;
const contentWidth = 182;
export const exerciseLineHeight = 1.5;

export function validateLayout(layout: WorksheetLayout): string | null {
  if (!Number.isInteger(layout.columns) || layout.columns < 1 || layout.columns > 6) {
    return '列数请输入 1～6 的整数。';
  }
  if (!Number.isFinite(layout.fontSize) || layout.fontSize < 12 || layout.fontSize > 36) {
    return '字号请输入 12～36 px。';
  }
  if ([layout.rowGap, layout.columnGap].some((gap) => !Number.isFinite(gap) || gap < 0 || gap > 20)) {
    return '间距请输入 0～20 mm。';
  }
  const columnWidthPx = (contentWidth - (layout.columns - 1) * layout.columnGap) / layout.columns * (96 / 25.4);
  if (columnWidthPx < layout.fontSize * 6) {
    return '每列空间不足以容纳算式和答案，请减少列数、字号或列间距。';
  }
  return null;
}

export function getPageCapacity(layout: WorksheetLayout): number {
  const lineHeightMm = layout.fontSize * exerciseLineHeight * (25.4 / 96);
  const rows = Math.floor((contentHeight + layout.rowGap) / (lineHeightMm + layout.rowGap));
  return rows * layout.columns;
}
