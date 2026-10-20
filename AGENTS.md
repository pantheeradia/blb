<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `node_modules/next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Information

## Database Setup

This project uses Turso/LibSQL with fallback to local SQLite:
- Database client: `@libsql/client` with Drizzle ORM
- Configuration: `.env` variable `TURSO_DATABASE_URL` (defaults to `file:./local.db`)
- Auth token: `TURSO_AUTH_TOKEN` (required for Turso, optional for local)
- When using Turso, both `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` must be set and valid
- If auth token is missing or invalid, the client automatically falls back to local SQLite

## Migration Scripts

- `npx drizzle-kit generate` - Generate migration SQL from schema
- `npx tsx scripts/migrate.ts` - Apply migration to local database
- `npx tsx scripts/init-db.ts` - Initialize database with DDL (legacy)

## Verification

Test database connectivity: `curl http://localhost:3000/api/debug`

## Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
