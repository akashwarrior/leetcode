# CodeArena

A full-stack competitive coding platform — practice problems, compete in contests, and track your progress.

## Tech Stack

| Layer      | Technology                  |
| ---------- | --------------------------- |
| Framework  | Next.js 16 · React 19       |
| Language   | TypeScript 5                |
| Styling    | Tailwind CSS 4 · shadcn/ui  |
| State      | Jotai · SWR                 |
| Database   | PostgreSQL · Prisma ORM     |
| Auth       | Better Auth                 |
| Editor     | Monaco Editor               |
| Animations | Motion (Framer Motion)      |
| Monorepo   | Turborepo · pnpm workspaces |

## Project Structure

```
codearena/
├── apps/
│   └── web/              # Next.js frontend
├── packages/
│   └── db/               # Prisma schema, client & seed scripts
├── turbo.json            # Turborepo pipeline config
├── pnpm-workspace.yaml   # Workspace definition
└── package.json          # Root scripts & dev dependencies
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 10
- **PostgreSQL** running locally or a remote connection string

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp packages/db/.env.example packages/db/.env
# Edit packages/db/.env with your DATABASE_URL

cp apps/web/.env.example apps/web/.env
# Edit apps/web/.env with auth secrets, OAuth credentials, etc.
```

### 3. Set up the database

```bash
# Generate the Prisma client
pnpm --filter @codearena/db generate

# Run migrations
pnpm --filter @codearena/db migrate

# Seed with sample data (optional)
pnpm --filter @codearena/db seed
```

### 4. Start development

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to get started.

## Scripts

Run from the repo root — Turborepo handles orchestration across workspaces.

| Script             | Description                                  |
| ------------------ | -------------------------------------------- |
| `pnpm dev`         | Start all apps in dev mode                   |
| `pnpm build`       | Production build for all apps                |
| `pnpm lint`        | Lint all workspaces                          |
| `pnpm check-types` | TypeScript type checking across all packages |
| `pnpm format`      | Format all TS/TSX/MD files with Prettier     |
