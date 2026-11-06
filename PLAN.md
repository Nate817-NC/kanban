# Kanban MVP Plan

## Context
The repo (`/home/user/kanban`) is a skeleton for the course: it has `README.md`, `AGENTS.md` and `community_contributions/`, and no code yet. `AGENTS.md` asks for a client-rendered Next.js Kanban MVP in `frontend/` with these features:
- One board with 5 fixed columns that can be renamed.
- Cards with a title and details only.
- Cards move by drag and drop; cards can be added and deleted.
- The board opens with dummy data.
- No persistence and no user accounts.

It also sets the brand colors and asks for a polished UI, unit tests, Playwright integration tests and a running server at the end. The spec also asks for a written plan with success criteria that get checked off. That plan will be committed as `PLAN.md` at the repo root (this file, copied there in Phase 1).

Environment: Node 22.23 and npm 10.9. The latest releases are next 16.4.x and @dnd-kit/core 6.3.x. Chromium and Playwright are pre-installed, so the tests launch with `executablePath: /opt/pw-browsers/chromium` if the pinned version differs.

## Stack
- Next.js 16 (App Router, TypeScript, Turbopack), React 19 and Tailwind CSS v4, created with `create-next-app`.
- `@dnd-kit/core`, `@dnd-kit/sortable` and `@dnd-kit/utilities` for drag and drop, including reordering within a column and moving between columns.
- Vitest, @testing-library/react, @testing-library/user-event and jsdom for unit and component tests.
- @playwright/test for end-to-end tests.
- Board state lives in a `useReducer` inside a client component. There is no backend and no global state library.

## File layout (`frontend/`)
- `src/app/layout.tsx`, `src/app/page.tsx` (renders `<Board />`) and `src/app/globals.css`. The brand colors are defined as Tailwind v4 `@theme` tokens: `accent #ecad0a`, `primary #209dd7`, `secondary #753991`, `navy #032147` and `muted #888888`.
- `src/lib/board.ts` holds the types (`Card`, `Column`, `BoardState`), `initialBoard` (the dummy data: 5 columns, about 10 cards) and a pure `boardReducer` with these actions:
  - `renameColumn`
  - `addCard`
  - `deleteCard`
  - `moveCard` (from/to column and index; handles both a same-column reorder and a move to another column)
- `src/components/Board.tsx` is the `"use client"` component. It holds the `DndContext`, the sensors (pointer and keyboard), the `DragOverlay` and the reducer.
- `src/components/Column.tsx` shows the column header with a title you edit inline: click to edit, Enter or blur to save, Escape to cancel. It also shows a card count, the droppable sortable list and an add-card form.
- `src/components/Card.tsx` is the sortable card. It shows the title and details, plus a delete button that appears on hover or focus.
- `src/components/AddCardForm.tsx` is collapsed into an "Add card" button. Expanded, it shows title and details fields and a purple submit button. The title is required.
- Tests sit next to the code: `src/lib/board.test.ts` and `src/components/*.test.tsx`.
- `e2e/kanban.spec.ts` holds the Playwright tests. Config files: `playwright.config.ts` (its webServer runs `npm run dev`), `vitest.config.ts` and `vitest.setup.ts`.
- `.gitignore` at the repo root covers `node_modules`, `.next`, `test-results`, `playwright-report`, `coverage` and `.env*`.
- The existing README gets a minimal "Running" section added.

## UI design
- The background is a soft off-white with a subtle gradient. The header has a navy title, a yellow accent underline and gray supporting text.
- The 5 columns sit in a horizontal row that scrolls on narrow screens. Each column is a rounded panel with a thin yellow top accent line and a blue count badge.
- Cards are white with a soft shadow, a lift-on-hover effect and a rotated, raised look while being dragged (through the DragOverlay).
- Primary actions use the purple button style. Card details and labels use the gray text color.
- No emojis anywhere.

## Phases and success criteria

### Phase 1: Scaffolding
- [x] `PLAN.md` is written at the repo root.
- [x] The Next.js app is created in `frontend/`, the dependencies are installed, and `npm run dev` serves the page.
- [x] The root `.gitignore` is in place, and `npm run lint` and `npm run build` pass.
- [x] The Vitest and Playwright configs are in place, and the scripts `test` and `test:e2e` exist.

### Phase 2: State and logic (TDD)
- [x] The reducer has unit tests covering rename, add, delete, move within a column, move across columns, and moving to an empty column.
- [x] `initialBoard` has exactly 5 columns, and every column has dummy cards except possibly one.

### Phase 3: UI components
- [x] Board, Column, Card and AddCardForm are implemented with the brand colors.
- [x] There are component tests for these behaviors:
  - Renaming a column, including Escape to cancel.
  - Adding a card, including that an empty title is rejected.
  - Deleting a card.
- [x] Drag and drop works with both the mouse and the keyboard.

### Phase 4: Integration testing (Playwright)
- [x] The board loads with 5 columns and the dummy cards.
- [x] A column can be renamed and the new name shows.
- [x] A card can be added and it appears in the right column.
- [x] A card can be deleted.
- [x] A card can be dragged to another column, and reordered within the same column.
- [x] Any defects found are fixed, and the full e2e suite is green.

### Phase 5: Finish
- [x] Unit tests, e2e tests, lint and the build all pass.
- [x] The README has a minimal run section.
- [x] The dev server is running and ready for the user (the port is reported through `report_preview_port`).
- [x] Screenshots are checked for visual polish.

## Verification
- `cd frontend && npm test` runs the Vitest suite.
- `npm run test:e2e` runs Playwright against the dev server.
- `npm run lint && npm run build`.
- Take a Playwright screenshot of the running app for a visual check.
- Leave `npm run dev` running.

## Notes
- I will not commit or push unless you ask.
