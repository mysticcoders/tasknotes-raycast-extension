import { Detail, ActionPanel, Action, showToast, Toast, openExtensionPreferences, getPreferenceValues } from "@raycast/api";
import { useState, useEffect } from "react";
import { checkConnection } from "./api/client";
import { Preferences } from "./types";

export default function CheckConnection() {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preferences = getPreferenceValues<Preferences>();

  useEffect(() => {
    async function check() {
      try {
        const connected = await checkConnection();
        setIsConnected(connected);
        if (connected) {
          await showToast({ style: Toast.Style.Success, title: "Connected to TaskNotes" });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Connection failed");
      } finally {
        setIsLoading(false);
      }
    }
    check();
  }, []);

  function retry() {
    setIsLoading(true);
    setError(null);
    setIsConnected(false);
  }

  useEffect(() => {
    if (isLoading && !error && !isConnected) {
      async function check() {
        try {
          const connected = await checkConnection();
          setIsConnected(connected);
          if (connected) {
            await showToast({ style: Toast.Style.Success, title: "Connected to TaskNotes" });
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Connection failed");
        } finally {
          setIsLoading(false);
        }
      }
      check();
    }
  }, [isLoading, error, isConnected]);

  if (isLoading) {
    return <Detail isLoading={true} markdown="Checking connection..." />;
  }

  if (!isConnected || error) {
    const markdown = `# Connection Failed

Unable to connect to TaskNotes API at **localhost:${preferences.apiPort}**

${error ? `**Error:** ${error}` : ""}

## Troubleshooting

1. Ensure Obsidian is running
2. Ensure TaskNotes plugin is installed and enabled
3. Ensure TaskNotes HTTP API is enabled in plugin settings
4. Verify the port number matches TaskNotes settings (default: 8080)

Use the action below to update your preferences if needed.`;

    return (
      <Detail
        markdown={markdown}
        actions={
          <ActionPanel>
            <Action title="Open Extension Preferences" onAction={openExtensionPreferences} />
            <Action title="Retry" onAction={retry} />
          </ActionPanel>
        }
      />
    );
  }

  return (
    <Detail
      markdown={`# Connected to TaskNotes

Successfully connected to TaskNotes API at **localhost:${preferences.apiPort}**

You're all set to use TaskNotes commands.`}
      actions={
        <ActionPanel>
          <Action title="Open Extension Preferences" onAction={openExtensionPreferences} />
        </ActionPanel>
      }
    />
  );
}
