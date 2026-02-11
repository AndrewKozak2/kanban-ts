import { useState } from "react";
import { type Task } from "../../types/todo";
import { type Priority } from "../../types/todo";
import "./TaskCard.css";

type TaskCardProps = {
  task: Task;
  onStatusChange: (id: string, newStatus: Task["status"]) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newTitle: string) => void;
};

const PRIORITY_CLASSES: Record<Priority, string> = {
  low: "priority-low",
  medium: "priority-medium",
  high: "priority-high",
};

export const TaskCard = ({
  task,
  onStatusChange,
  onDelete,
  onUpdate,
}: TaskCardProps) => {
  function handleDragStart(e: React.DragEvent<HTMLDivElement>, id: string) {
    e.dataTransfer.setData("taskId", id);
  }
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  return (
    <div
      className="task-card"
      draggable={true}
      onDragStart={(e) => handleDragStart(e, task.id)}
    >
      <div className="task-header">
        {isEditing ? (
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            autoFocus
            onBlur={() => {
              setIsEditing(false);
              onUpdate(task.id, editedTitle);
            }}
            className="edit-input"
          />
        ) : (
          <h3 onClick={() => setIsEditing(true)}>{task.title}</h3>
        )}

        <button
          className="delete-btn"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          ×
        </button>
      </div>
      <div className="task-meta">
        <span className={PRIORITY_CLASSES[task.priority]}>{task.priority}</span>
        <span className="task-date">{task.createdAt}</span>
      </div>

      <select
        onChange={(e) =>
          onStatusChange(task.id, e.target.value as Task["status"])
        }
        value={task.status}
        className="status-select"
      >
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
};
