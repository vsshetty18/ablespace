interface LoadingStateProps {
  message?: string;
}

// A simple spinner + message — no skeleton-loading library. Skeletons
// would be a nicer polish once the real task-card layout is known from
// Figma; a spinner is the correct minimal choice before that's settled.
export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div
        className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary"
        role="status"
        aria-label="Loading"
      />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
