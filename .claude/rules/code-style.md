---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Code Style Rules

## TypeScript

- Strict mode is enabled — never use `any` or `@ts-ignore`
- Use `type` imports for type-only imports: `import type { Foo } from "bar"`
- Prefer `interface` for object shapes, `type` for unions/intersections
- Export types alongside their implementations

## Naming

- **Files**: kebab-case (`create-workout.ts`, `sleep-score.ts`)
- **Components**: PascalCase (`ExerciseList.tsx`)
- **Functions/variables**: camelCase (`getWorkoutHistory`, `userId`)
- **Database columns**: snake_case (`user_id`, `created_at`) — Drizzle maps to camelCase automatically
- **Constants**: UPPER_SNAKE_CASE only for true constants (`APP_NAME`, `MAX_REPS`)

## Imports

- Use `@/` path alias for all project imports (maps to project root)
- Order: React/Next → external libraries → `@/` project imports → relative imports
- No barrel files except `db/schema/index.ts`

## Components

- Prefer server components (default in App Router)
- Only add `"use client"` when you need hooks, event handlers, or browser APIs
- Co-locate loading.tsx skeletons with each route

## Error Handling

- Server actions: return errors via next-safe-action pipeline, display via global `<Toaster />`
- Never throw from server actions — return structured error responses
- Use `useTransition` for loading states on form submissions

## Forms

- All forms use Conform + Zod for validation
- Define Zod schemas in `actions/{domain}/schema.ts`
- Server actions use `actionClient.inputSchema(schema).action()`
