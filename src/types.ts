export interface Task {
  id: string;
  title: string;
  completed: boolean;
  project?: string;
  tags?: string[];
  priority?: number;
  dueDate?: string;
}

export interface TaskCreateInput {
  title: string;
}

export interface APIError {
  message: string;
  code?: string;
}

export interface Preferences {
  apiPort: string;
}

export interface FilterOptions {
  projects: string[];
  tags: string[];
  priorities: number[];
}
