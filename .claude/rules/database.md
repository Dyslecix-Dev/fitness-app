---
paths:
  - "db/**"
  - "drizzle.config.ts"
---

# Database Rules (Drizzle ORM + Supabase)

## Schema

- Current schema is in `db/schema.ts` (single file with example tables)
- When building domain features, migrate to `db/schema/` directory with per-domain files
- Update `drizzle.config.ts` schema path when migrating to directory structure
- Always enable RLS on every table — users can only read/write their own rows
- Use `timestamptz` for all timestamps (stores UTC)
- Use Postgres enums for constrained values (not VARCHAR + CHECK)
- Use JSONB for semi-structured data (activities, factors, micronutrients)
- Foreign keys should use `ON DELETE CASCADE` for child tables

## Queries

- Current queries are in `db/queries/` organized by CRUD operation (example files)
- When building features, reorganize by domain: `db/queries/workouts.ts`, `db/queries/nutrition.ts`
- Export reusable functions, not raw query builders
- Use Drizzle's type-safe query builder — avoid raw SQL

## Migrations

- Development: `drizzle-kit push` (fast, no migration files)
- Production: `drizzle-kit generate` then `drizzle-kit migrate`
- Output directory: `lib/supabase/migrations/`

## Key Design Decisions

- No `is_custom` booleans — use nullable `user_id` (NULL = built-in, non-null = custom)
- No computed duration columns on sleep — compute at query time
- No streaks table — compute from logs on the fly
- Global `unit_system` on `user_profiles` — no per-row unit columns
- See `memory/schema-decisions.md` for full rationale
