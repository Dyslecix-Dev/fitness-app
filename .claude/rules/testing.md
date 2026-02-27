---
paths:
  - "lib/formulas/**"
  - "**/*.test.ts"
---

# Testing Rules

## What to Test

Only pure business logic functions in `lib/formulas/`:
- 1RM estimation (`1rm.ts`)
- TDEE calculation (`tdee.ts`)
- Macro conversion (`macros.ts`)
- Sleep score (`sleep-score.ts`)
- Sleep debt (`sleep-debt.ts`)
- Streak computation (`streak.ts`)
- Correlation computation (`correlations.ts`)
- Adaptive calorie adjustment (`adaptive-calories.ts`)

## What NOT to Test

- UI components (shadcn/ui, custom components)
- Server actions (test manually or via E2E)
- Database queries (integration-level)
- Utility functions like `cn()`

## Test File Convention

```
lib/formulas/1rm.ts           → lib/formulas/__tests__/1rm.test.ts
lib/formulas/tdee.ts          → lib/formulas/__tests__/tdee.test.ts
lib/formulas/sleep-score.ts   → lib/formulas/__tests__/sleep-score.test.ts
```

## Test Structure

```typescript
import { describe, it, expect } from "vitest";

describe("functionName", () => {
  describe("valid inputs", () => { /* happy path */ });
  describe("boundary cases", () => { /* edge cases */ });
  describe("invalid inputs", () => { /* error cases */ });
});
```

## Running Tests

```bash
pnpm vitest                    # Run all tests (watch mode)
pnpm vitest run                # Run once (CI mode)
pnpm vitest lib/formulas/      # Run formula tests only
```
