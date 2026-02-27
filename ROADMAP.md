# Fitness App — Implementation Roadmap

Last updated: February 2026
Timeline: 1–3 months
Total: 29 sub-features → 17 MVP + 12 Post-MVP

## Tech Stack

| Category       | Tools                                         | Role                                                             |
| -------------- | --------------------------------------------- | ---------------------------------------------------------------- |
| Dev workflow   | pnpm, Git, GitHub, Claude Code                | Package management, version control, AI-assisted development     |
| Framework      | Next.js, TypeScript (strict)                  | SSR/SSG, server-first architecture, type safety                  |
| Styling & UI   | Tailwind CSS, shadcn/ui, Lucide React, Motion | Utility-first CSS, accessible components, icons, animations      |
| Database & ORM | Supabase, Drizzle ORM                         | Hosted Postgres + Auth + RLS, type-safe schema and queries       |
| Auth           | Supabase Auth (email + password only)         | Token hash OTP auth flow, session management, RLS enforcement    |
| Server logic   | next-safe-action, Zod                         | Type-safe server actions with input validation                   |
| Client state   | Zustand                                       | Ephemeral client-only state                                      |
| Forms          | Conform, Zod                                  | Server-first form handling with progressive enhancement          |
| Charting       | Recharts                                      | All line charts, bar charts, pie charts, and progress visuals    |
| Dates          | date-fns                                      | Duration calculations, weekly/monthly aggregations, streak logic |
| PWA            | Serwist                                       | Service worker registration, app shell caching, manifest         |
| URL state      | nuqs                                          | Type-safe URL query params for dashboard filter/view persistence |
| Barcode        | html5-qrcode                                  | Browser camera barcode scanning for food logging                 |
| Env validation | Zod                                           | Environment variable validation                                  |
| Deploy         | Vercel                                        | CI/CD via GitHub push, preview deploys, serverless hosting       |
| Testing        | Vitest                                        | Unit tests for critical business logic only                      |

## Recommended Configurations

**Supabase:**

- Enable Row Level Security (RLS) on every table from day one

**Drizzle:**

- Use Drizzle Kit for migrations (drizzle-kit push for development, drizzle-kit migrate for production)

## Project Structure

```md
├── app/ # Next.js App Router routes
│ ├── auth/ # Auth routes
│ │ ├── login/page.tsx
│ │ ├── sign-up/page.tsx
│ │ ├── sign-up-success/page.tsx
│ │ ├── forgot-password/page.tsx
│ │ ├── update-password/page.tsx
│ │ ├── confirm/route.ts # Email confirmation callback (route handler)
│ │ └── error/page.tsx
│ ├── (protected)/ # Authenticated app route group
│ │ ├── layout.tsx # Navigation shell (bottom tabs / sidebar)
│ │ ├── dashboard/
│ │ ├── workouts/
│ │ ├── nutrition/
│ │ ├── mood/
│ │ ├── sleep/
│ │ └── settings/
│ ├── offline/page.tsx # PWA offline fallback page
│ ├── layout.tsx # Root layout (providers, global styles)
│ ├── manifest.ts # PWA manifest
│ └── sw.ts # Serwist service worker
├── proxy.ts # Supabase Auth session refresh + route protection
├── actions/ # Server actions organized by domain
│ ├── workout/ # createWorkout, updateTemplate, etc.
│ ├── nutrition/ # logFood, updateCalorieTarget, etc.
│ ├── mood/ # createCheckin, createJournalEntry, etc.
│ ├── sleep/ # logSleep, etc.
│ ├── goals/ # createGoal, etc.
│ └── auth/ # signUp, signIn, signOut, resetPassword
├── components/
│ ├── ui/ # shadcn/ui components
│ └── [feature]/ # Feature-specific components (workout/, nutrition/, etc.)
├── db/
│ ├── schema/ # Drizzle table definitions per domain
│ ├── queries/ # Reusable query functions per domain
│ └── index.ts # Drizzle client initialization
├── lib/
│ ├── formulas/ # Pure functions: 1RM, sleep score, Mifflin-St Jeor, etc.
│ ├── safe-action.ts # next-safe-action client
│ ├── supabase/ # Supabase client helpers
│ │ ├── server.ts
│ │ ├── client.ts
│ │ └── proxy.ts # Session update helper (used by middleware.ts)
│ └── utils.ts # General utilities
├── providers/ # React context providers (e.g. Zustand store provider)
└── stores/ # Zustand stores (active workout, timer state)
```

## MVP / Post-MVP Split Summary

| Core Feature           | MVP            | Post-MVP       |
| ---------------------- | -------------- | -------------- |
| Workout Tracking       | 4 sub-features | 0 sub-features |
| Nutrition Tracking     | 4 sub-features | 2 sub-features |
| Mental Health Tracking | 3 sub-features | 2 sub-features |
| Sleep Tracking         | 3 sub-features | 1 sub-feature  |
| Dashboard & Analytics  | 3 sub-features | 3 sub-features |
| Cross-Cutting          | —              | 4 sub-features |
| **Total**              | **17**         | **12**         |

---

## MVP Features — Implementation Order

Guiding principles for this order:

1. **Dependencies first.** Foundational data models must exist before anything can reference them.
2. **Group by feature area.** Build one tracker end-to-end before moving to the next so each feature is usable as you go.
3. **Hardest first.** Workout and nutrition tracking have the most complex data models. Tackling them early establishes reusable patterns (CRUD, logging, history views) that speed up mental health and sleep.
4. **Dashboard last.** It consumes data from all four trackers, so it's built once the data sources exist.

---

## Phase 0: Project Setup

Not a feature, but a prerequisite. Estimated time: 4–6 days.

### 0.1 Scaffolding and Tooling

- [x] **Next.js + TypeScript scaffolding** — pnpm create next-app with App Router. Set up folder structure per the project structure section above: app/ (routes with auth and (protected) route groups), components/, db/ (Drizzle schema), lib/ (utilities, Supabase clients, formulas), actions/ (server actions by domain), stores/ (Zustand).
- [x] **Supabase setup** — Create Supabase project (free tier). Configure Supabase Auth with token hash OTP flow. Enable email auth only (no OAuth). Set up environment variables and validate them with Zod.
- [x] **Drizzle ORM setup** — Install drizzle-orm and drizzle-kit. Configure drizzle.config.ts to point at Supabase Postgres. Create initial schema files in db/schema/. Run drizzle-kit push for development.
- [x] **PWA configuration** — Install and configure Serwist. Create manifest.ts with app name, icons, theme color, and display: "standalone". Register the service worker for caching.
- [x] **UI foundation** — Install and initialize shadcn/ui with Tailwind CSS. Install Lucide React for icons. Set up global layout with navigation shell (bottom tabs for mobile, sidebar for desktop). Configure responsive breakpoints. Add global `<Toaster />` component for error/success toasts.
- [x] **Core libraries** — Install and configure: Conform + Zod (forms and validation), Zustand (client-only state), next-safe-action (type-safe server actions), date-fns, nuqs, Motion.
- [ ] **Database schema v1** — Design and deploy the initial schema for all tables using Drizzle. Even if features aren't built yet, having the schema defined early prevents rework. Apply RLS policies to every table: users can only read/write their own rows.

### 0.2 Auth Flow (Supabase Email + Password)

No OAuth. Email and password only. Keeps the auth surface small and avoids third-party configuration.

**Screens and Routes**

| Route                 | Purpose                                                    |
| --------------------- | ---------------------------------------------------------- |
| /auth/login           | Email + password sign-in form                              |
| /auth/sign-up         | Email + password registration form with email confirmation |
| /auth/sign-up-success | Post-signup confirmation message page                      |
| /auth/forgot-password | Email input → sends Supabase password reset email          |
| /auth/update-password | New password form (landed on via Supabase magic link)      |
| /auth/confirm         | Email confirmation callback (route handler, not a page)    |
| /auth/error           | Auth error display                                         |

