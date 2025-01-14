export interface Task {
  id: string;
  title: string;
  description: string;
  category?: string;
  dueDate: Date;
  sharedTask?: string;
  sharedUser?: string;
  completed: boolean;
}
