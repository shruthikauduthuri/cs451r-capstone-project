import { useEffect, useMemo, useState } from "react";
import { DEFAULT_CATEGORIES, DEFAULT_TRANSACTIONS, DEFAULT_GOALS } from "./store";

// localStorage keys
const K_CATEGORIES = "orion_categories_v1";
const K_TRANSACTIONS = "orion_transactions_v1";
const K_GOALS = "orion_goals_v1";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useOrionStore() {
  const [categories, setCategories] = useState(() => read(K_CATEGORIES, DEFAULT_CATEGORIES));
  const [transactions, setTransactions] = useState(() =>
    read(K_TRANSACTIONS, DEFAULT_TRANSACTIONS)
  );

  // ✅ goals must be INSIDE the hook
  const [goals, setGoals] = useState(() => read(K_GOALS, DEFAULT_GOALS));

  useEffect(() => write(K_CATEGORIES, categories), [categories]);
  useEffect(() => write(K_TRANSACTIONS, transactions), [transactions]);

  // ✅ persist goals too
  useEffect(() => write(K_GOALS, goals), [goals]);

  const categoryOptions = useMemo(() => categories.slice().sort(), [categories]);

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

  function addTransaction(tx) {
    setTransactions((prev) => [tx, ...prev]);
  }

  function removeTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  function addGoal(goal) {
    setGoals((prev) => [goal, ...prev]);
  }

  function removeGoal(id) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  function contributeToGoal(id, amount) {
    const amt = Number(amount);
    if (!amt || amt <= 0) return;

    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, currentAmount: g.currentAmount + amt } : g
      )
    );
  }

  return {
    categories: categoryOptions,
    transactions,
    goals,
    addCategory,
    removeCategory,
    addTransaction,
    removeTransaction,
    addGoal,
    removeGoal,
    contributeToGoal,
  };
}