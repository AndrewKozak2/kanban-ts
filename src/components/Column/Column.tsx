import { type Task } from "../../types/todo";
import { type Priority } from "../../types/todo";
import "./Column.css";

type ColumnProps = {
  title: string;
  tasks: Task[];
  onStatusChange: (id: string, newStatus: Task["status"]) => void;
};

const PRIORITY_CLASSES: Record<Priority, string> = {
  low: "priority-low",
  medium: "priority-medium",
  high: "priority-high",
};

export const Column = ({ title, tasks, onStatusChange }: ColumnProps) => {
  return (
    <div className="column">
      <h2> {title}</h2>
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <div className="task-header">
            {" "}
            <h3>{task.title}</h3>
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
