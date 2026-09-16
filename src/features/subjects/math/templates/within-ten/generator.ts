export type ArithmeticOptions = {
  count: number;
  includeZero: boolean;
  additionWeight: number;
  subtractionWeight: number;
};

export type Exercise = {
  left: number;
  right: number;
  operator: "+" | "−";
};

export const defaultOptions: ArithmeticOptions = {
  count: 40,
  includeZero: false,
  additionWeight: 1,
  subtractionWeight: 1,
};

export function validateOptions(options: ArithmeticOptions): string | null {
  if (!Number.isInteger(options.count) || options.count < 10 || options.count > 300 || options.count % 10 !== 0) {
    return "题目数量请输入 10～300 之间的 10 的倍数。";
  }
  const weights = [options.additionWeight, options.subtractionWeight];
  if (weights.some((weight) => !Number.isInteger(weight) || weight < 0 || weight > 100)) {
    return "权重请输入 0～100 的整数。";
  }
  if (weights.every((weight) => weight === 0)) {
    return "加法和减法权重不能同时为 0。";
  }
  return null;
}

export function generateExercises(options: ArithmeticOptions, seed: number): Exercise[] {
  const error = validateOptions(options);
  if (error) throw new Error(error);

  // 固定种子保证首次服务端渲染和客户端预览一致。
  let state = seed >>> 0;
  function random() {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  }
  function shuffle<T>(items: T[]) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  const pools: Record<Exercise["operator"], Exercise[]> = { "+": [], "−": [] };
  const minimum = options.includeZero ? 0 : 1;
  for (let left = minimum; left <= 10; left++) {
    for (let right = minimum; right <= 10; right++) {
      if (left + right <= 10) pools["+"].push({ left, right, operator: "+" });
      if (left - right >= minimum) pools["−"].push({ left, right, operator: "−" });
    }
  }
  const additionCount = Math.round(
    options.count * options.additionWeight / (options.additionWeight + options.subtractionWeight),
  );
  const exercises: Exercise[] = [];
  for (const operator of ["+", "−"] as const) {
    const count = operator === "+" ? additionCount : options.count - additionCount;
    const pool = pools[operator];
    for (let i = 0; i < count; i++) {
      if (i % pool.length === 0) shuffle(pool);
      exercises.push(pool[i % pool.length]);
    }
  }
  return shuffle(exercises);
}
