'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { getOrCreateGuestId } from '@/lib/guest';
import { ApiError } from '@/lib/api';

// Placeholder entry-screen layout — real branding/copy/imagery pending
// Figma screenshots. Functionally complete: this is the only place
// that creates a new guest session.
export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGuestLogin() {
    setIsLoading(true);
    setError(null);
    try {
      await getOrCreateGuestId();
      router.push('/tasks');
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not start a session. Please check your connection and try again.',
      );
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-foreground">AbleSpace</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          A simple task management app. Continue as a guest to get started —
          no account needed.
        </p>
      </div>

      {error && <ErrorState message={error} onRetry={handleGuestLogin} />}

      <Button size="lg" onClick={handleGuestLogin} isLoading={isLoading}>
        Continue as Guest
      </Button>
    </main>
  );
}
