import type { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

// Placeholder card layout — real structure, spacing, and which fields
// are actually shown (e.g. does the Figma show priority as a colored
// dot, a badge, or text?) are pending your screenshots. This gives
// TaskList something real to render against in the meantime.

const statusLabels: Record<Task['status'], string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

const priorityLabels: Record<Task['priority'], string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

const priorityColors: Record<Task['priority'], string> = {
  LOW: 'bg-muted text-muted-foreground',
  MEDIUM: 'bg-primary/10 text-primary',
  HIGH: 'bg-danger/10 text-danger',
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{task.title}</h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}
        >
          {priorityLabels[task.priority]}
        </span>
      </div>

      {task.description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="rounded-md bg-muted px-2 py-1">{statusLabels[task.status]}</span>
        {task.dueDate && (
          <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
        )}
      </div>

      <div className="flex gap-2 border-t border-border pt-3">
        <button
          onClick={() => onEdit(task)}
          className="text-xs font-medium text-primary hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-xs font-medium text-danger hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
