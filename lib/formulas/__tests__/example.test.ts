import { describe, it, expect } from "vitest";
import { estimate1RM } from "../1rm";

/**
 * Example test file template for formula unit tests.
 * Copy this pattern for each formula: tdee.ts, sleep-score.ts, streak.ts, etc.
 *
 * Test file location convention: {formula}.ts → __tests__/{formula}.test.ts
 * Run tests: pnpm vitest lib/formulas/
 */

describe("estimate1RM - 1RM Estimation (Capped Epley + Brzycki)", () => {
  describe("Valid inputs", () => {
    it("returns weight for 1 rep (identity)", () => {
      expect(estimate1RM(100, 1)).toBe(100);
      expect(estimate1RM(225, 1)).toBe(225);
    });

    it("uses Epley formula for 2–10 reps", () => {
      // Epley: weight × (1 + reps / 30)
      // 100 × (1 + 5/30) = 100 × 1.1667 = 116.67
      expect(estimate1RM(100, 5)).toBeCloseTo(116.67, 1);

      // 100 × (1 + 10/30) = 100 × 1.333 = 133.3
      expect(estimate1RM(100, 10)).toBeCloseTo(133.3, 1);
    });

    it("uses Brzycki formula for 11–20 reps", () => {
      // Brzycki: weight × 36 / (37 - reps)
      // 100 × 36 / (37 - 15) = 100 × 36 / 22 = 163.6
      expect(estimate1RM(100, 15)).toBeCloseTo(163.6, 1);

      // 100 × 36 / (37 - 20) = 100 × 36 / 17 = 211.8
      expect(estimate1RM(100, 20)).toBeCloseTo(211.8, 1);
    });
  });

  describe("Boundary cases", () => {
    it("returns null for 21+ reps (unreliable estimation)", () => {
      expect(estimate1RM(100, 21)).toBeNull();
      expect(estimate1RM(100, 100)).toBeNull();
    });

    it("switches from Epley to Brzycki at rep 11", () => {
      // 10 reps (Epley): 100 × 1.333 = 133.3
      const epley10 = estimate1RM(100, 10);

      // 11 reps (Brzycki): 100 × 36 / 26 = 138.5
      const brzycki11 = estimate1RM(100, 11);

      // Brzycki should be slightly higher (more conservative at high reps)
      expect(brzycki11).toBeGreaterThan(epley10!);
    });
  });

  describe("Invalid inputs", () => {
    it("returns null for zero or negative weight", () => {
      expect(estimate1RM(0, 5)).toBeNull();
      expect(estimate1RM(-100, 5)).toBeNull();
    });

    it("returns null for zero or negative reps", () => {
      expect(estimate1RM(100, 0)).toBeNull();
      expect(estimate1RM(100, -5)).toBeNull();
    });
  });

  describe("Real-world examples", () => {
    it("calculates realistic bench press 1RM", () => {
      // Benched 225 lbs for 5 reps
      // Epley: 225 × 1.1667 = 262.5 lbs
      const calculated = estimate1RM(225, 5);
      expect(calculated).toBeCloseTo(262.5, 0);
    });

    it("calculates realistic squat 1RM", () => {
      // Squatted 315 lbs for 3 reps
      // Epley: 315 × (1 + 3/30) = 315 × 1.1 = 346.5 lbs
      const calculated = estimate1RM(315, 3);
      expect(calculated).toBeCloseTo(346.5, 0);
    });
  });
});
