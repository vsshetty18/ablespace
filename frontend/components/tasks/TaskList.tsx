'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ApiError } from '@/lib/api';
import type { Task, TaskFormValues } from '@/types/task';

export function TaskList() {
  const { tasks, isLoading, error, refetch, addTask, editTask, removeTask } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function openCreateModal() {
    setEditingTask(null);
    setIsModalOpen(true);
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingTask(null);
  }

  async function handleSubmit(values: TaskFormValues) {
    if (editingTask) {
      await editTask(editingTask.id, values);
    } else {
      await addTask(values);
    }
    closeModal();
  }

  async function handleDelete(id: string) {
    setDeleteError(null);
    try {
      await removeTask(id);
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : 'Failed to delete task');
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading your tasks..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">My Tasks</h1>
        <Button onClick={openCreateModal}>+ New Task</Button>
      </div>

      {deleteError && <ErrorState message={deleteError} />}

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Create your first task to get started."
          action={<Button onClick={openCreateModal}>+ New Task</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <TaskForm
          initialValues={editingTask ?? undefined}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
