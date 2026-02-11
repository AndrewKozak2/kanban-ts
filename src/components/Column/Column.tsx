import { useState } from "react";
import { type Task } from "../../types/todo";
import { type Priority } from "../../types/todo";
import "./Column.css";

type ColumnProps = {
  title: string;
  status: Task["status"];
  tasks: Task[];
  onStatusChange: (id: string, newStatus: Task["status"]) => void;
  onDelete: (id: string) => void;
};

const PRIORITY_CLASSES: Record<Priority, string> = {
  low: "priority-low",
  medium: "priority-medium",
  high: "priority-high",
};

export const Column = ({
  title,
  tasks,
  onStatusChange,
  onDelete,
  status,
}: ColumnProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, id: string) {
    e.dataTransfer.setData("taskId", id);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDraggingOver(true);
  }

  function handleDragLeave() {
    setIsDraggingOver(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      onStatusChange(taskId, status);
      setIsDraggingOver(false);
    }
  }

  return (
    <div
      className={isDraggingOver ? "column drag-over" : "column"}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      <h2> {title}</h2>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="task-card"
          draggable={true}
          onDragStart={(e) => handleDragStart(e, task.id)}
        >
          <div className="task-header">
            <h3>{task.title}</h3>
            <button
              className="delete-btn"
              onClick={() => onDelete(task.id)}
              aria-label="Delete task"
            >
              ×
            </button>
          </div>

          <div className="task-meta">
            <span className={PRIORITY_CLASSES[task.priority]}>
              {task.priority}
            </span>
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
      ))}
    </div>
  );
};
