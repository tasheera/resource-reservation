# Resource Reservation Management System

A web app for an organization to manage its shared resources (rooms, equipment, vehicles) and reserve them without overlapping confirmed bookings.

## Tech stack

- Next.js 16 and TypeScript
- PostgreSQL 18 (the version used for development)
- Prisma 6 (ORM and migrations)
- Zod (server-side validation)
- Tailwind CSS

## Features

- **Resources:** add, edit, activate/deactivate, search by name, filter by type
- **Reservations:** create and cancel, with validation and a clear message on conflicts
- **No double bookings:** enforced by the database itself
- **Availability:** day view per resource showing free and booked blocks
- **Dashboard:** upcoming reservations and bookings per resource
- **Reservation list:** filter by resource and status, with pagination

## Getting started

### Prerequisites

- Node.js 20 or higher
- PostgreSQL with a database named `reservations`

### Setup

```bash
git clone https://github.com/tasheera/resource-reservation
cd resource-reservation
# copy .env.example to .env
# Edit .env and set DATABASE_URL for your PostgreSQL database
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open http://localhost:3000.

`npm run db:seed` fills the database with sample data. Dates are relative to today, so the dashboard always has upcoming bookings. **Running it again deletes all existing data** and recreates the samples.

### Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the app in development mode |
| `npm run db:seed` | Reset data to the sample set |
| `npx prisma migrate reset` | Deletes existing data, reapplies migrations, then runs the seed script |

If you see an error about a missing Prisma client, run `npx prisma generate`.

## Design decisions

**Double bookings are prevented in the database.** A PostgreSQL exclusion constraint (`btree_gist` with `tstzrange`) rejects overlapping CONFIRMED reservations for the same resource. Checking in app code alone is not safe, because two people can submit at the same moment and both checks would pass. The constraint is created in a custom migration. The app catches the database error and shows a friendly message.

**Half-open time ranges `[start, end)`.** A booking from 10:00 to 11:00 and another from 11:00 to 12:00 do not conflict.

**Cancel, don't delete.** Cancelling sets the status to CANCELLED and keeps the history. The constraint ignores cancelled rows, so the slot can be booked again. Resources are deactivated instead of deleted for the same reason.

**Timestamps are stored as `timestamptz` (UTC) and shown in Sri Lanka time** (`Asia/Colombo`). The timezone is a single constant in `lib/format.ts`.

**Validation on the server** with Zod in server actions, so it cannot be bypassed from the browser. The database has a `CHECK` that the end is after the start as a last safety net.

**Simple layers.** Pages display data, `actions.ts` files handle writes and validation, `lib/data/*` holds database queries, and `lib/availability.ts` holds the pure logic for building free/booked blocks.

## Assumptions and limitations

- There is no login or user roles.
- One organization and one timezone (Sri Lanka, no daylight saving).
- Usage on the dashboard counts confirmed bookings, not hours used.
- Bookings in the past are allowed.

## Project structure

```
app/            Pages and server actions (resources, reservations, availability, dashboard)
lib/data/       Database queries
lib/            Validation, formatting, availability logic, error helpers
prisma/         Schema, migrations, seed script
```

## AI assistance

I utilized AI-assisted development tools to accelerate boilerplate coding and support my workflow. The architecture, database design, and core logic are my own