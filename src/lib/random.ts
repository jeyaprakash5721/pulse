/** Small seeded PRNG (mulberry32) so mock data is stable across requests and builds. */
export function createRandom(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    between: (min: number, max: number) => min + next() * (max - min),
    int: (min: number, max: number) => Math.floor(min + next() * (max - min + 1)),
    pick: <T>(items: readonly T[]) => items[Math.floor(next() * items.length)],
    weighted: <T>(items: readonly (readonly [T, number])[]) => {
      const total = items.reduce((sum, [, w]) => sum + w, 0);
      let roll = next() * total;
      for (const [item, weight] of items) {
        roll -= weight;
        if (roll <= 0) return item;
      }
      return items[items.length - 1][0];
    },
  };
}

const DAY = 86_400_000;

/** Midnight UTC today — mock data is anchored here so it always looks current. */
export function todayUtc(): number {
  return Math.floor(Date.now() / DAY) * DAY;
}

export { DAY };
