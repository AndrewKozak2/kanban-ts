export type Priority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  description?: string;
  priority: Priority;
  createdAt: string;
};
