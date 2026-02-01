import {
  Form,
  ActionPanel,
  Action,
  showToast,
  Toast,
  popToRoot,
} from "@raycast/api";
import { useState } from "react";
import { createTask, parseNaturalLanguage } from "./api/client";
import { ParsedTaskInput } from "./types";

interface FormValues {
  title: string;
}

export default function QuickAdd() {
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedFields, setParsedFields] = useState<ParsedTaskInput | null>(
    null,
  );
  const [inputValue, setInputValue] = useState("");

  async function handleInputBlur() {
    if (!inputValue.trim()) {
      setParsedFields(null);
      return;
    }

    setIsParsing(true);

    try {
      const result = await parseNaturalLanguage(inputValue);
      setParsedFields(result);
    } catch (error) {
      setParsedFields({ title: inputValue });
    } finally {
      setIsParsing(false);
    }
  }

  async function handleSubmit(values: FormValues) {
    const titleToUse = parsedFields?.title ?? values.title;

    if (!titleToUse.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Title is required",
      });
      return;
    }

    setIsLoading(true);

    try {
      await showToast({
        style: Toast.Style.Animated,
        title: "Creating task...",
      });

      const taskInput = parsedFields ?? { title: titleToUse.trim() };
      const task = await createTask(taskInput);

      await showToast({
        style: Toast.Style.Success,
        title: "Task created",
        message: task.title,
      });

      await popToRoot();
    } catch (error) {
      const message =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Failed to create task";

      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      isLoading={isLoading || isParsing}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Task" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="input"
        title="Task"
        placeholder="What needs to be done?"
        autoFocus
        value={inputValue}
        onChange={setInputValue}
        onBlur={handleInputBlur}
      />

      {parsedFields && (
        <>
          <Form.Separator />
          <Form.Description text="Parsed Preview:" />

          <Form.TextField
            id="title"
            title="Title"
            value={parsedFields.title}
            onChange={(value) =>
              setParsedFields({ ...parsedFields, title: value })
            }
          />

          {parsedFields.due && (
            <Form.TextField
              id="due"
              title="Due"
              value={parsedFields.due}
              onChange={(value) =>
                setParsedFields({ ...parsedFields, due: value })
              }
            />
          )}

          {parsedFields.scheduled && (
            <Form.TextField
              id="scheduled"
              title="Scheduled"
              value={parsedFields.scheduled}
              onChange={(value) =>
                setParsedFields({ ...parsedFields, scheduled: value })
              }
            />
          )}

          {parsedFields.tags && parsedFields.tags.length > 0 && (
            <Form.TextField
              id="tags"
              title="Tags"
              value={parsedFields.tags.join(", ")}
              onChange={(value) =>
                setParsedFields({
                  ...parsedFields,
                  tags: value.split(",").map((t) => t.trim()),
                })
              }
            />
          )}

          {parsedFields.priority && (
            <Form.TextField
              id="priority"
              title="Priority"
              value={parsedFields.priority}
              onChange={(value) =>
                setParsedFields({ ...parsedFields, priority: value })
              }
            />
          )}

          {parsedFields.projects && parsedFields.projects.length > 0 && (
            <Form.TextField
              id="projects"
              title="Projects"
              value={parsedFields.projects.join(", ")}
              onChange={(value) =>
                setParsedFields({
                  ...parsedFields,
                  projects: value.split(",").map((p) => p.trim()),
                })
              }
            />
          )}
        </>
      )}
    </Form>
  );
}
