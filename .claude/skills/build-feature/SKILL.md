---
name: build-feature
description: Scaffolds a new feature following the project's established patterns. Use when starting work on a new MVP feature from ROADMAP.md.
user-invocable: true
allowed-tools: Read, Glob, Grep, Edit, Write, Bash
---

When the user invokes `/build-feature`, follow this workflow:

## 1. Identify the Feature

Read $ARGUMENTS to determine which feature to build (e.g., "MVP-1", "MVP-5", "exercise library").

Look up the feature in ROADMAP.md and extract:
- Feature name and description
- Dependencies (which features must exist first)
- Database tables needed
- Server actions needed
- UI components needed
- Any formulas or calculations required

## 2. Check Prerequisites

- Verify dependencies are built (check if required tables/actions exist)
- If dependencies are missing, warn the user and list what needs to be built first

## 3. Scaffold in Order

For each new feature, create files in this order:

1. **Schema** — Add Drizzle table definitions in `db/schema/`
2. **Queries** — Add reusable query functions in `db/queries/`
3. **Formulas** — Add pure calculation functions in `lib/formulas/` (if needed)
4. **Tests** — Add Vitest tests in `lib/formulas/__tests__/` (if formulas were added)
5. **Actions** — Add server actions in `actions/{domain}/`
6. **Components** — Add UI components in `components/{domain}/`
7. **Routes** — Add pages in `app/(protected)/{domain}/`
8. **Loading states** — Add `loading.tsx` skeletons for each new route

## 4. Follow Project Patterns

- Server actions use `actionClient.inputSchema(schema).action()`
- Forms use Conform + Zod
- All tables need RLS policies
- Use `@/` path alias for imports
- Display timestamps in user's timezone
- Respect global `unit_system` from `user_profiles`

## 5. Verify

After scaffolding:
- Run `pnpm lint` to check for errors
- Run `pnpm vitest run` if formulas were added
- Run `pnpm build` to verify TypeScript compilation