All auth forms use Conform + Zod for validation and next-safe-action for submission. Server actions call Supabase Auth methods (supabase.auth.signUp, supabase.auth.signInWithPassword, etc.).

- [ ] **Auth implementation** — Build all four auth screens (login, sign-up, forgot password, update password) using Conform + Zod + next-safe-action. Create the three Supabase client helpers (`lib/supabase/server.ts`, `lib/supabase/client.ts`, `lib/supabase/proxy.ts`). Implement `proxy.ts` at the project root for session refresh and route protection. Test the full flow: sign-up → confirm email → login → access protected route → logout.

**Session Management**

Supabase Auth with token hash OTP flow handles sessions via secure HTTP-only cookies. The setup requires three Supabase client variants:

- **Server client** (`lib/supabase/server.ts`): Used in server components and server actions. Reads the session from cookies.
- **Client client** (`lib/supabase/client.ts`): Used in client components (rare — only for Supabase Realtime if added later).
- **Middleware helper** (`lib/supabase/proxy.ts`): Contains the `updateSession` function called by `proxy.ts` to refresh the session token on every request.

**Route Protection**

`proxy.ts` at the project root runs on every request and does two things:

1. Refreshes the session by calling `supabase.auth.getClaims()` — this validates the JWT server-side. Do not use `getSession()` which only reads from the cookie without server-side validation.
2. Redirects unauthenticated users trying to access `(protected)/_` routes to `/auth/login`. Redirects authenticated users trying to access `auth/_` routes to `/dashboard`.

**Email Confirmation**

Supabase sends a confirmation email on signup by default. The user must confirm before they can log in. Configure the confirmation redirect URL in Supabase dashboard to point to your app's `/auth/confirm` route handler, which then redirects to `/auth/login` with a success message.

**Password Requirements**

Enforced via Zod schema in the signup form: minimum 8 characters. Supabase Auth enforces its own server-side minimum as a second layer.

**Rate Limiting**

Supabase Auth has built-in rate limiting on auth endpoints, but verify the defaults in the Supabase dashboard (Authentication → Rate Limits). Ensure login attempts are capped (e.g., 30 per hour per IP) to prevent brute-force attacks. No additional implementation needed if Supabase defaults are acceptable, but document what's enabled.

**Account Deletion**

- [ ] Build a "Delete Account" option in the settings page. Server action calls `supabase.auth.admin.deleteUser()` (requires service role key, so this must be a server action, never client-side). Cascade-delete all user data across all tables via Drizzle (or rely on ON DELETE CASCADE foreign keys if configured). Show a confirmation dialog before proceeding. Even for a portfolio project, this is increasingly expected and demonstrates awareness of data privacy practices.

### 0.3 Error Handling and Loading State Strategy

**Server Action Errors (next-safe-action)**

Every server action uses next-safe-action's built-in error handling pipeline. Define a single actionClient with a global error handler:

```typescript
// lib/safe-action.ts
import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    // Log to console in development, to an error service in production
    console.error("Server action error:", error);

    // Return a user-friendly message (never expose raw error details)
    if (error instanceof DatabaseError) {
      return "Something went wrong saving your data. Please try again.";
    }
    return "An unexpected error occurred.";
  },
});
```

On the client, every server action call checks the serverError and validationErrors fields returned by next-safe-action:

```typescript
const { execute, result, isExecuting } = useAction(someAction);

// result.serverError → string from handleServerError
// result.validationErrors → per-field Zod errors (handled by Conform automatically)
```

Display serverError messages via a shadcn/ui toast — one global `<Toaster />` in the root layout. No per-feature error UI needed.

- [ ] **Error handling foundation** — Add the `handleServerError` callback to the existing `actionClient` in `lib/safe-action.ts` (the file exists but currently uses bare `createSafeActionClient()` with no config). Create skeleton components for common layouts (list, card grid, detail view). Create a root error boundary in `(protected)/layout.tsx`.

**Loading States**

| Scenario                      | Pattern                                                                                                                                                                                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server component data loading | loading.tsx files in each route directory. Display skeleton shimmer components (shadcn/ui Skeleton) matching the shape of the final content.                                                                                                       |
| Server action submissions     | useTransition wrapping the action call. Disable the submit button and show a spinner while isPending is true. Conform integrates with useFormStatus for this automatically.                                                                        |
| Optimistic updates            | useOptimistic (React 19) for actions where instant feedback matters: toggling a hydration log, marking a medication as taken, logging a set during a workout. The optimistic value renders immediately; if the server action fails, it rolls back. |
| Navigation between routes     | Next.js App Router handles this with loading.tsx. No additional work.                                                                                                                                                                              |

**Error Boundaries**

Place a React error boundary at the `(protected)/layout.tsx` level as a catch-all for unexpected runtime errors. Display a "Something went wrong" fallback with a retry button. This is a safety net — most errors should be caught and handled gracefully by the server action pipeline above.

**External API Errors (Open Food Facts)**

The Open Food Facts proxy server action should handle three cases: successful response (return parsed data), no results found (return empty array — not an error), and API unreachable/timeout (return a serverError message: "Couldn't reach the food database. Try again or add a custom food item."). Set a 5-second timeout on the fetch call.

### 0.4 Timezone Convention

A cross-cutting decision that affects every feature — workout dates, sleep dates, mood check-in dates, streak calculations, weekly aggregations, and date-fns grouping logic all depend on it. Retrofitting this later is painful.

**Convention: store UTC, display local.**

- All `timestamptz` columns store UTC (Postgres default with `timestamptz`).
- Store the user's IANA timezone string (e.g., "America/Los_Angeles") on `user_profiles`, captured at signup or first profile setup.
- On the server, use this timezone to determine the user's "logical day" for date-based queries (e.g., "today's food log," "last night's sleep"). The project uses date-fns v4, which requires the separate `@date-fns/tz` package for IANA timezone support. Use `@date-fns/tz`'s `TZDate` or `tz` helper to convert when computing date boundaries.
- On the client, display all timestamps in the user's local time.
- **Sleep edge case:** A sleep log started at 11:30 PM on Monday and ending 7:00 AM Tuesday belongs to Monday's date (the night the user went to bed). The `date` column on `sleep_logs` should reflect the bedtime's logical day, not the wake time's.
- **Streak edge case:** Streak calculations must use the user's timezone to determine day boundaries. A workout logged at 11:55 PM Pacific should count as that day, not the next day in UTC.
- **Travel edge case:** If the user changes their timezone in settings, historical data stays as-is. Only new entries use the updated timezone. Do not retroactively shift dates.

### 0.5 Unit System Convention

Define a single global unit preference on `user_profiles` early — it affects workout weights, hydration amounts, body measurements, and height input across the entire app.

- Add a `unit_system` field (enum: imperial / metric) to `user_profiles`, set during onboarding or profile setup.
- **Workout weights:** display in lbs (imperial) or kg (metric). Store the raw number + unit_system reference. The plate calculator (MVP-4) should respect this setting for bar weight and plate denominations.
- **Hydration:** Store amounts in a unit-agnostic `amount` integer column (not `amount_ml`). Display as oz (imperial) or ml (metric). Quick-log preset buttons adapt to the user's unit preference (e.g., 8/16/24/32 oz vs. 250/500/750/1000 ml).
- **Body measurements:** The existing `unit_system` column on `body_measurements` can be removed in favor of the global preference on `user_profiles`. Weight, waist, chest, and arms all follow the global setting.
- **Height:** Display in ft/in (imperial) or cm (metric) on the nutrition profile form.
- **Cardio distance:** Display in miles (imperial) or kilometers (metric).

