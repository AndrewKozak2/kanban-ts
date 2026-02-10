import { useState } from "react";
import { type Task } from "./types/todo";

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
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleChange} />
        <button>Add</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
