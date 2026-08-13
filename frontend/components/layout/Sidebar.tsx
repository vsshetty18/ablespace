'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
}

// Placeholder nav structure — the assessment only strictly requires a
// task management view, so this currently has a single real route.
// Once the Figma shows the actual navigation (multiple sections? just
// one?), this list is the only thing that needs to change.
const navItems: NavItem[] = [
  { label: 'Tasks', href: '/tasks' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col gap-1 border-r border-border bg-surface p-4 md:flex">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
