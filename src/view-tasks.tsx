import {
  List,
  showToast,
  Toast,
  ActionPanel,
  Action,
  Icon,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { Task } from "./types";
import { fetchTasks, toggleTaskStatus } from "./api/client";
import { getCachedTasks } from "./cache";

export default function ViewTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    async function loadTasks() {
      setIsLoading(true);
      try {
        const fetchedTasks = await fetchTasks({ completed: false });
        setTasks(fetchedTasks);
      } catch {
        const cached = await getCachedTasks();
        if (cached) {
          const openTasks = cached.filter((t) => !t.completed);
          setTasks(openTasks);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadTasks();
  }, []);

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  function getAccessories(task: Task): List.Item.Accessory[] {
    const accessories: List.Item.Accessory[] = [];

    if (task.tags && task.tags.length > 0) {
      for (const tagName of task.tags) {
        accessories.push({ tag: { value: tagName } });
      }
    }

    if (task.priority !== undefined) {
      accessories.push({ text: `P${task.priority}` });
    }

    if (task.dueDate) {
      accessories.push({ text: task.dueDate });
    }

    return accessories;
  }

  async function handleCompleteTask(task: Task) {
    await showToast({
      style: Toast.Style.Animated,
      title: "Marking complete...",
    });

    setTasks((prev) => prev.filter((t) => t.id !== task.id));

    try {
      await toggleTaskStatus(task.id);
      await showToast({
        style: Toast.Style.Success,
        title: "Task completed",
        message: task.title,
      });
    } catch (error) {
      setTasks((prev) =>
        [...prev, task].sort((a, b) => a.title.localeCompare(b.title)),
      );

      const message =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Failed to complete task";

      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: message,
      });
    }
  }

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search tasks..."
    >
      {filteredTasks.length === 0 && !isLoading ? (
        <List.EmptyView
          title="No tasks found"
          description="All caught up! No open tasks."
        />
      ) : (
        filteredTasks.map((task) => (
          <List.Item
            key={task.id}
            title={task.title}
            subtitle={task.project}
            accessories={getAccessories(task)}
            actions={
              <ActionPanel>
                <Action
                  title="Complete Task"
                  icon={Icon.Checkmark}
                  onAction={() => handleCompleteTask(task)}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
