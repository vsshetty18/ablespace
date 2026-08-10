import { createGuestSession } from './api';

const STORAGE_KEY = 'ablespace-guest-id';
const NAME_KEY = 'ablespace-guest-name';

// Returns the existing guest id from localStorage if one exists,
// otherwise calls the backend to create a new guest session and
// stores it. This is what makes "guest login" persist across a
// refresh within the same browser (not across devices/browsers —
// see the tradeoff note in auth.service.ts).
export async function getOrCreateGuestId(): Promise<{ userId: string; name: string }> {
  const existingId = localStorage.getItem(STORAGE_KEY);
  const existingName = localStorage.getItem(NAME_KEY);

  if (existingId && existingName) {
    return { userId: existingId, name: existingName };
  }

  const session = await createGuestSession();
  localStorage.setItem(STORAGE_KEY, session.userId);
  localStorage.setItem(NAME_KEY, session.name);

  return session;
}

export function getGuestName(): string | null {
  return localStorage.getItem(NAME_KEY);
}

export function clearGuestSession(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(NAME_KEY);
}
