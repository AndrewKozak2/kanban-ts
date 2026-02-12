import { useState } from "react";
import { type Priority } from "./types/todo";
import { Column } from "./components/Column/Column";
import { useTasks } from "./components/hooks/useTasks";

import "./App.css";

function App() {
  const { tasks, addTask, deleteTask, changeStatus, updateTask } = useTasks();

  const [inputValue, setInputValue] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("low");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim()) return;

    addTask(inputValue, priority);
    setInputValue("");
    setPriority("low");
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="add-task-form">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Введіть задачу..."
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button>Add</button>
      </form>
      <div className="kanban-board">
        <Column
          title="To Do"
          status="todo"
          tasks={tasks.filter((t) => t.status === "todo")}
          onStatusChange={changeStatus}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
        <Column
          title="In Progress"
          status="in-progress"
          tasks={tasks.filter((t) => t.status === "in-progress")}
          onStatusChange={changeStatus}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
        <Column
          title="Done"
          status="done"
          tasks={tasks.filter((t) => t.status === "done")}
          onStatusChange={changeStatus}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
      </div>
    </div>
  );
}

export default App;
