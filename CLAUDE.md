# Fitness App — Claude Code Guide

Persistent context for every Claude Code session. Refer to @ROADMAP.md for complete feature specs.

## Current State

This project is scaffolded with auth working. The database schema, server actions, stores, and queries are all **example/placeholder files** marked with `TODO: Replace example file`. No domain-specific features (workouts, nutrition, mood, sleep) have been built yet.

**Completed (Phase 0):**

- Next.js + TypeScript + App Router scaffolding
- Supabase Auth (email + password, all auth screens)
- Drizzle ORM setup (example schema only — domain tables not yet created)
- PWA configuration (Serwist)
- UI foundation (shadcn/ui new-york style, Tailwind, Lucide, Toaster)
- Core library installation (Conform, Zod, Zustand, next-safe-action, date-fns, nuqs, Motion, Recharts)

**Not yet started:**

- Database schema v1 (domain tables)
- Error handling foundation (handleServerError on actionClient)
- Dev seed data script
- All MVP features (1–17)

## Quick Navigation

- **Schema**: `db/schema.ts` — Single file (currently example users/posts tables)
- **DB Client**: `db/index.ts` — Drizzle client init with postgres.js
- **Server Actions**: `actions/example.ts` — Example action (replace per domain)
- **Safe Action Client**: `lib/safe-action.ts` — Bare `createSafeActionClient()` (no error handler yet)
- **Supabase Clients**: `lib/supabase/server.ts`, `lib/supabase/client.ts`, `lib/supabase/proxy.ts`
- **Utilities**: `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- **Formulas**: `lib/formulas/` — Pure functions (create here as features are built)
- **Components**: `components/` — Auth forms, shadcn/ui in `components/ui/`
- **Client State**: `stores/counter-store.ts` — Example Zustand store (replace per domain)
- **Providers**: `providers/counter-store-provider.tsx` — Example store provider
- **DB Queries**: `db/queries/` — Example CRUD files (select, insert, update, delete)
- **Drizzle Config**: `drizzle.config.ts` — Points at `db/schema.ts`, outputs to `lib/supabase/migrations/`

## Actual Architecture (How Code Works Today)

### Route Protection (proxy.ts)

`proxy.ts` at project root delegates to `lib/supabase/proxy.ts`:

```typescript
// proxy.ts — calls updateSession()
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}
```

`lib/supabase/proxy.ts` handles session refresh via `getClaims()` and redirects unauthenticated users to `/auth/login`. Currently only redirects non-auth, non-root paths.

### Supabase Clients

Three variants, all using `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (not `ANON_KEY`):

- **`lib/supabase/server.ts`** — `async function createClient()` for server components/actions. Uses `cookies()` from `next/headers`.
- **`lib/supabase/client.ts`** — `function createClient()` for browser. Uses `createBrowserClient`.
- **`lib/supabase/proxy.ts`** — `async function updateSession()` for middleware. Calls `supabase.auth.getClaims()` for JWT validation.

### Server Actions (next-safe-action)

Current pattern uses `.inputSchema()` (not `.schema()`):

```typescript
// actions/example.ts — ACTUAL current pattern
export const exampleAction = actionClient.inputSchema(schema).action(async ({ parsedInput: { name } }) => {
  return { message: `Hello, ${name}!` };
});
```

**Current `lib/safe-action.ts` is bare** — no error handler configured yet:

```typescript
export const actionClient = createSafeActionClient();
```

### Drizzle ORM

- **Config**: `drizzle.config.ts` — schema at `./db/schema.ts`, migrations output to `./lib/supabase/migrations`
- **Client**: `db/index.ts` — uses `postgres` driver with `POSTGRES_URL`, `prepare: false`
- **Schema**: `db/schema.ts` — currently example `usersTable` and `postsTable` (TODO: replace with domain tables)

### shadcn/ui

- Style: `new-york`
- Base color: `neutral`
- CSS variables: enabled (HSL in `app/globals.css`)
- Icon library: `lucide`
- Installed components: button, card, input, label, badge, checkbox, dropdown-menu, sonner (toast)

### Root Layout

- Providers: `ThemeProvider` (next-themes), `NuqsAdapter`, `CounterStoreProvider` (example — replace)
- Global `<Toaster />` from sonner
- Font: Geist Sans

## Target Architecture (What to Build)

When building features, follow these patterns from ROADMAP.md:

### Server Action Pattern (target)

```typescript
// lib/safe-action.ts — ADD handleServerError
export const actionClient = createSafeActionClient({
  handleServerError(error) {
    console.error("Server action error:", error);
    return "An unexpected error occurred.";
  },
});

// actions/{domain}/{action-name}.ts
export const createWorkout = actionClient.inputSchema(createWorkoutSchema).action(async ({ parsedInput }) => {
  // ... Drizzle insert
});
```

