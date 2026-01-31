# TaskNotes Integration

## What This Is

A Raycast extension that connects to the TaskNotes Obsidian plugin via its local HTTP API. Enables quick task capture and task viewing without leaving your current context or opening Obsidian.

## Core Value

Fast task capture from anywhere — type a task, it's in Obsidian, get back to work.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Quick Add command — type task title, create task in TaskNotes
- [ ] View Tasks command — see open tasks with optional filtering by project/tag/priority
- [ ] Toggle done action — mark tasks complete from the list view
- [ ] Connect to TaskNotes API on localhost

### Out of Scope

- Edit task details from Raycast — handle in Obsidian
- View completed/archived tasks — only open tasks shown
- Delete/archive tasks — toggle status is enough
- Obsidian vault selection — single vault assumed

## Context

**TaskNotes API (localhost:8080):**
- `GET /api/tasks` — List tasks (with filters)
- `POST /api/tasks` — Create new task
- `PUT /api/tasks/{id}` — Update task
- `POST /api/tasks/{id}/toggle-status` — Mark done/undone
- `GET /api/filter-options` — Get available tags, projects, priorities
- Swagger UI at `/api/docs/ui` for testing
- Optional Bearer token auth (localhost works without)

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
| Title-only quick add | Speed over completeness — details added in Obsidian | — Pending |
| Open tasks only in list | Keeps view focused on actionable items | — Pending |
| Toggle as only action | Simplicity — other edits happen in Obsidian | — Pending |

---
*Last updated: 2025-01-30 after initialization*
