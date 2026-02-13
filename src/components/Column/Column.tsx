import { useState } from "react";
import { TaskCard } from "../TaskCard/TaskCard";
import { type Task } from "../../types/todo";

import "./Column.css";

type ColumnProps = {
  title: string;
  status: Task["status"];
  tasks: Task[];
  onStatusChange: (id: string, newStatus: Task["status"]) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newTitle: string) => void;
};

export const Column = ({
  title,
  tasks,
  onStatusChange,
  onDelete,
  onUpdate,
  status,
}: ColumnProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

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
      <h2>
        {title}
        <span className="task-count">{tasks.length}</span>
      </h2>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};
