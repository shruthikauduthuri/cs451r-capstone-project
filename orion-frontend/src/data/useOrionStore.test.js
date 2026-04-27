// tests for the useOrionStore hook (API-backed version)
// now that transactions and goals go through the API, we mock apiTransactions
// and apiGoals to avoid real network calls during tests

import { describe, test, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useOrionStore } from "./useOrionStore";

// mock the API module
vi.mock("../services/api", () => ({
	apiTransactions: {
		list: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		remove: vi.fn(),
	},
	apiGoals: {
		list: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		remove: vi.fn(),
	},
}));

import { apiTransactions, apiGoals } from "../services/api";

beforeEach(() => {
	// reset localStorage and all mocks before each test
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

	vi.clearAllMocks();

	// default mock responses: empty arrays so the hook doesn't hang waiting for API
	apiTransactions.list.mockResolvedValue([]);
	apiGoals.list.mockResolvedValue([]);
});

describe("useOrionStore", () => {
	test("starts with the default categories", async () => {
		const { result } = renderHook(() => useOrionStore());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.categories.length).toBeGreaterThan(0);
		expect(result.current.categories).toContain("Groceries");
	});

	test("adds a new category", async () => {
		const { result } = renderHook(() => useOrionStore());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		act(() => {
			result.current.addCategory("Medical");
		});

		expect(result.current.categories).toContain("Medical");
	});

	test("rejects duplicate categories case-insensitively", async () => {
		const { result } = renderHook(() => useOrionStore());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		let response;
		act(() => {
			response = result.current.addCategory("groceries");
		});

		expect(response.ok).toBe(false);
		expect(response.message).toMatch(/already exists/i);
	});

	test("removes a category and reassigns its transactions to Other", async () => {
		// mock the API to return a transaction with category "Groceries"
		apiTransactions.list.mockResolvedValue([
			{
				Id: "tx1",
				Type: "expense",
				Amount: 50,
				Category: "Groceries",
				TransactionDate: "2026-04-01",
			},
		]);

		const { result } = renderHook(() => useOrionStore());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		act(() => {
			result.current.removeCategory("Groceries");
		});

		expect(result.current.categories).not.toContain("Groceries");
		const tx = result.current.transactions.find((t) => t.id === "tx1");
		expect(tx.category).toBe("Other");
	});

	test("adds and removes a transaction", async () => {
		apiTransactions.create.mockResolvedValue({
			Id: "tx1",
			Type: "expense",
			Amount: 25,
			Category: "Dining",
			TransactionDate: "2026-04-15",
		});

		const { result } = renderHook(() => useOrionStore());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		await act(async () => {
			await result.current.addTransaction({
				id: "tx1",
				type: "expense",
				amount: 25,
				category: "Dining",
				date: "2026-04-15",
			});
		});

		expect(result.current.transactions).toHaveLength(1);

		apiTransactions.remove.mockResolvedValue({});

		await act(async () => {
			await result.current.removeTransaction("tx1");
		});

		expect(result.current.transactions).toHaveLength(0);
	});

	test("contributeToGoal increases the goal's currentAmount", async () => {
		const mockGoal = {
			Id: "g1",
			Name: "Vacation",
			TargetAmount: 1000,
			CurrentAmount: 0,
			Deadline: "2026-12-31",
		};

		apiGoals.create.mockResolvedValue(mockGoal);
		apiGoals.update.mockResolvedValue({});

		const { result } = renderHook(() => useOrionStore());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		await act(async () => {
			await result.current.addGoal({
				id: "g1",
				name: "Vacation",
				targetAmount: 1000,
				currentAmount: 0,
				deadline: "2026-12-31",
			});
		});

		await act(async () => {
			await result.current.contributeToGoal("g1", 250);
		});

		const goal = result.current.goals.find((g) => g.id === "g1");
		expect(goal.currentAmount).toBe(250);
	});

	test("contributeToGoal ignores zero or negative amounts", async () => {
		const mockGoal = {
			Id: "g1",
			Name: "Vacation",
			TargetAmount: 1000,
			CurrentAmount: 100,
			Deadline: "2026-12-31",
		};

		apiGoals.create.mockResolvedValue(mockGoal);

		const { result } = renderHook(() => useOrionStore());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		await act(async () => {
			await result.current.addGoal({
				id: "g1",
				name: "Vacation",
				targetAmount: 1000,
				currentAmount: 100,
				deadline: "2026-12-31",
			});
		});

		await act(async () => {
			await result.current.contributeToGoal("g1", -50);
		});

		const goal = result.current.goals.find((g) => g.id === "g1");
		expect(goal.currentAmount).toBe(100);
	});
});