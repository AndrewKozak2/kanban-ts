import { useState } from "react";
import { type Task } from "./types/todo";
import { Column } from "./components/Column";

import "./App.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: inputValue,
      status: "todo",
    };
    setTasks([...tasks, newTask]);
    setInputValue("");
  }

  function handleStatusChange(id: string, newStatus: Task["status"]) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task,
      ),
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleChange} />
        <button>Add</button>
      </form>
      <div className="kanban-board">
        <div className="kanban-column">
          <Column
            title="To Do"
            tasks={tasks.filter((t) => t.status === "todo")}
            onStatusChange={handleStatusChange}
          />
          <Column
            title="In Progress"
            tasks={tasks.filter((t) => t.status === "in-progress")}
            onStatusChange={handleStatusChange}
          />
          <Column
            title="Done"
            tasks={tasks.filter((t) => t.status === "done")}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
