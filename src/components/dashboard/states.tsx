import { Alert, Inbox, Refresh } from "@/components/ui/icons";

export function Skeleton({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`shimmer block rounded-md ${className}`} />;
}

export function ErrorState({
  message,
  onRetry,
  compact = false,
}: {
  message: string;
  onRetry: () => void;
  compact?: boolean;
}) {
  return (
    <div role="alert" className={`flex flex-col items-center justify-center text-center ${compact ? "py-8" : "py-16"}`}>
      <span className="grid size-11 place-items-center rounded-full bg-negative/10 text-negative">
        <Alert />
      </span>
      <p className="mt-4 font-medium text-ink">Couldn&apos;t load this data</p>
      <p className="mt-1 max-w-xs text-sm text-muted">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-ink"
      >
        <Refresh width={16} height={16} /> Try again
      </button>
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-surface-2 text-muted">
        <Inbox />
      </span>
      <p className="mt-4 font-medium text-ink">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-muted">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
