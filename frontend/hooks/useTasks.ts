'use client';

import { useState, useEffect, useCallback } from 'react';
import * as api from '@/lib/api';
import { ApiError } from '@/lib/api';
import type { Task, TaskFormValues } from '@/types/task';

interface UseTasksResult {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addTask: (values: TaskFormValues) => Promise<void>;
  editTask: (id: string, values: TaskFormValues) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
}

// Central place for all task state + API interaction. TaskList/TaskForm
// consume this hook rather than calling lib/api.ts directly — keeps
// data-fetching and mutation logic out of the components themselves,
// so components stay focused on rendering.
export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function addTask(values: TaskFormValues) {
    const newTask = await api.createTask(values);
    // Optimistic-ish update: append the server-confirmed task rather than
    // refetching the whole list — avoids an extra round trip.
    setTasks((prev) => [newTask, ...prev]);
  }

  async function editTask(id: string, values: TaskFormValues) {
    const updated = await api.updateTask(id, values);
    setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
  }

  async function removeTask(id: string) {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  return { tasks, isLoading, error, refetch: fetchTasks, addTask, updateTask: editTask, removeTask } as unknown as UseTasksResult;
}
