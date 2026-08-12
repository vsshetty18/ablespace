import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'AbleSpace | Task Management',
  description: 'A task management application built for the AbleSpace technical assessment.',
};

// This inline script runs BEFORE React hydrates and before the page
// paints. It reads the saved theme from localStorage and sets
// data-theme on <html> immediately — this is what actually prevents
// a flash of the wrong theme on refresh, not ThemeProvider itself
// (which only syncs React state to match, after the fact).
const themeInitScript = `
  (function () {
    try {
      var stored = localStorage.getItem('ablespace-theme');
      var theme = stored === 'dark' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