### 0.6 Development Seed Data

When you reach MVP-16 (dashboard), you'll need weeks of realistic data across all four trackers to test charts, aggregations, and empty-state handling. Manually logging fake entries is tedious and error-prone.

- [ ] **Build a dev-only seed script** (`src/db/seed-dev.ts`) that generates 30–90 days of sample data for a test user across all tables: workouts with sets (both strength and cardio), food logs with macro variety, mood check-ins with varying scores and activity tags, sleep logs with realistic bedtime variance and factors, hydration logs, body measurements with a gradual weight trend, and a few goals with active streaks.
- Use realistic distributions (not uniform random) — e.g., mood scores should cluster around 3–4 with occasional 1s and 5s; sleep durations should center around 7 hours with variance.
- Guard this script so it only runs in development (check `NODE_ENV`). Never expose it in production.
- This script also serves as a smoke test for your schema — if the seed runs cleanly, your table relationships are correct.

---

## Phase 1: Workout Tracking

The most complex data model in the app. Sets the architectural patterns all other features will follow. Tracks strength exercises (sets, reps, weight) and cardio (type, duration, distance). Yoga/flexibility is not in scope.

### MVP-1 · Exercise Library (built-in + custom)

Feature 1.1 · Dependencies: None · Priority: Foundation

Stack used: Drizzle (schema + queries), next-safe-action + Conform + Zod (forms), shadcn/ui (list, search input, form fields)

- [ ] Define exercises table in Drizzle schema: id, user_id (nullable — null for built-in exercises, non-null for user-created), name, description (text — general description of the exercise), form_description (text — detailed instructions on proper form, cues, and common mistakes), muscle_group (enum), category (enum: strength / cardio), image_url (text, nullable), video_url (text, nullable), created_at. Note: No is_custom boolean. Custom exercises are identified by WHERE user_id IS NOT NULL. Built-in exercises have user_id = NULL. This avoids a redundant column that could drift out of sync.

**Media requirement:** Every built-in exercise must have at least one of image_url or video_url (enforced by a CHECK constraint: `CHECK (user_id IS NOT NULL OR image_url IS NOT NULL OR video_url IS NOT NULL)`). Custom exercises do not require media but users may optionally provide a YouTube URL.

**Media sourcing strategy:**

