export type MakeTenOptions = {
  count: number;
  firstAddend: number;
};

export type Exercise = {
  left: number;
  right: number;
};

export const defaultOptions: MakeTenOptions = { count: 30, firstAddend: 0 };

export function validateOptions(options: MakeTenOptions): string | null {
  if (!Number.isInteger(options.count) || options.count < 1 || options.count > 300) {
    return '题目数量请输入 1～300 的整数。';
  }
  if (options.firstAddend !== 0 && (!Number.isInteger(options.firstAddend) || options.firstAddend < 2 || options.firstAddend > 9)) {
    return '第一加数请选择混合或 2～9。';
  }
  return null;
}

export function generateExercises(options: MakeTenOptions, seed: number): Exercise[] {
  const error = validateOptions(options);
  if (error) throw new Error(error);

  // 固定种子保证首次服务端渲染和客户端预览一致。
  let state = seed >>> 0;
  const pool: Exercise[] = [];
  for (let left = 2; left <= 9; left++) {
    if (options.firstAddend !== 0 && left !== options.firstAddend) continue;
    for (let right = 11 - left; right <= 9; right++) {
      pool.push({ left, right });
    }
  }
  const exercises: Exercise[] = [];
  while (exercises.length < options.count) {
    for (let i = pool.length - 1; i > 0; i--) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      const j = Math.floor(state / 4294967296 * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    exercises.push(...pool.slice(0, options.count - exercises.length));
  }
  return exercises;
}
