import { useState, useRef, useLayoutEffect } from "react";
import { Trash2, Pencil, Check } from "lucide-react";
import { type Task } from "../../types/todo";
import { CustomSelect, type SelectOption } from "../CustomSelect/CustomSelect";
import "./TaskCard.css";

type TaskCardProps = {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: Task["status"]) => void;
  onUpdate: (id: string, newTitle: string) => void;
};

const STATUS_OPTIONS: SelectOption<Task["status"]>[] = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export const TaskCard = ({
  task,
  onStatusChange,
  onDelete,
  onUpdate,
}: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("taskId", id);
  };

  const handleSave = () => {
    if (editedTitle.trim().length === 0) {
      setEditedTitle(task.title);
      setIsEditing(false);
      return;
    }
    onUpdate(task.id, editedTitle);
    setIsEditing(false);
  };

  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  }, [editedTitle, isEditing]);

  return (
    <div
      className="task-card"
      draggable={!isEditing}
      onDragStart={(e) => handleDragStart(e, task.id)}
    >
      <div className="task-header">
        {isEditing ? (
          <div className="edit-mode-wrapper">
            <textarea
              ref={textareaRef}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              autoFocus
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              className="edit-input"
            />
            <button
              className="icon-btn save-btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSave}
              aria-label="Save changes"
            >
              <Check size={18} />
            </button>
          </div>
        ) : (
          <h3 onClick={() => setIsEditing(true)}>{task.title}</h3>
        )}

        <div className="action-buttons">
          {!isEditing && (
            <button
              className="icon-btn edit-btn"
              onClick={() => setIsEditing(true)}
              aria-label="Edit task"
            >
              <Pencil size={16} />
            </button>
          )}
          <button
            className="icon-btn delete-btn"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="task-meta">
        <span className="task-date">{task.createdAt}</span>
        <span className={`priority-${task.priority}`}>{task.priority}</span>
      </div>

      <CustomSelect
        value={task.status}
        options={STATUS_OPTIONS}
        onChange={(newStatus) => onStatusChange(task.id, newStatus)}
      />
    </div>
  );
};
