export interface Point {
  x: number;
  y: number;
}

/** Map values onto a width×height box (y grows downward), leaving `pad` px headroom. */
export function project(values: number[], width: number, height: number, max = Math.max(...values), pad = 4): Point[] {
  const step = values.length > 1 ? width / (values.length - 1) : 0;
  const scale = max > 0 ? (height - pad) / max : 0;
  return values.map((v, i) => ({ x: i * step, y: height - v * scale }));
}

/** Smooth monotone-ish curve through points (Catmull-Rom → cubic Bézier, clamped tension). */
export function linePath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0].x},${points[0].y}`;
  let d = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const t = 0.18;
    const c1x = p1.x + (p2.x - p0.x) * t;
    const c1y = p1.y + (p2.y - p0.y) * t;
    const c2x = p2.x - (p3.x - p1.x) * t;
    const c2y = p2.y - (p3.y - p1.y) * t;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

export function areaPath(points: Point[], height: number): string {
  if (points.length === 0) return "";
  const last = points[points.length - 1];
  return `${linePath(points)} L${last.x.toFixed(1)},${height} L${points[0].x.toFixed(1)},${height} Z`;
}

/** A "nice" axis maximum and evenly spaced ticks (1/2/2.5/5 × 10ⁿ steps). */
export function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0];
  const rough = max / count;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= rough) ?? rough;
  const ticks: number[] = [];
  for (let v = 0; v <= max + step * 0.999; v += step) ticks.push(v);
  return ticks;
}
