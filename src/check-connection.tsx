import { showToast, Toast } from "@raycast/api";

export default async function Command() {
  await showToast({
    style: Toast.Style.Success,
    title: "TaskNotes",
    message: "Connection check placeholder - API client coming in Task 2",
  });
}
