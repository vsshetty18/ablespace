'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { TaskList } from '@/components/tasks/TaskList';
import { LoadingState } from '@/components/ui/LoadingState';

// Route guard: if there's no guest session yet, this page redirects
// back to the entry screen instead of rendering a broken task list
// with no x-user-id header to send. Kept as a simple client-side
// check rather than Next.js middleware — appropriately scoped for a
// guest-only app with no real auth to enforce server-side.
export default function TasksPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const guestId = localStorage.getItem('ablespace-guest-id');
    if (!guestId) {
      router.replace('/');
      return;
    }
    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return <LoadingState message="Checking your session..." />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6">
          <TaskList />
        </main>
      </div>
    </div>
  );
}
