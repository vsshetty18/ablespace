import type { Task } from '@/types/task';

// Single source of truth for the backend URL. Set NEXT_PUBLIC_API_URL
// in Vercel's dashboard (see frontend/.env.example, coming up next).
// NEXT_PUBLIC_ prefix is required by Next.js for any env var that
// needs to be readable in the browser, not just on the server.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// Thrown by apiFetch on any non-2xx response, so callers can
// distinguish "request failed" from a JS/network error and show
// the right error message in the UI.
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Thin fetch wrapper: attaches the guest user id header automatically,
// parses JSON, and normalizes errors into ApiError. Every function
// below (getTasks, createTask, etc.) goes through this instead of
// calling fetch() directly, so error handling stays consistent
// everywhere it's used.
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const userId = typeof window !== 'undefined'
    ? localStorage.getItem('ablespace-guest-id')
    : null;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(userId ? { 'x-user-id': userId } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Something went wrong' }));
    const message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
    throw new ApiError(response.status, message ?? 'Request failed');
  }

  // DELETE returns a small confirmation object; other endpoints return
  // the resource itself — both are valid JSON, so this is safe either way.
  return response.json();
}

// --- Auth ---

export async function createGuestSession(): Promise<{ userId: string; name: string }> {
  return apiFetch('/auth/guest', { method: 'POST' });
}

// --- Tasks ---

export async function getTasks(): Promise<Task[]> {
  return apiFetch('/tasks');
}

export async function getTask(id: string): Promise<Task> {
  return apiFetch(`/tasks/${id}`);
}

export async function createTask(data: Partial<Task>): Promise<Task> {
  return apiFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  return apiFetch(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteTask(id: string): Promise<{ message: string }> {
  return apiFetch(`/tasks/${id}`, { method: 'DELETE' });
}
