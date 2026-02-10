import { type Task } from "../types/todo";

type ColumnProps = {
  title: string;
  tasks: Task[];
  onStatusChange: (id: string, newStatus: Task["status"]) => void;
};

export const Column = ({ title, tasks, onStatusChange }: ColumnProps) => {
  return (
    <div className="column">
      <h2> {title}</h2>
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <h3>{task.title}</h3>
          <select
            onChange={(e) =>
              onStatusChange(task.id, e.target.value as Task["status"])
            }
            value={task.status}
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
