import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthProvider";

export function useOrionStore() {
  const { user, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;  // wait for auth to resolve first
    if (!user) {
      setCategories([]);
      setTransactions([]);
      setGoals([]);
      setLoading(false);
      return;
    }

    async function fetchAll() {
      try {
        setLoading(true);
        setError(null);

        const [catRes, txRes, goalRes] = await Promise.all([
          supabase
            .from("categories")
            .select("*")
            .eq("user_id", user.id)
            .order("name", { ascending: true }),
          supabase
            .from("transactions")
            .select("*, categories(name)")
            .eq("user_id", user.id)
            .order("transaction_date", { ascending: false }),
          supabase
            .from("goals")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        ]);

        if (catRes.error) throw catRes.error;
        if (txRes.error) throw txRes.error;
        if (goalRes.error) throw goalRes.error;

        setCategories(catRes.data || []);
        setTransactions(txRes.data || []);
        setGoals(goalRes.data || []);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
}, [user, authLoading]);

  // ─── Category names for dropdowns (just strings) ─────────────────────────
  const categoryOptions = categories.map((c) => c.name).sort();

  // ─── CATEGORIES ──────────────────────────────────────────────────────────

  async function addCategory(name, type = "expense") {
    const trimmed = name.trim();
    if (!trimmed) return { ok: false, message: "Category cannot be empty." };
    const exists = categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) return { ok: false, message: "Category already exists." };

    const { data, error } = await supabase
      .from("categories")
      .insert({ user_id: user.id, name: trimmed, type })
      .select()
      .single();

    if (error) return { ok: false, message: error.message };
    setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    return { ok: true };
  }

  async function removeCategory(name) {
    const cat = categories.find((c) => c.name === name);
    if (!cat) return { ok: false, message: "Category not found." };

    const { error } = await supabase.from("categories").delete().eq("id", cat.id);
    if (error) return { ok: false, message: error.message };

    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    // Update any transactions that used this category to show "Other"
    setTransactions((prev) =>
      prev.map((t) =>
        t.category_id === cat.id ? { ...t, category_id: null, categories: { name: "Other" } } : t
      )
    );
    return { ok: true };
  }

  // ─── TRANSACTIONS ─────────────────────────────────────────────────────────

  async function addTransaction(tx) {
    // Find category id from name
    const cat = categories.find((c) => c.name === tx.category);

    const payload = {
      user_id: user.id,
      amount: Number(tx.amount),
      type: tx.type,
      description: tx.description || "",
      transaction_date: tx.date || new Date().toISOString().split("T")[0],
      category_id: cat?.id || null,
      household_id: tx.household_id || null,
      account_id: tx.account_id || null,
    };

    const { data, error } = await supabase
      .from("transactions")
      .insert(payload)
      .select("*, categories(name)")
      .single();

    if (error) {
      console.error("Failed to create transaction:", error);
      return { ok: false, message: error.message };
    }

    setTransactions((prev) => [data, ...prev]);
    return { ok: true };
  }

  async function removeTransaction(id) {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete transaction:", error);
      return { ok: false, message: error.message };
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    return { ok: true };
  }

  async function updateTransaction(id, updates) {
    const { error } = await supabase.from("transactions").update(updates).eq("id", id);
    if (error) {
      console.error("Failed to update transaction:", error);
      return { ok: false, message: error.message };
    }
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    return { ok: true };
  }

  // ─── GOALS ───────────────────────────────────────────────────────────────

  async function addGoal(goal) {
    const payload = {
      user_id: user.id,
      name: goal.name,
      target_amount: Number(goal.targetAmount),
      current_amount: Number(goal.currentAmount) || 0,
      deadline: goal.deadline || null,
    };

    const { data, error } = await supabase
      .from("goals")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Failed to create goal:", error);
      return { ok: false, message: error.message };
    }

    setGoals((prev) => [data, ...prev]);
    return { ok: true };
  }

  async function removeGoal(id) {
    const { error } = await supabase.from("goals").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete goal:", error);
      return { ok: false, message: error.message };
    }
    setGoals((prev) => prev.filter((g) => g.id !== id));
    return { ok: true };
  }

  async function updateGoal(id, updates) {
    // Map frontend field names to DB column names
    const dbUpdates = {};
    if (updates.targetAmount !== undefined) dbUpdates.target_amount = Number(updates.targetAmount);
    if (updates.currentAmount !== undefined) dbUpdates.current_amount = Number(updates.currentAmount);
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline;

    const { error } = await supabase.from("goals").update(dbUpdates).eq("id", id);
    if (error) {
      console.error("Failed to update goal:", error);
      return { ok: false, message: error.message };
    }
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...dbUpdates } : g)));
    return { ok: true };
  }

  async function contributeToGoal(id, amount) {
    const amt = Number(amount);
    if (!amt || amt <= 0) return { ok: false, message: "Amount must be positive" };

    const existing = goals.find((g) => g.id === id);
    if (!existing) return { ok: false, message: "Goal not found" };

    const newAmount = Number(existing.current_amount) + amt;
    return updateGoal(id, { currentAmount: newAmount });
  }

  return {
    categories: categoryOptions,
    categoriesFull: categories, // full objects with id, type etc.
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