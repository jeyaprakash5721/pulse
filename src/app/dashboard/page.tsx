import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Dashboard } from "@/components/dashboard/dashboard";
import { Bell, Bolt, Grid, LogoMark, Receipt, Settings } from "@/components/ui/icons";
import { Skeleton } from "@/components/dashboard/states";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Live revenue, users, conversion and orders for Pulse Labs.",
};

const sidebar = [
  { label: "Overview", href: "#", icon: Grid, active: true },
  { label: "Revenue", href: "#revenue", icon: Bolt },
  { label: "Transactions", href: "#transactions", icon: Receipt },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line px-4 py-5 lg:flex">
        <Link href="/" className="flex items-center gap-2 px-2 text-ink">
          <LogoMark />
          <span className="text-lg font-semibold tracking-tight">Pulse</span>
        </Link>
        <nav aria-label="Dashboard" className="mt-8 space-y-1">
          {sidebar.map(({ label, href, icon: Icon, active }) => (
            <a
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                active ? "bg-surface font-medium text-ink shadow-sm" : "text-muted hover:bg-surface hover:text-ink"
              }`}
            >
              <Icon width={18} height={18} />
              {label}
            </a>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-ink p-4 text-bg">
          <p className="text-sm font-medium">Anomaly alerts</p>
          <p className="mt-1 text-xs text-bg/70">Get pinged in Slack the moment a metric drifts.</p>
          <span className="mt-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-ink">
            Growth plan
          </span>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-line bg-bg/85 px-4 backdrop-blur-md sm:px-6">
          <Link href="/" className="flex items-center gap-2 lg:hidden" aria-label="Pulse home">
            <LogoMark width={24} height={24} />
            <span className="font-semibold tracking-tight">Pulse</span>
          </Link>
          <p className="hidden items-center gap-2 text-sm text-muted lg:flex">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-positive opacity-60" />
              <span className="relative size-2 rounded-full bg-positive" />
            </span>
            Live · Pulse Labs workspace
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid size-9 place-items-center rounded-full text-muted hover:bg-surface hover:text-ink"
            >
              <Bell width={18} height={18} />
              <span className="absolute top-2 right-2 size-1.5 rounded-full bg-accent" />
            </button>
            <button
              type="button"
              aria-label="Settings"
              className="grid size-9 place-items-center rounded-full text-muted hover:bg-surface hover:text-ink"
            >
              <Settings width={18} height={18} />
            </button>
            <span
              className="ml-2 grid size-8 place-items-center rounded-full bg-ink text-xs font-semibold text-bg"
              aria-label="Signed in as Jordan Doe"
            >
              JD
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <Suspense fallback={<DashboardFallback />}>
            <Dashboard />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function DashboardFallback() {
  return (
    <div className="space-y-5" aria-busy="true">
      <Skeleton className="h-12 w-48" />
      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  );
}
