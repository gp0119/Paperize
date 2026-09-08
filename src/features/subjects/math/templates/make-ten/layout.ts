export type WorksheetLayout = {
  columns: number;
  rowGap: number;
};

export const defaultLayout: WorksheetLayout = { columns: 3, rowGap: 6 };
export const columnGap = 8;
export const diagramWidth = 360;
export const diagramHeight = 270;

export function validateLayout(layout: WorksheetLayout): string | null {
  if (!Number.isInteger(layout.columns) || layout.columns < 1 || layout.columns > 3) {
    return '列数请输入 1～3 的整数。';
  }
  if (!Number.isFinite(layout.rowGap) || layout.rowGap < 0 || layout.rowGap > 20) {
    return '行间距请输入 0～20 mm。';
  }
  return null;
}

export function getExerciseHeight(layout: WorksheetLayout): number {
  return (182 - (layout.columns - 1) * columnGap) / layout.columns * diagramHeight / diagramWidth;
}

export function getPageCapacity(layout: WorksheetLayout): number {
  // A4 预留页眉、标题和页脚后的题目区域，单位为 mm。
  return Math.floor((232 + layout.rowGap) / (getExerciseHeight(layout) + layout.rowGap)) * layout.columns;
}
