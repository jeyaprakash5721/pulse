import Link from "next/link";
import { Arrow } from "@/components/ui/icons";
import { ProductPreview } from "@/components/landing/product-preview";

/** A heartbeat trace: flat, spike, flat — the brand's signature line. */
const ECG =
  "M0 60 H260 l14 -10 l10 10 h22 l12 -52 l16 100 l14 -66 l10 18 h40 l12 -8 l10 8 H700 l14 -10 l10 10 h22 l12 -40 l16 76 l14 -50 l10 14 H1200";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <svg
        className="pointer-events-none absolute inset-x-0 top-24 h-32 w-full text-accent opacity-35 sm:top-28 sm:h-40"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="ecg-path"
          d={ECG}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
      </svg>

      <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-24">
        <p className="rise mx-auto flex w-fit items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-positive opacity-60" />
            <span className="relative size-2 rounded-full bg-positive" />
          </span>
          New — anomaly alerts in Slack
        </p>

        {/* The headline is the LCP element: render it immediately, no entrance animation. */}
        <h1 className="mx-auto mt-6 max-w-4xl text-center font-display text-[clamp(2.75rem,8vw,6.25rem)] leading-[0.95] tracking-tight text-ink">
          Feel the <em className="text-accent">pulse</em> of your business, in real time.
        </h1>

        <p
          className="rise mx-auto mt-6 max-w-xl text-center text-base text-muted sm:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          Revenue, users, conversion and orders in one living dashboard — with alerts that reach you before your
          customers notice something&apos;s off.
        </p>

        <div
          className="rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "240ms" }}
        >
          <a
            href="#pricing"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-medium text-accent-ink shadow-[0_8px_30px_-8px_var(--accent)] transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            Start free — 14 days
            <Arrow className="transition-transform group-hover:translate-x-0.5" width={18} height={18} />
          </a>
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center rounded-full border border-line bg-surface px-6 py-3.5 font-medium text-ink transition-colors hover:border-ink sm:w-auto"
          >
            Explore the live demo
          </Link>
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          No credit card · Setup in about 4 minutes · Cancel anytime
        </p>

        <div className="rise mt-14 sm:mt-20" style={{ animationDelay: "320ms" }}>
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
