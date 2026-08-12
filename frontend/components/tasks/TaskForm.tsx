'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/lib/api';
import type { Task, TaskFormValues } from '@/types/task';

interface TaskFormProps {
  initialValues?: Task;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel: () => void;
}

const statusOptions = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
];

const priorityOptions = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

// Shared between "create task" and "edit task" — if initialValues is
// passed, the form is pre-filled and acts as an edit; otherwise it's
// a blank create form. Avoids maintaining two near-identical forms.
export function TaskForm({ initialValues, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [status, setStatus] = useState(initialValues?.status ?? 'TODO');
  const [priority, setPriority] = useState(initialValues?.priority ?? 'MEDIUM');
  const [dueDate, setDueDate] = useState(
    initialValues?.dueDate ? initialValues.dueDate.slice(0, 10) : '',
  );

  const [titleError, setTitleError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitError(null);

    // Client-side check for the one truly required field — mirrors the
    // backend's @IsNotEmpty() on CreateTaskDto, but catches it instantly
    // without a round trip. The backend still re-validates independently;
    // this is a UX improvement, not the actual security/data boundary.
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    setTitleError(null);

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status: status as Task['status'],
        priority: priority as Task['priority'],
        dueDate: dueDate || undefined,
      });
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={titleError ?? undefined}
        placeholder="e.g. Finish assessment write-up"
      />

      <Input
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional details"
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Status"
          options={statusOptions}
          value={status}
          onChange={(e) => setStatus(e.target.value as Task['status'])}
        />
        <Select
          label="Priority"
          options={priorityOptions}
          value={priority}
          onChange={(e) => setPriority(e.target.value as Task['priority'])}
        />
      </div>

      <Input
        label="Due date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      {submitError && <p className="text-sm text-danger">{submitError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialValues ? 'Save changes' : 'Create task'}
        </Button>
      </div>
    </form>
  );
}
