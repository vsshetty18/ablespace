# AbleSpace Task Management — Technical Assessment

## Overview

A full-stack task management application built for the AbleSpace Full Stack
Developer (Fresher) technical assessment. Guests can log in without a
password, create/edit/delete tasks with status, priority, and due dates,
and switch between light and dark themes with the preference persisted
across refreshes.

**Status:** Core application (frontend + backend + database) is fully wired
end-to-end. Visual polish to closely match the Figma design is pending —
see [Known Limitations](#known-limitations).

## Features

- Guest login (no password/email required)
- Full task CRUD (create, view, edit, delete)
- Task status (To Do / In Progress / Done) and priority (Low / Medium / High)
- Optional due dates
- Theme switching (light/dark) with flash-free persistence via localStorage
- Fully responsive layout (mobile / tablet / desktop)
- Loading, error, and empty states throughout
- Input validation on both frontend (UX) and backend (source of truth)

## Tech Stack

**Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
**Backend:** NestJS, TypeScript, Prisma
**Database:** PostgreSQL (Supabase/Neon)
**Deployment:** Vercel (frontend), Render (backend), Supabase/Neon (database)

## Architecture

Two independently deployed services:

- **frontend/** — Next.js app, communicates with the backend exclusively
  over REST via `fetch`, using `NEXT_PUBLIC_API_URL`.
- **backend/** — NestJS REST API, owns all database access via Prisma.
  No frontend code ever touches the database directly.

Guest identity is a UUID stored client-side (`localStorage`) and sent as
an `x-user-id` header on every task request. The backend scopes every
query to that id, so one guest can never read or modify another guest's
tasks. See [Guest Login](#guest-login) for the full explanation and
tradeoffs.

## Project Structure
ablespace-assessment/
├── frontend/ # Next.js App Router application
│ ├── app/ # Routes: / (guest login), /tasks (main board)
│ ├── components/ # ui/, tasks/, layout/, theme/
│ ├── hooks/ # useTasks — centralized task state + API calls
│ ├── lib/ # api.ts (fetch wrapper), guest.ts (session helpers)
│ └── types/ # Shared Task types, mirroring the Prisma schema
├── backend/ # NestJS application
│ ├── src/
│ │ ├── auth/ # Guest session creation
│ │ ├── tasks/ # Task CRUD module
│ │ ├── database/ # PrismaService wrapper
│ │ └── common/ # Global exception filter
│ └── prisma/ # schema.prisma
└── docs/
└── part2-caseload-workflow.md

## Getting Started

This project was built entirely browser-based (GitHub web editor →
Vercel/Render deploy, no local development). To run locally instead:

```bash
# Backend
cd backend
npm install
npx prisma migrate deploy
npm run start:dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

## Environment Variables

**backend/.env**
DATABASE_URL=postgresql://user:password@host:5432/ablespace
PORT=3001
CORS_ORIGIN=http://localhost:3000,https://your-frontend.vercel.app
GUEST_SESSION_SECRET=<long random string>
**frontend/.env**
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com

> `NEXT_PUBLIC_*` variables must be set in Vercel's dashboard **before**
> the build runs — Next.js inlines them into the client bundle at build
> time, not runtime.

## Frontend Setup

Next.js 14 App Router + TypeScript + Tailwind. Entry point is `app/page.tsx`
(guest login); the main app lives at `app/tasks/page.tsx`. State is managed
with React hooks only — no external state library, since the data needs
(one task list, one theme value, one guest id) don't justify one.

## Backend Setup

NestJS with three modules: `AuthModule` (guest sessions), `TasksModule`
(CRUD), `DatabaseModule` (shared `PrismaService`). All requests are
validated via a global `ValidationPipe`; all errors are normalized via a
global exception filter.

## Database Setup

PostgreSQL via Prisma. Schema defines `User` (guest sessions) and `Task`
(with `TaskStatus`/`TaskPriority` enums), one-to-many. Run migrations with:

```bash
npx prisma migrate deploy
```

**Why Postgres over SQLite:** the backend deploys to Render with an
ephemeral filesystem — a SQLite file would be wiped on every redeploy.
A managed Postgres instance (Supabase/Neon) survives redeploys and gives
a real migration history.

## API Endpoints

| Method | Endpoint       | Description              |
|--------|----------------|---------------------------|
| POST   | `/auth/guest`  | Create a new guest session |
| GET    | `/tasks`       | List the guest's tasks    |
| GET    | `/tasks/:id`   | Get a single task         |
| POST   | `/tasks`       | Create a task              |
| PATCH  | `/tasks/:id`   | Update a task              |
| DELETE | `/tasks/:id`   | Delete a task              |

All `/tasks` endpoints require an `x-user-id` header (set automatically
by the frontend after guest login).

## Guest Login

Clicking "Continue as Guest" calls `POST /auth/guest`, which creates a
new `User` row (`isGuest: true`) and returns its UUID. The frontend stores
this UUID in `localStorage` and sends it as `x-user-id` on every
subsequent task request. The backend uses this header to scope every
task query — a guest can only ever see their own tasks.

**Known tradeoff:** each new browser/device gets a new guest identity;
there's no way to "log back in" as a previous guest from a different
browser, since there's no credential (password/email) to prove identity.
This is a deliberate scope decision for a fresher assessment — a real
product would add a persisted account system to solve this.

## Theme System

Implemented with CSS variables (`globals.css`) toggled via a
`data-theme` attribute on `<html>`, plus a small inline script in
`app/layout.tsx` that reads `localStorage` and sets the attribute
**before** React hydrates — this is what prevents a flash of the wrong
theme on refresh. `ThemeProvider` (React Context) syncs component state
to match afterward. No external theming library used.

## Responsive Design

- Sidebar is fully hidden below the `md` breakpoint (not shrunk)
- Task grid: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- Header collapses secondary content (guest name) on the smallest screens
- Modal and forms use fluid widths with a max constraint

## Deployment

1. **Database:** create a Supabase or Neon Postgres project, copy the
   connection string.
2. **Backend (Render):** connect the GitHub repo, set root directory to
   `backend`, build command `npm install && npm run build`, start command
   `npm run start:prod`. Set `DATABASE_URL`, `CORS_ORIGIN`,
   `GUEST_SESSION_SECRET` in Render's dashboard. Run
   `npx prisma migrate deploy` once (via Render's shell or a deploy hook).
3. **Frontend (Vercel):** connect the repo, set root directory to
   `frontend`, set `NEXT_PUBLIC_API_URL` to the Render URL **in the
   dashboard before the first build**. Deploy.
4. Update `CORS_ORIGIN` on Render to include the final Vercel URL, redeploy
   the backend.
5. Verify in an incognito window: guest login → create/edit/delete a task
   → refresh → theme persists → task data persists (confirms it's reading
   from Postgres, not mock data).

## Part 2

See [`docs/part2-caseload-workflow.md`](./docs/part2-caseload-workflow.md)
for the AbleSpace Caseload / Take Data workflow analysis.

## Design Decisions

- Native `<select>` over a custom dropdown — free accessibility/mobile
  picker support; revisited only if the Figma shows a custom-styled one.
- No focus-trap in `Modal` — Escape-to-close and correct ARIA roles were
  judged sufficient scope for this assessment; a production app would add
  a full focus trap.
- `x-user-id` header instead of JWT/cookies+guards — the guest concept
  has no real credential to protect, so a signed header was chosen for
  clarity over a heavier auth stack that wouldn't add real security here.

## Known Limitations

- **Visual fidelity to the Figma is incomplete.** Layout, spacing, colors,
  and component styling throughout this codebase are placeholder values
  built on a semantic token system (CSS variables), not yet matched to
  the actual Figma design.
- No mobile navigation drawer (only one nav item currently exists to
  justify one).
- No focus trap in the task modal (see Design Decisions).
- Guest sessions don't transfer across browsers/devices.

## Future Improvements

- Match final UI precisely to Figma once reference screenshots are available
- Add search/filter/sort if shown in the design
- Add a mobile nav drawer if the design calls for more navigation
- Add focus-trapping to the modal
- Add automated tests (unit + e2e)

## Screenshots

_To be added once the live deployment is verified (Day 8–9)._

## Live Demo

_To be added after deployment (Day 8)._

## GitHub Repository

_This repository._
