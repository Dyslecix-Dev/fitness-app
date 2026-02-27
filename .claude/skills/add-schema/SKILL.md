---
name: add-schema
description: Adds a new Drizzle table with RLS policy following project conventions. Use when adding database tables.
user-invocable: true
allowed-tools: Read, Edit, Write, Bash
---

When the user invokes `/add-schema $ARGUMENTS`:

## 1. Parse the Request

$ARGUMENTS should specify the table name or domain (e.g., "exercises", "workouts", "food_items").

## 2. Look Up Schema Requirements

Read the relevant section of ROADMAP.md to get:
- Column definitions and types
- Foreign key relationships
- Constraints (CHECK, NOT NULL, etc.)
- JSONB fields and their expected structure

Also check `memory/schema-decisions.md` for design rationale.

## 3. Create the Schema File

If `db/schema.ts` is still the single example file:
- Create `db/schema/` directory
- Move/create domain-specific schema files
- Create `db/schema/index.ts` that re-exports all tables
- Update `drizzle.config.ts` to point at `./db/schema/index.ts`

If `db/schema/` directory already exists:
- Add the new schema file to `db/schema/{domain}.ts`
- Add re-export to `db/schema/index.ts`

## 4. Follow Conventions

- Use `pgTable` from `drizzle-orm/pg-core`
- Use snake_case for column names
- Use `uuid` for primary keys (not `serial`) — matches Supabase auth.users
- Use `timestamptz` for all timestamps
- Use Postgres enums via `pgEnum` for constrained values
- Add `ON DELETE CASCADE` for child tables
- Nullable `user_id` means built-in (not `is_custom` boolean)
- No computed columns (compute at query time)

## 5. Push to Database

After creating the schema, run:
```bash
drizzle-kit push
```

## 6. Create Corresponding Query File

Create `db/queries/{domain}.ts` with initial query functions for the new table.
