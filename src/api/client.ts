import { getPreferenceValues } from "@raycast/api";
import { Preferences, Task, TaskCreateInput, APIError } from "../types";
import { setCachedTasks } from "../cache";

function getBaseUrl(): string {
  const preferences = getPreferenceValues<Preferences>();
  return `http://localhost:${preferences.apiPort}`;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 5000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

function createAPIError(message: string, code?: string): APIError {
  return { message, code };
}

export async function checkConnection(): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(
      `${getBaseUrl()}/api/tasks?limit=1`,
      { method: "GET" }
    );
    return response.ok;
  } catch {
    return false;
  }
}

export interface FetchTasksFilters {
  project?: string;
  tag?: string;
  priority?: number;
  completed?: boolean;
}

export async function fetchTasks(filters?: FetchTasksFilters): Promise<Task[]> {
  try {
    const url = new URL(`${getBaseUrl()}/api/tasks`);

    if (filters) {
      if (filters.project) url.searchParams.set("project", filters.project);
      if (filters.tag) url.searchParams.set("tag", filters.tag);
      if (filters.priority !== undefined) url.searchParams.set("priority", String(filters.priority));
      if (filters.completed !== undefined) url.searchParams.set("completed", String(filters.completed));
    }

    const response = await fetchWithTimeout(url.toString(), { method: "GET" });

    if (!response.ok) {
      const error = createAPIError(`Failed to fetch tasks: ${response.statusText}`, String(response.status));
      throw error;
    }

    const data = await response.json();
    const tasks = data as Task[];
    await setCachedTasks(tasks);
    return tasks;
  } catch (error) {
    if (error && typeof error === "object" && "message" in error) {
      throw error;
    }
    throw createAPIError("Failed to fetch tasks: Network error or timeout");
  }
}

export async function createTask(input: TaskCreateInput): Promise<Task> {
  try {
    const response = await fetchWithTimeout(`${getBaseUrl()}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = createAPIError(`Failed to create task: ${response.statusText}`, String(response.status));
      throw error;
    }

    const data = await response.json();
    return data as Task;
  } catch (error) {
    if (error && typeof error === "object" && "message" in error) {
      throw error;
    }
    throw createAPIError("Failed to create task: Network error or timeout");
  }
}

export async function toggleTaskStatus(id: string): Promise<Task> {
  try {
    const response = await fetchWithTimeout(`${getBaseUrl()}/api/tasks/${id}/toggle-status`, {
      method: "POST",
    });

    if (!response.ok) {
      const error = createAPIError(`Failed to toggle task status: ${response.statusText}`, String(response.status));
      throw error;
    }

    const data = await response.json();
    return data as Task;
  } catch (error) {
    if (error && typeof error === "object" && "message" in error) {
      throw error;
    }
    throw createAPIError("Failed to toggle task status: Network error or timeout");
  }
}