### Database Schema Pattern (target)

When replacing `db/schema.ts`, split into `db/schema/` directory:

```md
db/schema/
├── index.ts # Re-exports all tables
├── exercises.ts # MVP-1
├── workouts.ts # MVP-2, MVP-3
├── food-items.ts # MVP-5
├── hydration.ts # MVP-8
├── mood.ts # MVP-9, MVP-10
├── sleep.ts # MVP-12, MVP-13, MVP-14
├── goals.ts # MVP-17
├── user-profiles.ts # Core profile + settings
└── body-measurements.ts # MVP-15
```

Update `drizzle.config.ts` schema path to `"./db/schema/index.ts"` when migrating.

### Query Pattern (target)

Organize by domain instead of by CRUD operation:

```md
db/queries/
├── workouts.ts # getWorkoutHistory(), getExercisePR(), etc.
├── nutrition.ts # getDailyNutrition(), getMacroTarget(), etc.
└── ...
```

## Critical Formulas

All live in `lib/formulas/` with tests in `lib/formulas/__tests__/`.

### 1RM Estimation (Capped Epley + Brzycki)

```typescript
// lib/formulas/1rm.ts
export function estimate1RM(weight: number, reps: number): number | null {
  if (reps <= 0 || weight <= 0) return null;
  if (reps === 1) return weight;
  if (reps > 20) return null;
  if (reps <= 10) return weight * (1 + reps / 30); // Epley
  return weight * (36 / (37 - reps)); // Brzycki
}
```

### Mifflin-St Jeor TDEE

```typescript
// lib/formulas/tdee.ts
// Male BMR: 10 × weight_kg + 6.25 × height_cm - 5 × age + 5
// Female BMR: 10 × weight_kg + 6.25 × height_cm - 5 × age - 161
// TDEE = BMR × activity_multiplier (1.2 / 1.375 / 1.55 / 1.725 / 1.9)
```

### Sleep Score (0–100)

```typescript
// lib/formulas/sleep-score.ts
// 0.4 × duration_score + 0.4 × quality_score + 0.2 × consistency_score
```

See `memory/formulas.md` for full implementations and test requirements.

## Conventions

### Timezone

Store UTC (`timestamptz`), display in user's IANA timezone (`@date-fns/tz`).
Sleep date = bedtime's local date (not wake time).
Streaks use user timezone for day boundaries.

### Unit System

Global `unit_system` on `user_profiles` (imperial/metric). Applies to weights, hydration, height, distance.

### Testing

Vitest for formula unit tests only. No UI or integration tests.
Location: `lib/formulas/__tests__/{name}.test.ts`

## Implementation Order

Phase 0 (setup) → Phase 1 (workouts) → Phase 2 (nutrition) → Phase 3 (mood) → Phase 4 (sleep) → Phase 5 (dashboard).

Never skip ahead. See @ROADMAP.md for full details.

## Environment Variables

Validated at build time in `next.config.ts` via Zod. Build fails immediately if any are missing.

Key vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, `SUPABASE_SERVICE_ROLE_KEY`

## Helpful Commands

```bash
pnpm dev                  # Start dev server
pnpm build                # Production build (validates env vars)
pnpm lint                 # ESLint
pnpm format               # Prettier (write)
pnpm format:check         # Prettier (check only, no write)
pnpm vitest               # Unit tests (formulas only)
drizzle-kit push          # Push schema to dev database
drizzle-kit generate      # Generate migration files
```

## TODOs in Codebase

These are known placeholder items to replace as features are built:

- `db/schema.ts` — Replace example users/posts tables with domain schema
- `stores/counter-store.ts` — Replace with domain stores (active workout, timer, wizard)
- `actions/example.ts` — Replace with domain actions
- `db/queries/*` — Replace CRUD examples with domain queries
- `app/layout.tsx` — Update app name, font, color, startup images
- `app/globals.css` — Update color palette
- `lib/safe-action.ts` — Add `handleServerError` callback
- `providers/counter-store-provider.tsx` — Replace with domain providers

## External APIs

### Open Food Facts (MVP-5)

- Search: `GET https://world.openfoodfacts.org/cgi/search.pl?search_terms={query}&json=1`
- Barcode: `GET https://world.openfoodfacts.org/api/v0/product/{barcode}.json`
- 5-second timeout. On failure: toast "Couldn't reach the food database."

### wger.de (MVP-1 seed script only)

- API: `https://wger.de/api/v2/` — CC-licensed exercise images
- Seed-time only, never runtime

## References

- **@ROADMAP.md** — Complete feature specifications
- **memory/formulas.md** — All formula implementations with examples
- **memory/api-integrations.md** — API details and implementation examples
- **memory/schema-decisions.md** — Database design rationale
