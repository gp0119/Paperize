export type BreakTenOptions = {
  count: number;
  subtrahend: number;
};

export type Exercise = {
  left: number;
  right: number;
};

export const defaultOptions: BreakTenOptions = { count: 30, subtrahend: 0 };

export function validateOptions(options: BreakTenOptions): string | null {
  if (!Number.isInteger(options.count) || options.count < 1 || options.count > 300) {
    return '题目数量请输入 1～300 的整数。';
  }
  if (options.subtrahend !== 0 && (!Number.isInteger(options.subtrahend) || options.subtrahend < 2 || options.subtrahend > 9)) {
    return '减数请选择混合或 2～9。';
  }
  return null;
}

export function generateExercises(options: BreakTenOptions, seed: number): Exercise[] {
  const error = validateOptions(options);
  if (error) throw new Error(error);

  // 固定种子保证首次服务端渲染和客户端预览一致。
  let state = seed >>> 0;
  const pool: Exercise[] = [];
  for (let left = 11; left <= 18; left++) {
    for (let right = left - 9; right <= 9; right++) {
      if (options.subtrahend !== 0 && right !== options.subtrahend) continue;
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
