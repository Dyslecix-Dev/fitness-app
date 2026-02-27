---
name: check-phase
description: Shows the current implementation status of all phases and identifies what to build next. Use when asking about progress or what to work on next.
user-invocable: true
allowed-tools: Read, Glob, Grep
---

When the user invokes `/check-phase`:

## 1. Check What Exists

Scan the codebase to determine what has been built:

- Check `db/schema.ts` or `db/schema/` for domain tables (exercises, workouts, food_items, mood_checkins, sleep_logs, goals, etc.)
- Check `actions/` for domain-specific server actions (not just `example.ts`)
- Check `app/(protected)/` for feature routes (workouts/, nutrition/, mood/, sleep/, goals/)
- Check `lib/formulas/` for calculation implementations
- Check `lib/safe-action.ts` for `handleServerError` configuration
- Check `stores/` for domain stores (not just `counter-store.ts`)

## 2. Compare Against ROADMAP.md

Read ROADMAP.md and compare checkboxes:
- `[x]` = completed in ROADMAP
- `[ ]` = not yet built

## 3. Report Status

Output a clear status table:

```
Phase 0: Project Setup
  ✅ 0.1 Scaffolding and Tooling
  ✅ 0.2 Auth Flow (partially — screens exist, needs polish)
  ❌ 0.3 Error Handling Foundation
  ❌ 0.4 Database Schema v1
  ❌ 0.5 Dev Seed Data

Phase 1: Workout Tracking
  ❌ MVP-1 Exercise Library
  ...
```

## 4. Recommend Next Step

Based on the ROADMAP's implementation order and dependency chain, recommend what to build next. Always respect the order: Phase 0 must be complete before Phase 1, etc.
