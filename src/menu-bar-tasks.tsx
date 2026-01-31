import { MenuBarExtra, Icon, launchCommand, LaunchType } from "@raycast/api";
import { useEffect, useState } from "react";
import { fetchTasks } from "./api/client";
import { getCachedTasks } from "./cache";
import { Task } from "./types";

export default function MenuBarTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      try {
        const openTasks = await fetchTasks({ completed: false });
        setTasks(openTasks);
      } catch (error) {
        const cachedTasks = await getCachedTasks();
        if (cachedTasks) {
          const openCachedTasks = cachedTasks.filter((task) => !task.completed);
          setTasks(openCachedTasks);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, []);

  const taskCount = tasks.length;
  const title = isLoading ? "…" : taskCount === 0 ? "✓" : String(taskCount);
  const icon = taskCount === 0 ? Icon.CheckCircle : Icon.Circle;

  return (
    <MenuBarExtra icon={icon} title={title} isLoading={isLoading}>
      <MenuBarExtra.Item
        title={`${taskCount} open task${taskCount !== 1 ? "s" : ""}`}
      />
      <MenuBarExtra.Separator />
      <MenuBarExtra.Item
        title="View Tasks"
        onAction={async () => {
          await launchCommand({
            name: "view-tasks",
            type: LaunchType.UserInitiated,
          });
        }}
      />
      <MenuBarExtra.Item
        title="Quick Add"
        onAction={async () => {
          await launchCommand({
            name: "quick-add",
            type: LaunchType.UserInitiated,
          });
        }}
      />
    </MenuBarExtra>
  );
}
