import { describe, test, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOrionStore } from "./useOrionStore";

beforeEach(() => {
    global.localStorage = {
      store: {},
      getItem(key) {
        return this.store[key] || null;
      },
      setItem(key, value) {
        this.store[key] = String(value);
      },
      removeItem(key) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      },
    };
  });

describe("useOrionStore", () => {
  test("starts with the default categories", () => {
    const { result } = renderHook(() => useOrionStore());
    expect(result.current.categories.length).toBeGreaterThan(0);
    expect(result.current.categories).toContain("Groceries");
  });

  test("adds a new category", () => {
    const { result } = renderHook(() => useOrionStore());

    act(() => {
      result.current.addCategory("Medical");
    });

    expect(result.current.categories).toContain("Medical");
  });

  test("rejects duplicate categories case-insensitively", () => {
    const { result } = renderHook(() => useOrionStore());

    let response;
    act(() => {
      response = result.current.addCategory("groceries");
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/already exists/i);
  });

  test("removes a category and reassigns its transactions to Other", () => {
    const { result } = renderHook(() => useOrionStore());

    act(() => {
      result.current.addTransaction({
        id: "tx1",
        type: "expense",
        amount: 50,
        category: "Groceries",
        date: "2026-04-01",
      });
    });

    act(() => {
      result.current.removeCategory("Groceries");
    });

    expect(result.current.categories).not.toContain("Groceries");
    const tx = result.current.transactions.find((t) => t.id === "tx1");
    expect(tx.category).toBe("Other");
  });

  test("adds and removes a transaction", () => {
    const { result } = renderHook(() => useOrionStore());

    act(() => {
      result.current.addTransaction({
        id: "tx1",
        type: "expense",
        amount: 25,
        category: "Dining",
        date: "2026-04-15",
      });
    });

    expect(result.current.transactions).toHaveLength(1);

    act(() => {
      result.current.removeTransaction("tx1");
    });

    expect(result.current.transactions).toHaveLength(0);
  });

  test("contributeToGoal increases the goal's currentAmount", () => {
    const { result } = renderHook(() => useOrionStore());

    act(() => {
      result.current.addGoal({
        id: "g1",
        name: "Vacation",
        targetAmount: 1000,
        currentAmount: 0,
      });
    });

    act(() => {
      result.current.contributeToGoal("g1", 250);
    });

    const goal = result.current.goals.find((g) => g.id === "g1");
    expect(goal.currentAmount).toBe(250);
  });

  test("contributeToGoal ignores zero or negative amounts", () => {
    const { result } = renderHook(() => useOrionStore());

    act(() => {
      result.current.addGoal({
        id: "g1",
        name: "Vacation",
        targetAmount: 1000,
        currentAmount: 100,
      });
    });

    act(() => {
      result.current.contributeToGoal("g1", -50);
    });

    const goal = result.current.goals.find((g) => g.id === "g1");
    expect(goal.currentAmount).toBe(100);
  });
});
