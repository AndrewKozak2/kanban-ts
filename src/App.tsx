import { useState, useEffect } from "react";
import { type Task } from "./types/todo";
import { type Priority } from "./types/todo";
import { Column } from "./components/Column/Column";

import "./App.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [inputValue, setInputValue] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("low");

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
      priority: priority,
      createdAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };
    setTasks([...tasks, newTask]);
    setInputValue("");
    setPriority("low");
  }

  function handleStatusChange(id: string, newStatus: Task["status"]) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task,
      ),
    );
  }

  function handleDelete(id: string) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }

  function updateTask(id: string, newTitle: string) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task,
      ),
    );
  }

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

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
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onUpdate={updateTask}
        />
        <Column
          title="In Progress"
          status="in-progress"
          tasks={tasks.filter((t) => t.status === "in-progress")}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onUpdate={updateTask}
        />
        <Column
          title="Done"
          status="done"
          tasks={tasks.filter((t) => t.status === "done")}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onUpdate={updateTask}
        />
      </div>
    </div>
  );
}

export default App;
