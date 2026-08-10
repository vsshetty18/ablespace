// Mirrors the backend's Prisma enums and Task model exactly (see
// backend/prisma/schema.prisma) so the frontend and backend never
// drift out of sync on what a valid task looks like.

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null; // ISO string over the wire; parsed to Date only where displayed
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Shape used when creating/editing a task in TaskForm — a subset of
// Task without server-generated fields (id, timestamps, userId).
export interface TaskFormValues {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}
