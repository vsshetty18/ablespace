import { Button } from './Button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

// Used whenever an ApiError bubbles up from lib/api.ts (see useTasks
// hook, coming up) — shows the actual backend error message where
// available, with an optional retry action.
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-danger/30 bg-danger/5 py-16 text-center">
      <p className="text-sm font-medium text-danger">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