- **Images:** Use the [wger.de REST API](https://wger.de/api/v2/) (free, open-source, no API key required) to source exercise images for built-in exercises. The API provides CC-licensed exercise illustrations. Fetch and store the image URLs in the seed file. For exercises not covered by wger, use placeholder images or omit (video_url covers the gap).
- **Videos:** Store YouTube embed URLs (e.g., `https://www.youtube.com/embed/{videoId}`) for form demonstration videos. Curate these manually during seed file creation — select one high-quality form video per exercise from reputable fitness channels. Display via a responsive iframe or YouTube embed component.
- **Custom exercises:** Users can optionally paste a YouTube URL when creating a custom exercise. No image upload for MVP (avoids file storage complexity). Image upload can be added post-MVP if needed.

- [ ] Create a JSON seed file with 50–100 built-in exercises covering major compound and isolation strength movements (bench press, squat, deadlift, overhead press, rows, curls, tricep extensions, etc.) and common cardio types (running, cycling, rowing, elliptical, swimming, jump rope, etc.). Each entry includes: name, description, form_description with 3–5 cues for proper technique, muscle_group, category, image_url (from wger API), and video_url (curated YouTube embed link). Run seed via a Drizzle migration or script.
- [ ] Build searchable exercise list page with Drizzle queries filtered by muscle group and category. Server component fetches data directly; use loading.tsx skeleton for the loading state. Display exercise thumbnail (image or video preview) in the list.
- [ ] Build "Add Custom Exercise" form using Conform + Zod for validation: name, description, form description, muscle group, category (strength / cardio), optional YouTube video URL. Submitted via a next-safe-action server action that inserts into Supabase via Drizzle. Call revalidatePath on success to refresh the exercise list.
- [ ] Build exercise detail view showing image and/or embedded video, form description with proper technique cues, general description, and muscle group.

### MVP-2 · Workout Logging and History

Feature 1.2 · Dependencies: 1.1 Exercise Library · Priority: Core

Stack used: Drizzle (schema + queries), next-safe-action + Conform + Zod (logging form), Zustand (active workout session state), Recharts (per-exercise history chart), date-fns (date formatting)

- [ ] Define workouts table: id, user_id, date, start_time, end_time, notes, template_id (nullable FK).
- [ ] Define workout_sets table: id, workout_id, exercise_id, set_number, weight (decimal, nullable — null for cardio), reps (integer, nullable — null for cardio), is_warmup (boolean, default false), duration_minutes (integer, nullable — null for strength), distance (decimal, nullable — null for strength or cardio without distance), distance_unit (enum: miles / km, nullable). **Note:** Strength sets use weight + reps. Cardio sets use duration_minutes + optional distance. The exercise's category determines which fields are shown in the UI and which are expected to be non-null.
- [ ] Build "Start Workout" flow: use Zustand to hold the in-progress workout state (exercises, sets being logged) on the client.
  - **Polymorphic set logging:** When the user adds an exercise, check its category. For strength exercises, show weight + reps + warmup toggle fields. For cardio exercises, show duration + optional distance fields. Use the exercise category to conditionally render the correct Conform form fields.
  - **Session persistence:** A workout can last 45–90 minutes, and Zustand state lives only in memory — an accidental tab close, phone death, or browser eviction loses everything. Mitigate this by persisting the Zustand store to `sessionStorage` via Zustand's `persist` middleware (survives accidental tab closes and page refreshes, auto-clears when the tab is closed intentionally). On app load, check for a persisted in-progress workout and prompt the user to resume or discard.
  - On each strength set entry, display the previous session's numbers for that exercise inline (fetched via server component or server action).
  - On "Finish Workout," submit all sets to Supabase via a next-safe-action server action, clear the persisted state. Use useTransition to show a saving indicator. Call revalidatePath on success.
- [ ] Build workout history page: server component listing past workouts sorted by date with summary stats. For strength: total volume (sets × weight × reps), exercise count. For cardio: total duration, total distance. Overall: workout duration. Use loading.tsx for the skeleton state.
- [ ] Build per-exercise history:
  - **Strength exercises:** All logged sets over time with a Recharts line chart showing weight progression.
  - **Cardio exercises:** Duration and distance over time with a Recharts line chart showing pace or duration progression.
- [ ] Auto-detect and display personal records (PRs) per exercise:
  - **Strength PRs:** Heaviest weight, most reps at a given weight, highest estimated 1RM. Compute via Drizzle aggregate queries.
  - **Cardio PRs:** Longest duration, farthest distance, fastest pace (distance / duration). Compute via Drizzle aggregate queries.

**1RM Estimation — Capped Epley with Brzycki Fallback (strength exercises only):**

The Epley formula (weight × (1 + reps / 30)) is the most widely used 1RM estimator but becomes unreliable above ~10 reps because it extrapolates linearly while actual strength curves are non-linear. The Brzycki formula (weight × 36 / (37 - reps)) is more conservative at higher rep ranges and produces an asymptote at 37 reps (reflecting real-world limits).

Use this hybrid approach:

- 1–10 reps: Epley formula — weight × (1 + reps / 30)
- 11+ reps: Brzycki formula — weight × 36 / (37 - reps)
- Cap at 20 reps: Do not estimate 1RM from sets above 20 reps. The estimation error is too large to be useful. Display "N/A — too many reps for reliable estimate" instead.

```typescript
export function estimate1RM(weight: number, reps: number): number | null {
  if (reps <= 0 || weight <= 0) return null;
  if (reps === 1) return weight;
  if (reps > 20) return null; // Unreliable above 20 reps
  if (reps <= 10) return weight * (1 + reps / 30); // Epley
  return weight * (36 / (37 - reps)); // Brzycki
}
```

Vitest: Write unit tests for the 1RM estimation function covering: 1 rep (returns weight), 5 reps (Epley), 15 reps (Brzycki), 21 reps (returns null), and zero/negative inputs (returns null).

### MVP-3 · Workout Templates and Routines

Feature 1.3 · Dependencies: 1.1 Exercise Library · Priority: Core

Stack used: Drizzle (schema + queries), next-safe-action + Conform + Zod (template form), shadcn/ui (list, form, buttons)

- [ ] Define workout_templates table: id, user_id, name, description, created_at.
- [ ] Define template_exercises table: id, template_id, exercise_id, sort_order, target_sets (integer, nullable — for strength), target_reps (integer, nullable — for strength), target_duration_minutes (integer, nullable — for cardio), target_distance (decimal, nullable — for cardio). **Note:** Strength exercises use target_sets + target_reps. Cardio exercises use target_duration_minutes + optional target_distance. The exercise's category determines which target fields are shown.
- [ ] Build "Create Template" form: name field, then add exercises with targets. For strength exercises, show target sets/reps fields. For cardio exercises, show target duration/distance fields. Use numbered list with move-up/move-down buttons to reorder (drag-and-drop deferred to post-MVP with @dnd-kit).
- [ ] Build "Start Workout from Template" flow: pre-populate the workout logging screen (MVP-2) with the template's exercises and targets, respecting the strength/cardio field distinction.
- [ ] Build template list page with edit and delete actions.

### MVP-4 · In-Workout Tools

Feature 1.4 · Dependencies: None · Priority: Enhancement

Stack used: Zustand (timer state), Motion (timer animation), shadcn/ui (inputs, display)

- [ ] Build rest timer: configurable default duration (e.g., 90 seconds), stored in Zustand. Starts automatically after logging a strength set or manually via button. Visible countdown using Motion for smooth animation. Audio beep and/or vibration (via navigator.vibrate) alert at zero.
- [ ] Build plate calculator: input a target weight, select bar weight (45 lb / 20 kg — respects global unit_system setting), display which plates to load on each side. Pure client-side math — no database needed.

---

## Phase 2: Nutrition Tracking

Second most complex feature due to external API integration (food database) and barcode scanning. Recipe builder has been moved to Post-MVP to keep this phase focused on core logging.

### MVP-5 · Food Logging

Feature 2.1 · Dependencies: None · Priority: Foundation

Stack used: Drizzle (schema + queries), next-safe-action + Conform + Zod (forms), html5-qrcode (barcode scanning), Open Food Facts API (free, no key required)

- [ ] Define food_items table: id, user_id (nullable — null for API-sourced items cached locally), name, brand, serving_size, serving_unit, calories, protein, carbs, fat, fiber (decimal, nullable), micronutrients (JSONB for flexibility — stores vitamins and minerals as key-value pairs), barcode (nullable), source (enum: api / custom). Note: The recipe source enum value is deferred to Post-MVP-2 when the recipe builder is implemented. **Micronutrient schema note:** Since vitamins and minerals are display-only per food item (no daily aggregation or targets in MVP), JSONB is the right choice. The JSONB field stores whatever Open Food Facts provides (e.g., `{ "vitamin_c_mg": 12, "iron_mg": 2.5, "calcium_mg": 150 }`). If daily micronutrient totals with targets are added post-MVP, consider migrating to a structured `food_micronutrients` join table at that point.
- [ ] Define food_log table: id, user_id, food_item_id, date, meal_type (enum: breakfast / lunch / dinner / snack), servings (decimal), notes.
- [ ] Integrate Open Food Facts API (fully free, no API key needed): build a server action that proxies search requests to <https://world.openfoodfacts.org/cgi/search.pl> and barcode lookups to <https://world.openfoodfacts.org/api/v0/product/{barcode}.json>. Set a 5-second timeout. On failure, show a toast: "Couldn't reach the food database. Try again or add a custom food item." Parse and extract fiber and micronutrient data from the API response's `nutriments` object. Optionally save results to food_items table for future lookups.
- [ ] Build food search: text input that queries Open Food Facts via server action, displays results with name, brand, and calorie preview. Selecting a result opens a serving size form (Conform + Zod) and logs to the food_log table via next-safe-action. Use useTransition for loading state on search.
- [ ] Build barcode scanner: use html5-qrcode to access the device camera and scan barcodes. On scan, look up the barcode via Open Food Facts API. Display result and allow logging.
- [ ] Build "Add Custom Food" form for homemade meals with manual nutrition entry (Conform + Zod). Fields: name, brand (optional), serving size/unit, calories, protein, carbs, fat, fiber (optional), plus an optional "Add micronutrients" expandable section for vitamins/minerals.
- [ ] Build daily food log view organized by meal slot (breakfast, lunch, dinner, snacks) with running calorie and macro totals per meal. Server component fetches data; loading.tsx skeleton for initial load.

### MVP-6 · Calorie, Macro, and Micronutrient Tracking

Feature 2.2 · Dependencies: 2.1 Food Logging · Priority: Core

Stack used: Drizzle (aggregate queries), Recharts (progress bars, pie chart), Conform + Zod (profile/target forms), next-safe-action

- [ ] **Build onboarding wizard** for first-time nutrition profile setup. A step-by-step flow (3–4 screens) that guides the user through: (1) Basic info — weight, height, age, sex; (2) Activity level — sedentary, lightly active, moderately active, very active, extra active; (3) Goal — lose weight, maintain, gain weight; (4) Review — show calculated calorie target and suggested macro split, allow adjustment before saving. Use Zustand or React state to hold wizard progress client-side. On completion, save all fields to the `user_profiles` table via next-safe-action. This wizard only appears once (check if profile exists); returning users go straight to the dashboard.
- [ ] **Build profile settings form** for editing nutrition inputs after initial setup. Same fields as the wizard (weight, height, age, sex, activity level, goal) presented as a standard Conform + Zod form in the settings page. Updates the existing `user_profiles` row via next-safe-action.
- [ ] Calculate personalized daily calorie target using the Mifflin-St Jeor equation. Implement as a pure function in src/lib/formulas/ and expose via server action.
- [ ] Allow users to set custom macro targets (protein, carbs, fat) as grams or percentages of total calories. Provide sensible defaults based on goal (e.g., higher protein for weight loss).
- [ ] Build daily nutrition dashboard: total calories consumed vs. target (Recharts progress bar), macro breakdown (Recharts pie chart or stacked bar), fiber consumed today (simple display), remaining allowances. Server component with loading.tsx skeleton.
- [ ] Build micronutrient detail view: expandable section showing vitamins, minerals, and fiber from each logged food item. Display-only — no daily targets or aggregated totals. Data sourced from the JSONB micronutrients field on food_items (populated from Open Food Facts API data or custom entries). Show "No micronutrient data available" for food items that lack this info.

Vitest: Write unit tests for the Mifflin-St Jeor calculation and macro percentage-to-grams conversion.

### MVP-7 · Nutrition Summaries

Feature 2.3 · Dependencies: 2.1 + 2.2 · Priority: Core

Stack used: Drizzle (aggregate queries with date-fns date ranges), Recharts (bar chart, line chart), date-fns (weekly/monthly grouping), nuqs (time range toggle)

- [ ] Build daily summary: total intake vs. targets with color-coded status (under / on target / over) using Tailwind conditional classes. Include fiber in the daily summary display.
- [ ] Build weekly summary: average daily calories, average macros, average fiber, day-by-day Recharts bar chart. Use date-fns startOfWeek / endOfWeek to compute date ranges.
- [ ] Build 30-day trend chart: Recharts line chart for calories and protein over the past month.

### MVP-8 · Hydration Tracking

Feature 2.4 · Dependencies: None · Priority: Core

Stack used: Drizzle (schema + queries), next-safe-action (quick-log action), Motion (fill animation), Recharts (history chart), date-fns (daily/weekly grouping)

- [ ] Define hydration_log table: id, user_id, date, amount (integer — stored in the user's preferred unit per the global unit_system setting on user_profiles), container_label (text, e.g., "Glass", "Bottle"), logged_at (timestamp).
- [ ] Calculate daily hydration goal from body weight stored in user profile (default formula: half body weight in oz, converted to user's preferred unit). Store as a user setting.
- [ ] Build quick-log UI: tappable preset buttons for common sizes (8 oz, 16 oz, 24 oz, 32 oz, custom — or metric equivalents per unit_system). Each tap fires a next-safe-action server action that inserts a row. Use useOptimistic for instant UI feedback — the progress bar updates immediately on tap, then confirms when the server action completes. No form needed — single-tap logging.
- [ ] Build daily progress display: Motion-animated fill graphic or Recharts progress bar showing amount consumed vs. goal.
- [ ] Build 7-day and 30-day hydration history view using Recharts bar chart.

---

## Phase 3: Mental Health Tracking

Simpler data models than workout/nutrition. Patterns established in Phases 1–2 will speed up development.

### MVP-9 · Mood and Wellness Check-In

Feature 3.1 · Dependencies: None · Priority: Foundation

Stack used: Drizzle (schema + queries), next-safe-action + Conform + Zod (check-in form), shadcn/ui (emoji selector, sliders, tag grid)

- [ ] Define mood_checkins table: id, user_id, date, timestamp, mood_score (smallint 1–5), energy_score (smallint 1–5), stress_score (smallint 1–5), activities (JSONB array of strings), notes (text, nullable).
- [ ] Build check-in flow: select mood via emoji or labeled 1–5 scale (1 = awful → 5 = great), then energy level (1–5), then stress level (1–5). Use shadcn/ui radio groups or custom emoji buttons. All on one screen, aim for under 15 seconds to complete.
- [ ] Build activity/context tag selector: grid of tappable shadcn/ui toggle buttons with Lucide icons (exercise, work, socializing, family, outdoors, resting, reading, etc.). Allow multiple selections. Store as JSONB array. Users can add custom tags.
- [ ] Build check-in history: list view of past entries with mood/energy/stress at a glance. Server component with loading.tsx skeleton.

### MVP-10 · Journaling

Feature 3.2 · Dependencies: None · Priority: Core

Stack used: Drizzle (schema + queries), next-safe-action + Conform + Zod (journal form), shadcn/ui (textarea, card)

- [ ] Define journal_entries table: id, user_id, date, prompt_text (text, nullable), entry_text (text), mood_checkin_id (nullable FK to mood_checkins — allows linking a journal to a check-in).
- [ ] Build journal entry screen: optional guided prompt displayed in a shadcn/ui card at the top, randomly selected from a hardcoded TypeScript array of 30–50 prompts. Free-text shadcn/ui textarea below. User can dismiss the prompt and write freely. Submit via next-safe-action.
- [ ] Prompt categories: general reflection, gratitude, stress processing, goal-oriented. Examples: "What's one thing that went well today?", "What are you grateful for right now?", "What's weighing on your mind?", "What's one small step you can take toward a goal tomorrow?"
- [ ] Build journal history: list of past entries with date and preview text. Tapping an entry opens full text. Server component with loading.tsx skeleton.

### MVP-11 · Mood Analytics

Feature 3.3 · Dependencies: 3.1 Mood Check-In · Priority: Core

Stack used: Drizzle (aggregate queries with joins), Recharts (line chart, bar chart), date-fns (date ranges), nuqs (time range toggle in URL)

Scope note: Cross-feature correlation cards live in Post-MVP-4. This feature focuses purely on mood-only analytics, which can be built and used immediately without depending on workout, sleep, or hydration data.

- [ ] Build mood trend chart: Recharts line chart showing mood, energy, and stress scores over 7 / 30 / 90 days. Use nuqs to persist the selected time range in the URL.
- [ ] Build activity breakdown: Recharts bar chart showing average mood per activity tag (e.g., average mood on days tagged "exercise" vs. "work"). Computed via Drizzle aggregate queries grouping by JSONB array contents.

Vitest: Write unit tests for the activity breakdown aggregation logic (average calculation, minimum data threshold check).

---

## Phase 4: Sleep Tracking

The simplest data model. All three sub-features share a single form and can be built together.

### MVP-12 · Sleep Logging

Feature 4.1 · Dependencies: None · Priority: Foundation

Stack used: Drizzle (schema + queries), next-safe-action + Conform + Zod (sleep form), shadcn/ui (time pickers, rating, toggle), date-fns (duration calculation, consistency computation)

- [ ] Define sleep_logs table: id, user_id, date, bedtime (timestamptz), wake_time (timestamptz), quality_rating (smallint 1–5), is_nap (boolean, default false), notes (text, nullable). **Note:** Do not store `duration_minutes` as a column. Compute it at query time using `date-fns differenceInMinutes(wake_time, bedtime)` or as a Postgres computed expression. Storing it creates a sync risk — if a user edits their bedtime or wake time, the duration column would need to be recomputed in every update action, which is easy to forget. The performance cost of computing on read is negligible.
- [ ] Build sleep entry form using Conform + Zod: bedtime picker, wake time picker, quality rating (1–5 stars or shadcn/ui slider), nap toggle. Duration is auto-calculated using date-fns differenceInMinutes and displayed in real-time as the user changes times.
- [ ] Build sleep history: list of recent entries showing date, duration, quality, and nap indicator. Server component with loading.tsx skeleton.
- [ ] Compute bedtime consistency: standard deviation of bedtime over the past 7 days using date-fns to normalize times. Display as a simple label: "consistent" (< 30 min deviation), "somewhat variable" (30–60 min), "irregular" (> 60 min).

### MVP-13 · Sleep Score

Feature 4.2 · Dependencies: 4.1 Sleep Logging · Priority: Core

Stack used: Pure TypeScript functions (computation), Drizzle (aggregate queries), date-fns (rolling windows)

- [ ] Compute a nightly sleep score (0–100) from three components: duration score (how close to the user's target, e.g., 8 hrs — 100 if at target, decreasing linearly), quality score (the 1–5 rating mapped to 0–100), and consistency score (based on bedtime deviation from 7-day average). Weighted formula: 0.4 × duration + 0.4 × quality + 0.2 × consistency.
- [ ] Display the score prominently on each sleep log entry and on the dashboard.
- [ ] Compute rolling sleep debt: sum of (target_duration − actual_duration) over a 7-day rolling window using date-fns subDays and Drizzle aggregate query. Display as "You're X hours behind this week" or "You're caught up."

Vitest: Write unit tests for the sleep score formula (all three components and the weighted combination) and the sleep debt calculation.

### MVP-14 · Sleep Notes/Factors

Feature 4.3 · Dependencies: 4.1 Sleep Logging · Priority: Core

Stack used: Drizzle (JSONB field on sleep_logs), shadcn/ui (toggle chips), Lucide React (factor icons)

- [ ] Add a factors JSONB column to sleep_logs with boolean keys: had_caffeine, had_alcohol, screen_before_bed, high_stress, late_meal, exercised_today.
- [ ] Display as a row of tappable shadcn/ui toggle chips with Lucide icons on the sleep entry form (MVP-12). Quick to tap, no typing required. Integrated into the same Conform form as the rest of the sleep entry.
- [ ] Show factor icons on sleep history entries so patterns are visible at a glance.

---

## Phase 5: Dashboard & Cross-Cutting Features

Built last because it aggregates data from all four trackers. By this point, you have real data to work with.

### MVP-15 · Body Measurements

Feature 5.4 · Dependencies: None · Priority: Foundation

Stack used: Drizzle (schema + queries), next-safe-action + Conform + Zod (entry form), Recharts (trend line chart)

- [ ] Define body_measurements table: id, user_id, date, weight (decimal), body_fat_pct (decimal, nullable), waist (decimal, nullable), chest (decimal, nullable), arms (decimal, nullable). **Note:** Unit system is determined by the global `unit_system` on `user_profiles` — no per-row unit_system column needed.
- [ ] Build entry form with Conform + Zod: weight (required), optional body fat % and circumference fields.
- [ ] Build trend chart: Recharts line chart for weight over time. Body fat and circumference as optional overlay lines toggled by the user.
- [ ] Used by: adaptive calorie adjustments (Post-MVP-10) and cross-domain correlation insights (Post-MVP-4).

### MVP-16 · Daily Summary View

Feature 5.1 · Dependencies: All four trackers (gracefully handles missing data) · Priority: Core

Stack used: Recharts (mini progress bars), shadcn/ui (cards, layout), nuqs (daily/weekly/monthly toggle in URL), date-fns (date ranges)

- [ ] Build the home screen / dashboard showing today's data at a glance. Server component fetches data from all four trackers in parallel using Promise.all over Drizzle queries. Display in shadcn/ui cards: workout status (completed today? key stats — strength volume or cardio duration — or "No workout logged"), calorie/macro progress vs. targets (Recharts mini progress bars), hydration progress (progress bar or Motion fill graphic), mood/energy/stress from latest check-in (emoji + scores), last night's sleep duration and score.
- [ ] Each card links to its respective tracker for detailed views.
- [ ] Gracefully handle missing data: if a user hasn't logged sleep yet, show "No sleep data — tap to log" instead of empty/broken UI. Use conditional rendering, not error states.
- [ ] **First-run experience:** A brand-new user lands on a completely empty dashboard with five empty cards, which can feel overwhelming. Consider a lightweight first-run state: either a brief onboarding step after signup ("Which trackers do you want to use?") that hides irrelevant cards, or a single welcome card that replaces the empty dashboard on first visit with suggested first actions ("Log your first workout," "Set your calorie target," etc.). This doesn't need to be elaborate — even a conditional banner that disappears after the user's first log entry improves the experience significantly. **Note:** If the user hasn't completed the nutrition onboarding wizard (MVP-6), the nutrition card should prompt them to do so.
- [ ] Add a nuqs-powered toggle to switch between daily / weekly / monthly views showing aggregated averages computed via Drizzle aggregate queries.
- [ ] Use loading.tsx with skeleton cards matching the dashboard layout for the loading state.

### MVP-17 · Goal Setting and Streaks

Feature 5.2 · Dependencies: Relevant tracker data for each goal · Priority: Core

Stack used: Drizzle (schema + queries), next-safe-action + Conform + Zod (goal creation form), date-fns (streak computation), shadcn/ui (goal cards, streak display), Lucide React (fire icon for streaks)

- [ ] Define goals table: id, user_id, category (enum: workout / nutrition / hydration / sleep / mood), metric (text), target_value (decimal), frequency (enum: daily / weekly), is_active (boolean), created_at.
- [ ] Compute streaks on the fly via Drizzle queries (no separate streaks table needed — avoids sync issues). For each goal, query the relevant tracker table, check each day/week against the target, and count consecutive successes. Also compute best-ever streak by scanning full history.
- [ ] Build goal creation flow using Conform + Zod: select a category and metric, set a target (e.g., "Work out 4x per week", "Sleep 7+ hours daily", "Log mood daily", "Drink 64 oz water daily").
- [ ] Build streak display: for each goal, show current streak count and best-ever streak. Visual streak counter with a Lucide fire icon and bold number.

Vitest: Write unit tests for the streak computation logic (consecutive day counting, edge cases like timezone boundaries).

---

## Post-MVP Features — Implementation Order

Guiding principles for this order:

1. **Quick wins first.** Features that extend existing data models with minimal new UI.
2. **Portfolio differentiators next.** Progress visualization and cross-domain insights are the features that make this app stand out.
3. **Engagement boosters after.** Push notifications and gamification increase retention and showcase product thinking.
4. **Standalone additions next.** Features that don't block anything else.
5. **Polish last.** Offline mode and data export are finishing touches.

### Post-MVP-1 · Sleep Analytics

Feature 4.4 · Dependencies: 4.1 + 4.2 + 4.3 · Effort: Low

Stack used: Recharts (line charts, bar chart), Drizzle (aggregate queries), date-fns (date ranges), nuqs (time range in URL)

- [ ] Build sleep trend charts: Recharts line charts showing duration, quality, and sleep score over 7 / 30 / 90 days with nuqs time range toggle.
- [ ] Build bedtime consistency chart: visual showing how much bedtime varies night to night (deviation from average).
- [ ] Build sleep debt trend line: accumulation and recovery over the past 30 days.
- [ ] Build sleep factor analysis: Recharts bar chart showing average sleep score on nights with caffeine vs. without, alcohol vs. without, etc. Computed via Drizzle queries filtering on the factors JSONB field from MVP-14.

Why first: Extends existing sleep data with no new tables. Low effort, high completeness for the sleep feature.

### Post-MVP-2 · Recipe Builder

Feature 2.5 · Dependencies: 2.1 Food Logging · Effort: Moderate

Stack used: Drizzle (extend food_items schema), next-safe-action + Conform + Zod (recipe form), shadcn/ui (ingredient list, search)

- [ ] Add recipe to the food_items.source enum.
- [ ] Define recipe_ingredients table: id, recipe_id (FK to food_items), food_item_id, amount, unit.
- [ ] Build "Create Recipe" flow: name the recipe, search and add food items as ingredients with quantities, enter total servings, auto-calculate per-serving macros (including fiber) by summing ingredient values and dividing by servings.
- [ ] Save the recipe as a new food_items row with source = 'recipe' so it appears in food search and can be logged like any other food.
- [ ] Build recipe detail view showing ingredients and per-serving nutrition breakdown.
- [ ] Build recipe edit and delete functionality.

Why second: Useful but not required for core food logging. Users can log individual foods or use custom foods in the meantime.

### Post-MVP-3 · Progress Visualization (Charts + Heat Map)

Feature 5.3 · Dependencies: Historical data from any tracker · Effort: Moderate

Stack used: Recharts (line/bar charts), Tailwind CSS (heat map grid — no additional library), Drizzle (aggregate queries), nuqs (metric selector in URL), date-fns (date generation)

- [ ] Build a dedicated "Progress" page with a nuqs-powered metric selector: weight, calories, workout volume, sleep duration, mood, etc.
- [ ] Recharts line and bar charts with 7 / 30 / 90 day toggles for any selected metric.
- [ ] Build calendar heat map using a Tailwind CSS grid: generate a grid of day cells for the past 90–365 days using date-fns. Color each cell with Tailwind background classes based on intensity (e.g., bg-green-100 through bg-green-700). Intensity represents daily logging completeness or goal achievement percentage.
- [ ] Allow users to select which metric drives the heat map color via nuqs URL state (e.g., workout days, hydration goal met, mood score).

Why third: Highest visual impact for portfolio. The heat map is a recognizable, impressive UI element built with zero extra dependencies.

**Note on Post-MVP-3 and Post-MVP-4 ordering:** Both are flagged as the app's standout portfolio features. If this is portfolio-oriented, consider building them in parallel or back-to-back as a single sprint. The heat map (Post-MVP-3) is visually impressive at a glance, but the correlation insights (Post-MVP-4) are more intellectually interesting in an interview setting — they demonstrate data modeling, cross-table query design, and product thinking. Both should be prioritized ahead of CRUD-heavy items like medication tracking.

### Post-MVP-4 · Cross-Domain Correlation Insights

Feature 5.5 · Dependencies: Data from at least 2 trackers (3.1, 4.1, 4.3, 1.2, 2.4, 5.4) · Effort: Moderate

Stack used: Drizzle (cross-table aggregate queries), shadcn/ui (insight cards), Recharts (optional comparison bar charts)

- [ ] Build an "Insights" page that surfaces automatically generated correlation cards.
- [ ] Correlations to compute (all follow the same pattern: filter rows by condition → compute average → compare groups):
  - "Avg. sleep score on workout days vs. rest days"
  - "Avg. mood when sleep > target vs. below target"
  - "Avg. sleep duration when hydration goal met vs. not"
  - "Avg. mood on days with caffeine noted (sleep factors) vs. without"
  - "Weight trend during weeks with 4+ workouts vs. fewer"
  - "Avg. energy on days with 7+ hrs sleep vs. fewer"
- [ ] Display as plain-language shadcn/ui cards with the two compared averages and the difference highlighted (green for positive, red for negative).
- [ ] Only show a correlation card when at least 7 data points exist in each comparison group. Show "Not enough data yet — keep logging!" otherwise.

Vitest: Write unit tests for the correlation computation functions.

Why fourth: The app's biggest differentiator. By this point, users have accumulated enough data for meaningful insights.

### Post-MVP-5 · Personal Records and Milestones

Feature 5.6 · Dependencies: Historical data (1.2, 4.2, 5.2) · Effort: Low

Stack used: Drizzle (max/min aggregate queries), shadcn/ui (records page, toast notifications), Motion (celebration animation)

- [ ] Auto-detect records across all features via Drizzle aggregate queries: heaviest lift per exercise, fastest pace per cardio exercise, longest workout streak, best sleep score, highest consecutive mood streak, most consistent hydration week, lowest/highest body weight.
- [ ] Build a "Records" page listing all-time bests organized by category.
- [ ] Show a celebratory toast (shadcn/ui toast) with a Motion animation when a new record is set, detected at the moment of data entry.

Why fifth: Leverages all existing data. Low implementation effort with high engagement value.

### Post-MVP-6 · Push Notifications

Feature 6.1 · Dependencies: MVP features (all trackers) · Effort: Moderate

Stack used: Web Push API, Serwist (service worker), Drizzle (notification preferences schema), next-safe-action

- [ ] Define notification_preferences table: id, user_id, workout_reminder (boolean), meal_reminder (boolean), hydration_reminder (boolean), mood_reminder (boolean), sleep_reminder (boolean), streak_at_risk_alert (boolean), reminder_times (JSONB — stores preferred reminder times per category, e.g., `{ "mood": "20:00", "sleep": "22:00", "hydration": ["10:00", "14:00", "18:00"] }`).
- [ ] Implement Web Push API: request notification permission on first relevant interaction (not on page load — avoid permission fatigue). Store the push subscription endpoint in the database.
- [ ] Build notification triggers via scheduled checks or event-driven logic:
  - **Logging reminders:** "Don't forget to log your meals today" (if no food logged by a configurable time), "Time for your evening mood check-in," "Log last night's sleep."
  - **Hydration nudges:** Periodic reminders throughout the day (e.g., every 3 hours during waking hours) if the user is behind on their hydration goal.
  - **Streak-at-risk alerts:** "Your 7-day workout streak ends today — don't break the chain!" triggered when a streak is at risk of breaking based on the goal's frequency.
  - **Milestone celebrations:** "New PR! You just hit 225 lbs on bench press!" (triggered at data entry time via the service worker).
- [ ] Build notification preferences UI in settings: per-category toggles and time-of-day pickers using shadcn/ui switches and time inputs.
- [ ] Respect user preferences strictly — only send notifications for enabled categories at configured times.

**Implementation note:** For MVP-level push notifications, use a simple approach: a Next.js API route or cron job (Vercel Cron) that runs periodically (e.g., every 30 minutes), checks which users have reminders due based on their preferences and logging status, and sends push notifications via the Web Push API. This avoids the complexity of a full background job queue while being sufficient for a portfolio app's scale.

Why sixth: High engagement impact. Push notifications are the most effective retention tool and demonstrate full-stack PWA capabilities (service worker + Web Push API + server-side scheduling).

### Post-MVP-7 · Gamification

Feature 6.2 · Dependencies: MVP features (all trackers), ideally Post-MVP-5 (records) and Post-MVP-6 (notifications) · Effort: Moderate

Stack used: Drizzle (schema + queries), Motion (animations), shadcn/ui (badge display, progress bars, cards), Lucide React (achievement icons)

- [ ] Define badges table: id, name, description, icon (text — Lucide icon name or custom SVG path), category (enum: workout / nutrition / hydration / sleep / mood / general), condition_type (text — e.g., "streak_days", "total_workouts", "first_log"), condition_value (integer — threshold to earn the badge).
- [ ] Define user_badges table: id, user_id, badge_id, earned_at (timestamptz).
- [ ] Define user_xp table: id, user_id, total_xp (integer), current_level (integer). XP is append-only — store an xp_history log (user_id, amount, source, earned_at) for auditability.
- [ ] Seed badge definitions (30–50 badges across categories). Examples:
  - **Workout:** "First Rep" (log first workout), "Iron Week" (7-day workout streak), "Century Club" (100 total workouts), "PR Machine" (set 10 personal records), "Cardio King/Queen" (log 50 cardio sessions).
  - **Nutrition:** "Meal Prepper" (log all 3 meals for 7 days), "Macro Master" (hit macro targets 5 days in a row), "Hydration Hero" (hit hydration goal 14 days straight).
  - **Sleep:** "Sleep Champ" (7 consecutive nights with 7+ hours), "Consistent Sleeper" (bedtime consistency < 30 min for 14 days).
  - **Mood:** "Self-Aware" (30 mood check-ins), "Journal Journey" (write 10 journal entries).
  - **General:** "All-Rounder" (log in all 4 trackers in one day), "30-Day Warrior" (log something every day for 30 days).
- [ ] **XP system:** Award XP for consistent logging actions. Examples: 10 XP per workout logged, 5 XP per meal logged, 5 XP per mood check-in, 5 XP per sleep log, 2 XP per hydration log, 25 XP bonus for hitting a daily goal, 50 XP bonus for earning a badge. Define XP thresholds for levels (e.g., Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 250 XP, scaling with a curve). Keep the math simple — the point is motivation, not balance.
- [ ] **Badge detection:** Check for newly earned badges after each data entry (similar to PR detection in Post-MVP-5). Query the user's stats against unearned badge conditions. On badge earn, show a celebratory modal with Motion animation and (if notifications are enabled) send a push notification.
- [ ] **Weekly challenges:** Define a rotating set of challenges (hardcoded or seeded): "Log all meals for 5 days this week," "Hit your hydration goal 4 days," "Do 3 workouts this week." Display as a card on the dashboard with progress tracking. Award bonus XP on completion.
- [ ] Build a "Profile" or "Achievements" page showing: current level and XP progress bar to next level, earned badges displayed as a grid with icons and earned dates (unearned badges shown greyed out as motivation), current weekly challenge progress.
- [ ] Show level and badge count on the dashboard summary.

Why seventh: Gamification is a proven engagement driver that ties all features together. Building it after push notifications means badge/level-up celebrations can be pushed as notifications too. Demonstrates product thinking and engagement design.

### Post-MVP-8 · Mindfulness Tools

Feature 3.4 · Dependencies: None · Effort: Low–Moderate

Stack used: Motion (breathing animation), Zustand (timer state), Drizzle (session logging), next-safe-action, shadcn/ui (controls)

- [ ] Build box breathing exercise: Motion-animated expanding/contracting circle with 4-second intervals for inhale, hold, exhale, hold. Use Zustand to manage timer state and current phase. Configurable durations.
- [ ] Build 2–3 additional breathing patterns: 4-7-8 breathing (inhale 4, hold 7, exhale 8), deep breathing (inhale 4, exhale 6).
- [ ] Optionally, 2–3 text-based meditation guides (timed steps displayed on screen sequentially, no audio files needed — just a timer advancing through text prompts).
- [ ] Log completed mindfulness sessions to a mindfulness_log table (id, user_id, type, duration_seconds, completed_at) via next-safe-action for dashboard tracking.

Why eighth: Standalone feature with visually impressive animations that showcase frontend skills.

### Post-MVP-9 · Medication and Supplement Tracking

Feature 3.5 · Dependencies: None · Effort: Low

Stack used: Drizzle (schema + queries), next-safe-action + Conform + Zod (forms), shadcn/ui (checklist, management UI)

- [ ] Define medications table: id, user_id, name, dosage, frequency (text), time_of_day (text), is_active (boolean).
- [ ] Define medication_log table: id, medication_id, user_id, date, taken (boolean), time_taken (timestamptz, nullable).
- [ ] Build medication list management: add, edit, deactivate medications using Conform + Zod forms via next-safe-action.
- [ ] Build daily checklist: today's active medications displayed as shadcn/ui checkboxes. Tapping fires a next-safe-action to mark as taken with a timestamp. Use useOptimistic for instant checkbox feedback.
- [ ] Build adherence history: percentage of doses taken over 7 / 30 days via Drizzle aggregate queries.

Why ninth: Simple CRUD that rounds out the mental health feature.

### Post-MVP-10 · Adaptive Calorie/Macro Adjustments

Feature 2.6 · Dependencies: 2.2 Calorie/Macro Tracking + 5.4 Body Measurements · Effort: Moderate

Stack used: Drizzle (aggregate queries), date-fns (rolling averages), shadcn/ui (suggestion card with accept/dismiss), next-safe-action

- [ ] Compute a rolling 7-day average weight from body_measurements using date-fns and Drizzle.
- [ ] Compare actual weight trend direction to expected trend based on current calorie target and goal (lose / maintain / gain). Expected rate: ~0.5–1 lb/week for weight loss, ~0.25–0.5 lb/week for gain.
- [ ] If weight isn't trending as expected after 2+ weeks of data, generate a suggestion card: e.g., "Your weight has been stable for 2 weeks. Consider reducing your target by 200 calories to resume progress."
- [ ] Display as a dismissible shadcn/ui card on the nutrition page. User can accept (fires next-safe-action to update their calorie target) or dismiss.

Vitest: Write unit tests for the trend detection and adjustment suggestion logic.

Why tenth: Requires accumulated weight and nutrition data. Simple math but needs real data to be meaningful.

### Post-MVP-11 · Offline Mode

Feature 6.3 · Dependencies: All features (extends the entire app) · Effort: High

Revised effort estimate: Building a reliable offline write queue with IndexedDB, sync logic with conflict resolution, and UI indicators for connectivity state is a significant engineering effort — easily 2–3x any other post-MVP item. This is worth building for portfolio impact (offline-first PWA with background sync is a strong differentiator) but should not be underestimated.

Stack used: Serwist (enhanced service worker), IndexedDB (offline queue), Supabase (sync target)

- [ ] Enhance Serwist service worker configuration for full offline-first support: cache all app shell routes, static assets, and critical API responses.
- [ ] Implement an offline write queue using IndexedDB: when the user logs data without connectivity, store the pending write in IndexedDB with a timestamp and the intended server action payload.
- [ ] Implement sync logic: when connectivity returns (listen for online event), process the IndexedDB queue and push all pending writes to Supabase via next-safe-action. Handle conflicts with a last-write-wins strategy. Handle partial failures (some writes succeed, some fail) by retrying only the failed items.
- [ ] Show a subtle UI indicator when the app is offline (e.g., a thin banner at the top) and when queued writes are syncing (e.g., a spinner in the navigation bar).
- [ ] Test edge cases: rapid online/offline toggling, large queues, writes that reference server-generated IDs (e.g., creating a workout then adding sets — the sets need the workout ID that doesn't exist yet offline). Consider generating UUIDs client-side to avoid this dependency.

Why eleventh: Architecturally significant but not blocking daily use. Most users will have connectivity. Build this when the rest of the app is stable.

### Post-MVP-12 · Data Export and Reports

Feature 6.4 · Dependencies: Any logged data · Effort: Moderate

Stack used: Native browser APIs (Blob, download), date-fns (date ranges), Drizzle (data fetching)

- [ ] Build a "Export Data" settings page: user selects which features to export and a date range.
- [ ] Generate CSV files per feature (workouts, nutrition, mood, sleep, body measurements) using vanilla TypeScript — create CSV string, wrap in a Blob, trigger download via URL.createObjectURL. No additional library needed.
- [ ] Generate JSON export as an alternative format.
- [ ] Build a "Generate Report" feature: generate a printable HTML page (open in new tab with window.print() support) summarizing: workout stats (strength PRs and cardio bests), nutrition averages, mood trends, sleep averages, goal progress, body measurement changes. Styled with Tailwind's @media print utilities.
- [ ] Format reports for sharing with a trainer, therapist, or doctor.

Why last: The professional finishing touch on the entire app. Best built when all data sources are stable.

---

## Vitest Coverage Plan

Only critical business logic. No UI component tests for MVP.

| Function                                | Feature                  | Why                                                                               |
| --------------------------------------- | ------------------------ | --------------------------------------------------------------------------------- |
| 1RM estimation (capped Epley + Brzycki) | MVP-2 Workout Logging    | Incorrect formula = wrong PRs displayed; boundary between formulas must be tested |
| Mifflin-St Jeor calorie calculation     | MVP-6 Nutrition Tracking | Incorrect formula = wrong daily targets                                           |
| Macro percentage-to-grams conversion    | MVP-6 Nutrition Tracking | Rounding errors compound over daily tracking                                      |
| Sleep score formula                     | MVP-13 Sleep Score       | Weighted composite must be correct and bounded 0–100                              |
| Sleep debt calculation                  | MVP-13 Sleep Score       | Rolling window math with edge cases                                               |
| Streak computation                      | MVP-17 Goal Setting      | Consecutive day counting with timezone edge cases                                 |
| Activity breakdown aggregation          | MVP-11 Mood Analytics    | Average calculations with minimum data thresholds                                 |
| Correlation computation                 | Post-MVP-4               | Average calculations with minimum data thresholds                                 |
| Adaptive calorie adjustment             | Post-MVP-10              | Trend detection and suggestion logic                                              |

## Free Tier Limits to Monitor

| Service             | Free Tier Limit                                          | Your Usage Estimate                                 | Risk     |
| ------------------- | -------------------------------------------------------- | --------------------------------------------------- | -------- |
| Supabase            | 500 MB database, 50K MAU, 500K edge function invocations | < 50 MB database, < 10 MAU, < 10K invocations/month | Very Low |
| Vercel              | 100 GB bandwidth, 100 hrs serverless                     | < 1 GB bandwidth, < 5 hrs serverless                | Very Low |
| Open Food Facts API | Unlimited (open source)                                  | Moderate search/barcode queries                     | None     |
| GitHub              | Unlimited public/private repos                           | 1 repo                                              | None     |
