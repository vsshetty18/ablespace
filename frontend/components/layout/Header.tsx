'use client';

import { useEffect, useState } from 'react';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';
import { getGuestName } from '@/lib/guest';

// Placeholder layout — real header structure (logo placement, nav items,
// exact spacing) pending Figma screenshots. Functionally complete:
// shows the guest's name and the theme toggle.
export function Header() {
  const [guestName, setGuestName] = useState<string | null>(null);

  useEffect(() => {
    // Read after mount only — localStorage isn't available during
    // server render, and this avoids a hydration mismatch.
    setGuestName(getGuestName());
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-foreground">AbleSpace</span>
      </div>

      <div className="flex items-center gap-3">
        {guestName && (
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {guestName}
          </span>
        )}
        <ThemeSwitcher />
      </div>
    </header>
  );
}
