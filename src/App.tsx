import { useEffect, useState } from "react";
import { type Priority } from "./types/todo";
import { Column } from "./components/Column/Column";
import {
  CustomSelect,
  type SelectOption,
} from "./components/CustomSelect/CustomSelect";
import { useTasks } from "./components/hooks/useTasks";
import { Sun, Moon } from "lucide-react";

import "./App.css";

const PRIORITY_OPTIONS: SelectOption<Priority>[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

function App() {
  const { tasks, addTask, deleteTask, changeStatus, updateTask } = useTasks();

  const [inputValue, setInputValue] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("low");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    return savedTheme ? savedTheme : "light";
  });

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

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <div>
      <header className="app-header">
        <button onClick={toggleTheme} className="icon-btn">
          {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </header>
      <form onSubmit={handleSubmit} className="add-task-form">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Введіть задачу..."
        />
        <CustomSelect
          value={priority}
          options={PRIORITY_OPTIONS}
          onChange={setPriority}
        />
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
