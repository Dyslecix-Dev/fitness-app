# Project Structure — Actual State

What exists in the codebase today. Updated as features are built.

## Top-Level

```md
├── app/ # Next.js App Router routes
├── actions/ # Server actions (currently example only)
├── components/ # Auth forms + shadcn/ui components
├── db/ # Drizzle ORM schema and queries (example tables)
├── lib/ # Utilities, Supabase clients, formulas
├── providers/ # React context providers (example store)
├── stores/ # Zustand stores (example counter)
├── public/ # Static assets
├── docs/ # This file
├── .claude/ # Claude Code config (settings, rules, skills)
├── CLAUDE.md # Claude Code persistent instructions
├── ROADMAP.md # Complete feature specifications (17 MVP + 12 Post-MVP)
├── next.config.ts # Next.js + Serwist + env validation
├── drizzle.config.ts # Drizzle → Supabase Postgres config
├── proxy.ts # Route protection middleware
├── tsconfig.json # TypeScript strict mode
├── components.json # shadcn/ui config (new-york style)
└── package.json # pnpm, all dependencies installed
```

---

## app/ (Routes)

```md
app/
├── layout.tsx # Root layout (ThemeProvider, NuqsAdapter, Toaster)
├── globals.css # Tailwind + HSL CSS variables (TODO: change palette)
├── manifest.ts # PWA manifest
├── sw.ts # Serwist service worker
├── favicon.ico
├── opengraph-image.png
├── twitter-image.png
│
├── landing-page/
│ └── page.tsx # Public home (hero, Supabase tutorial steps)
│
├── offline/
│ └── page.tsx # PWA offline fallback
│
├── auth/
│ ├── login/page.tsx # Email + password sign-in
│ ├── sign-up/page.tsx # Registration with email confirmation
│ ├── sign-up-success/page.tsx # Post-signup message
│ ├── forgot-password/page.tsx # Password reset request
│ ├── update-password/page.tsx # New password form (via magic link)
│ ├── confirm/route.ts # Email confirmation callback (route handler)
│ └── error/page.tsx # Auth error display
│
└── (protected)/ # Authenticated route group
├── layout.tsx # Nav bar, footer, auth controls
├── page.tsx # Dashboard home (currently example content)
└── \_components/
├── protected-page-content.tsx # Example tabs + counter demo
└── user-details.tsx # User profile display
```

---

## components/

```md
components/
├── auth-button.tsx # Shows user email or login/signup buttons
├── logout-button.tsx # Sign-out action
├── login-form.tsx # Login form (Conform + Zod)
├── sign-up-form.tsx # Sign-up form (Conform + Zod)
├── update-password-form.tsx # Password reset form
├── forgot-password-form.tsx # Password recovery form
├── theme-switcher.tsx # Dark/light mode toggle
├── hero.tsx # Landing page hero
├── install-prompt.tsx # PWA install prompt
├── deploy-button.tsx # Vercel deploy link
├── next-logo.tsx
├── supabase-logo.tsx
│
├── tutorial/ # Supabase tutorial components (can remove later)
│ ├── code-block.tsx
│ ├── connect-supabase-steps.tsx
│ ├── fetch-data-steps.tsx
│ └── tutorial-step.tsx
│
└── ui/ # shadcn/ui (new-york style)
├── button.tsx
├── card.tsx
├── input.tsx
├── label.tsx
├── badge.tsx
├── checkbox.tsx
├── dropdown-menu.tsx
└── sonner.tsx # Toast notifications
```

---

## db/ (Database)

```md
db/
├── index.ts # Drizzle client init (postgres driver, POSTGRES_URL)
├── schema.ts # TODO: Example tables (usersTable, postsTable)
└── queries/ # TODO: Example CRUD functions
├── select.ts # getUserById, getUsersWithPostsCount, getPostsForLast24Hours
├── insert.ts # createUser, createPost
├── update.ts # updatePost
└── delete.ts # deleteUser
```

**All marked `TODO: Replace example file`.** Will be replaced with domain-specific tables and queries.

---

## lib/ (Utilities)

```md
lib/
├── utils.ts # cn() helper (clsx + tailwind-merge)
├── safe-action.ts # next-safe-action client (bare — no error handler yet)
│
├── formulas/ # Pure calculation functions (create as features built)
│ └── **tests**/
│ └── example.test.ts # Vitest test template for 1RM estimation
│
└── supabase/ # Supabase client setup
├── server.ts # Server client (async createClient, uses cookies())
├── client.ts # Browser client (createBrowserClient)
├── proxy.ts # updateSession() — getClaims() + redirect logic
└── migrations/ # Drizzle migration output (empty)
```

---

## Other

```md
stores/
└── counter-store.ts # TODO: Example Zustand store (increment/decrement)

providers/
└── counter-store-provider.tsx # TODO: Example store context wrapper

actions/
└── example.ts # TODO: Example safe-action (actionClient.inputSchema)

proxy.ts # Middleware — delegates to lib/supabase/proxy.ts
```

---

## .claude/ (Claude Code Configuration)

```md
.claude/
├── settings.json # Shared settings (deny rules for .env, auto-format hook)
├── settings.local.json # Local settings (allowed commands)
├── rules/
│ ├── code-style.md # TypeScript, naming, imports, components, forms
│ ├── testing.md # What to test, test structure, running tests
│ └── database.md # Drizzle conventions, RLS, migrations
└── skills/
├── build-feature/SKILL.md # /build-feature — scaffold a new MVP feature
├── check-phase/SKILL.md # /check-phase — show implementation status
└── add-schema/SKILL.md # /add-schema — add Drizzle table with RLS
```

---

## Config Files

| File                 | Purpose                                                           |
| -------------------- | ----------------------------------------------------------------- |
| `next.config.ts`     | Serwist PWA, env validation (Zod), security hdrs                  |
| `drizzle.config.ts`  | Schema at `./db/schema.ts`, output to `./lib/supabase/migrations` |
| `tsconfig.json`      | Strict mode, `@/*` path alias, webworker types                    |
| `tailwind.config.ts` | Dark mode (class), HSL colors, tailwindcss-animate                |
| `eslint.config.mjs`  | next/core-web-vitals + next/typescript                            |
| `postcss.config.mjs` | Tailwind + autoprefixer                                           |
| `components.json`    | shadcn/ui: new-york style, neutral base, lucide                   |

---

## Quick Lookup

| I need to find...     | Look here                            |
| --------------------- | ------------------------------------ |
| A route/page          | `app/`                               |
| Auth forms            | `components/login-form.tsx` etc.     |
| shadcn/ui components  | `components/ui/`                     |
| Server action example | `actions/example.ts`                 |
| Safe-action client    | `lib/safe-action.ts`                 |
| Supabase clients      | `lib/supabase/`                      |
| Route protection      | `proxy.ts` → `lib/supabase/proxy.ts` |
| Database schema       | `db/schema.ts`                       |
| Database queries      | `db/queries/`                        |
| Drizzle config        | `drizzle.config.ts`                  |
| Zustand store example | `stores/counter-store.ts`            |
| Formula calculations  | `lib/formulas/`                      |
| Formula tests         | `lib/formulas/__tests__/`            |
| Claude Code rules     | `.claude/rules/`                     |
| Claude Code skills    | `.claude/skills/`                    |
