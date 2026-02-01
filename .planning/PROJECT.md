# TaskNotes Integration

## What This Is

A Raycast extension that connects to the TaskNotes Obsidian plugin via its local HTTP API. Enables quick task capture, task viewing, and natural language input without leaving your current context or opening Obsidian.

## Core Value

Fast task capture from anywhere — type a task, it's in Obsidian, get back to work.

## Current Milestone: v1.1 Actions + NLP

**Goal:** Expand task actions and add natural language input for faster task creation.

**Target features:**
- Open task in Obsidian (primary action)
- Reordered keyboard shortcuts (Enter = open, Cmd+Enter = complete)
- Natural language parsing ("Buy groceries tomorrow 3pm #errands")

## Requirements

### Validated

- ✓ Quick Add command — type task title, create task in TaskNotes (v1.0)
- ✓ View Tasks command — see open tasks with filtering by project/tag/priority (v1.0)
- ✓ Toggle done action — mark tasks complete from the list view (v1.0)
- ✓ Connect to TaskNotes API on localhost with auth support (v1.0)
- ✓ Menu bar with task count and quick access (v1.0)

### Active

- [ ] Open in Obsidian — open task file directly from Raycast (Enter)
- [ ] Reorder shortcuts — Enter = open, Cmd+Enter = complete
- [ ] Natural language input — parse dates, projects, tags from free-form text

### Out of Scope

- Edit task details from Raycast — handle in Obsidian
- View completed/archived tasks — only open tasks shown
- Archive/delete tasks from Raycast — destructive actions stay in Obsidian
- Obsidian vault selection — single vault assumed
- Time tracking — defer to future milestone
- Pomodoro timer — defer to future milestone

## Context

**TaskNotes API (configurable port, default 8080):**
- `GET /api/tasks` — List tasks (with filters)
- `POST /api/tasks` — Create new task
- `GET/PUT/DELETE /api/tasks/{id}` — Get, update, delete task
- `POST /api/tasks/{id}/toggle-status` — Mark done/undone
- `POST /api/tasks/{id}/archive` — Archive task
- `GET /api/filter-options` — Get available tags, projects, priorities
- `POST /api/nlp/parse` — Parse natural language into task fields
- `POST /api/nlp/create` — Create task from natural language
- Swagger UI at `/api/docs/ui` for testing
- Optional Bearer token auth

**Obsidian Integration:**
- Tasks have `path` field (file path in vault)
- Open via `obsidian://open?vault={vault}&file={path}` URL scheme

**Raycast Stack:**
- TypeScript + React + Node.js
- Built-in `useFetch` hook with caching, error handling

**Dependencies:**
- Requires Obsidian running with TaskNotes plugin
- TaskNotes HTTP API must be enabled
- Local-only (no remote access)

## Constraints

- **Platform**: Raycast extension (macOS only)
- **Runtime**: Only works when Obsidian + TaskNotes are running
- **API**: localhost HTTP, port configurable in preferences

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Title-only quick add | Speed over completeness — details added in Obsidian | ✓ Good |
| Open tasks only in list | Keeps view focused on actionable items | ✓ Good |
| Toggle as only action | Simplicity — other edits happen in Obsidian | ⚠️ Revisit — adding more actions in v1.1 |
| 127.0.0.1 over localhost | Avoids IPv6 resolution issues in Raycast sandbox | ✓ Good |
| URL-encode task IDs | Task paths contain slashes that break URL routing | ✓ Good |
| Server-side NLP | Use `/api/nlp/*` endpoints instead of client-side parsing | — Pending |

---
*Last updated: 2026-01-31 after v1.1 milestone start*
