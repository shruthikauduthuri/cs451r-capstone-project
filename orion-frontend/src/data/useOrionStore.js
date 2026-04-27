import { useEffect, useState } from "react";
import { apiTransactions, apiGoals } from "../services/api";
import { DEFAULT_CATEGORIES } from "./store";

const K_CATEGORIES = "orion_categories_v1";

function readCategories() {
	try {
		const raw = localStorage.getItem(K_CATEGORIES);
		return raw ? JSON.parse(raw) : DEFAULT_CATEGORIES;
	} catch {
		return DEFAULT_CATEGORIES;
	}
}

function writeCategories(categories) {
	localStorage.setItem(K_CATEGORIES, JSON.stringify(categories));
}


function normalizeTransaction(apiTx) {
	return {
		id: apiTx.Id || apiTx.id,
		amount: apiTx.Amount ?? apiTx.amount ?? 0,
		type: apiTx.Type || apiTx.type || "expense",
		date: apiTx.TransactionDate || apiTx.transaction_date || apiTx.date || new Date().toISOString().split("T")[0],
		category: apiTx.Category || apiTx.category || "Other", // TODO: map CategoryId → name once we have category lookup
		description: apiTx.Description || apiTx.description || "",
		member: apiTx.Member || apiTx.member || "—", // TODO: map UserId → display name
	};
}


function denormalizeTransaction(tx) {
	return {
		Id: tx.id,
		Amount: Number(tx.amount) || 0,
		Type: tx.type || "expense",
		TransactionDate: tx.date || new Date().toISOString().split("T")[0],
		Description: tx.description || "",
		// CategoryId and UserId would go here once we have proper mapping
	};
}


function normalizeGoal(apiGoal) {
	return {
		id: apiGoal.Id || apiGoal.id,
		name: apiGoal.Name || apiGoal.name || "",
		targetAmount: apiGoal.TargetAmount ?? apiGoal.target_amount ?? 0,
		currentAmount: apiGoal.CurrentAmount ?? apiGoal.current_amount ?? 0,
		deadline: apiGoal.Deadline || apiGoal.deadline || new Date().toISOString().split("T")[0],
		// frontend-only fields (not in API model yet)
		visibility: "all", // default until we add this to the schema
		linkedCategory: null,
		description: "",
		contributors: [],
	};
}

function denormalizeGoal(goal) {
	return {
		Id: goal.id,
		Name: goal.name,
		TargetAmount: Number(goal.targetAmount) || 0,
		CurrentAmount: Number(goal.currentAmount) || 0,
		Deadline: goal.deadline,
	};
}

export function useOrionStore() {
	const [categories, setCategories] = useState(() => readCategories());
	const [transactions, setTransactions] = useState([]);
	const [goals, setGoals] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// fetch transactions and goals from the API on mount
	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				setError(null);

				const [txResponse, goalsResponse] = await Promise.all([
					apiTransactions.list().catch(() => []),
					apiGoals.list().catch(() => []),
				]);

				// normalize API responses into frontend shape
				const normalizedTx = (Array.isArray(txResponse) ? txResponse : []).map(normalizeTransaction);
				const normalizedGoals = (Array.isArray(goalsResponse) ? goalsResponse : []).map(normalizeGoal);

				setTransactions(normalizedTx);
				setGoals(normalizedGoals);
			} catch (err) {
				console.error("Failed to load data from API:", err);
				setError(err.message || "Failed to load data");
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	// persist categories to localStorage whenever they change
	useEffect(() => {
		writeCategories(categories);
	}, [categories]);

	const categoryOptions = categories.slice().sort();

	// Categories (still localStorage-backed)

	function addCategory(name) {
		const trimmed = name.trim();
		if (!trimmed) return { ok: false, message: "Category cannot be empty." };
		const exists = categories.some((c) => c.toLowerCase() === trimmed.toLowerCase());
		if (exists) return { ok: false, message: "Category already exists." };
		setCategories((prev) => [...prev, trimmed]);
		return { ok: true };
	}

	function removeCategory(name) {
		setCategories((prev) => prev.filter((c) => c !== name));
		setTransactions((prev) =>
			prev.map((t) => (t.category === name ? { ...t, category: "Other" } : t))
		);
	}

	// Transactions (API-backed)

	async function addTransaction(tx) {
		try {
			const payload = denormalizeTransaction(tx);
			const created = await apiTransactions.create(payload);
			const normalized = normalizeTransaction(created);
			setTransactions((prev) => [normalized, ...prev]);
			return { ok: true };
		} catch (err) {
			console.error("Failed to create transaction:", err);
			return { ok: false, message: err.message || "Failed to create transaction" };
		}
	}

	async function removeTransaction(id) {
		try {
			await apiTransactions.remove(id);
			setTransactions((prev) => prev.filter((t) => t.id !== id));
			return { ok: true };
		} catch (err) {
			console.error("Failed to delete transaction:", err);
			return { ok: false, message: err.message || "Failed to delete transaction" };
		}
	}

	async function updateTransaction(id, updates) {
		try {
			const existing = transactions.find((t) => t.id === id);
			if (!existing) return { ok: false, message: "Transaction not found" };

			const merged = { ...existing, ...updates };
			const payload = denormalizeTransaction(merged);
			await apiTransactions.update(id, payload);

			setTransactions((prev) =>
				prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
			);
			return { ok: true };
		} catch (err) {
			console.error("Failed to update transaction:", err);
			return { ok: false, message: err.message || "Failed to update transaction" };
		}
	}

	// Goals (API-backed)

	async function addGoal(goal) {
		try {
			const payload = denormalizeGoal(goal);
			const created = await apiGoals.create(payload);
			const normalized = normalizeGoal(created);
			setGoals((prev) => [normalized, ...prev]);
			return { ok: true };
		} catch (err) {
			console.error("Failed to create goal:", err);
			return { ok: false, message: err.message || "Failed to create goal" };
		}
	}

	async function removeGoal(id) {
		try {
			await apiGoals.remove(id);
			setGoals((prev) => prev.filter((g) => g.id !== id));
			return { ok: true };
		} catch (err) {
			console.error("Failed to delete goal:", err);
			return { ok: false, message: err.message || "Failed to delete goal" };
		}
	}

	async function updateGoal(id, updates) {
		try {
			const existing = goals.find((g) => g.id === id);
			if (!existing) return { ok: false, message: "Goal not found" };

			const merged = { ...existing, ...updates };
			const payload = denormalizeGoal(merged);
			await apiGoals.update(id, payload);

			setGoals((prev) =>
				prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
			);
			return { ok: true };
		} catch (err) {
			console.error("Failed to update goal:", err);
			return { ok: false, message: err.message || "Failed to update goal" };
		}
	}

	async function contributeToGoal(id, amount) {
		const amt = Number(amount);
		if (!amt || amt <= 0) return { ok: false, message: "Amount must be positive" };

		const existing = goals.find((g) => g.id === id);
		if (!existing) return { ok: false, message: "Goal not found" };

		return updateGoal(id, { currentAmount: existing.currentAmount + amt });
	}

	return {
		categories: categoryOptions,
		transactions,
		goals,
		loading,
		error,
		addCategory,
		removeCategory,
		addTransaction,
		removeTransaction,
		updateTransaction,
		addGoal,
		removeGoal,
		updateGoal,
		contributeToGoal,
	};
}
