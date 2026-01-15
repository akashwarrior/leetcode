# @codearena/db

Shared database package for the CodeArena monorepo. Provides the Prisma schema, a singleton client, and seed scripts.

## Setup

### Prerequisites

- PostgreSQL running locally (or a remote connection string)
- Node.js / Bun installed

### Environment

Copy the example and fill in your connection string:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgres://postgres:password@localhost:5432/codearena"
```

### Install & Generate

```bash
pnpm install
pnpm generate    # generates the Prisma client into src/generated/
pnpm migrate     # creates and applies a new migration
```

## Scripts

| Script           | Description                                  |
| ---------------- | -------------------------------------------- |
| `pnpm generate`  | Regenerate the Prisma client after schema changes |
| `pnpm migrate`   | Create and apply a new dev migration         |
| `pnpm migrate:reset` | Reset the database and reapply all migrations |
| `pnpm seed`      | Seed the database with sample data           |
| `pnpm format`    | Auto-format the Prisma schema file           |

## Project Structure

```
packages/db/
├── prisma/
│   ├── schema.prisma      # Data model definitions
│   └── migrations/        # Migration history
├── src/
│   ├── index.ts           # Singleton Prisma client & re-exports
│   ├── seed.ts            # Database seeder
│   └── generated/         # Auto-generated Prisma client (gitignored)
├── prisma.config.ts       # Prisma CLI configuration
├── package.json
└── tsconfig.json
```

## Usage

Import the client and types from `@codearena/db` in any workspace package:

```ts
import { prisma } from "@codearena/db";
import type { Difficulty, ProblemStatus } from "@codearena/db";

const problems = await prisma.problem.findMany({
  where: { isHidden: false },
});
```

The Prisma client is initialised as a **singleton** — it reuses the same instance across hot-reloads in development and maintains a single connection pool in production.

## Schema Overview

### Core Models

- **Problem** — Coding problems with difficulty, tags, test cases, and hints
- **Tag** — Categorical labels for problems (many-to-many)
- **Contest** — Timed coding competitions
- **ContestProblem** — Links problems to contests with ordering and point values
- **Submission** — User code submissions with status, timing, and memory stats

### User Models

- **User** — Accounts with profile stats (streak, rating, global rank)
- **UserProblem** — Tracks per-user solve status (ATTEMPTED / SOLVED)
- **Activity** — Daily submission counts for the heatmap
- **ContestParticipation** — Contest scores, penalties, and rankings

### Auth Models (Better Auth)

- **Session**, **Account**, **Verification** — Managed by Better Auth

## Seeding

The seed script populates the database with realistic sample data:

- **10 tags** — Common algorithm categories
- **30 problems** — With randomised difficulty, tags, and submission counts
- **30 daily problems** — One per day starting from today
- **5 contests** — Each with 4 problems, scheduled on consecutive days
- **1 demo user** — With solve history and 180 days of activity data

```bash
pnpm seed
```

> **Note:** Seeding clears all existing data before inserting. Do not run against a production database.
