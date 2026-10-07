import { formatCompactCurrency } from "@/lib/format";
import type { ChannelShare } from "@/lib/types";

const COLORS = ["var(--accent)", "var(--ink)", "var(--chart-muted)", "var(--warning)"];
const R = 52;
const C = 2 * Math.PI * R;

export function ChannelDonut({ channels }: { channels: ChannelShare[] }) {
  const total = channels.reduce((sum, c) => sum + c.revenue, 0);
  const lengths = channels.map((c) => (c.revenue / total) * C);
  const offsets = lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0));

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row lg:flex-col xl:flex-row xl:flex-wrap xl:justify-center">
      <div className="relative size-36 shrink-0">
        <svg viewBox="0 0 128 128" className="size-full -rotate-90" aria-hidden="true">
          {channels.map((c, i) => {
            const gap = 2;
            return (
              <circle
                key={c.channel}
                cx="64"
                cy="64"
                r={R}
                fill="none"
                stroke={COLORS[i % COLORS.length]}
                strokeWidth="14"
                strokeDasharray={`${Math.max(0, lengths[i] - gap)} ${C}`}
                strokeDashoffset={-offsets[i]}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center">
          <p className="text-[11px] text-muted">Total</p>
          <p className="tabular text-lg font-semibold">{formatCompactCurrency(total)}</p>
        </div>
      </div>

      <ul className="w-full space-y-2.5 text-sm">
        {channels.map((c, i) => (
          <li key={c.channel} className="flex items-center gap-3">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="flex-1 truncate text-muted">{c.channel}</span>
            <span className="tabular font-medium">{((c.revenue / total) * 100).toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
