import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthProvider";

export function useOrionStore() {
  const { user, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeError, setStoreError] = useState(null);

  useEffect(() => {
	if (authLoading) return;
	if (!user) {
	  setLoading(false);
	  return;
	}

    async function fetchAll() {
      try {
        setLoading(true);
        setStoreError(null);

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
        setStoreError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
}, [user?.id, authLoading]);

  const categoryOptions = categories.map((c) => c.name).sort();

  async function addCategory(name, type = "expense") {
    const trimmed = name.trim();
    if (!trimmed) return { ok: false, message: "Category cannot be empty." };
    const exists = categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) return { ok: false, message: "Category already exists." };

    const { data: catData, error: catError } = await supabase
      .from("categories")
      .insert({ user_id: user.id, name: trimmed, type })
      .select()
      .single();

    if (catError) return { ok: false, message: catError.message };
    setCategories((prev) => [...prev, catData].sort((a, b) => a.name.localeCompare(b.name)));
    return { ok: true };
  }

  async function removeCategory(name) {
    const cat = categories.find((c) => c.name === name);
    if (!cat) return { ok: false, message: "Category not found." };

    const { error: catError } = await supabase.from("categories").delete().eq("id", cat.id);
    if (catError) return { ok: false, message: catError.message };

    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    setTransactions((prev) =>
      prev.map((t) =>
        t.category_id === cat.id ? { ...t, category_id: null, categories: { name: "Other" } } : t
      )
    );
    return { ok: true };
  }

  async function addTransaction(tx) {
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

    const { data: txData, error: txError } = await supabase
      .from("transactions")
      .insert(payload)
      .select("*, categories(name)")
      .single();

    if (txError) {
      console.error("Failed to create transaction:", txError);
      return { ok: false, message: txError.message };
    }

    setTransactions((prev) => [txData, ...prev]);
    return { ok: true };
  }

  async function removeTransaction(id) {
    const { error: txError } = await supabase.from("transactions").delete().eq("id", id);
    if (txError) {
      console.error("Failed to delete transaction:", txError);
      return { ok: false, message: txError.message };
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    return { ok: true };
  }

  async function updateTransaction(id, updates) {
    const { error: txError } = await supabase.from("transactions").update(updates).eq("id", id);
    if (txError) {
      console.error("Failed to update transaction:", txError);
      return { ok: false, message: txError.message };
    }
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    return { ok: true };
  }

  async function addGoal(goal) {
    const payload = {
      user_id: user.id,
      name: goal.name,
      target_amount: Number(goal.targetAmount),
      current_amount: Number(goal.currentAmount) || 0,
      deadline: goal.deadline || null,
    };

    const { data: goalData, error: goalError } = await supabase
      .from("goals")
      .insert(payload)
      .select()
      .single();

    if (goalError) {
      console.error("Failed to create goal:", goalError);
      return { ok: false, message: goalError.message };
    }

    setGoals((prev) => [goalData, ...prev]);
    return { ok: true };
  }

  async function removeGoal(id) {
    const { error: goalError } = await supabase.from("goals").delete().eq("id", id);
    if (goalError) {
      console.error("Failed to delete goal:", goalError);
      return { ok: false, message: goalError.message };
    }
    setGoals((prev) => prev.filter((g) => g.id !== id));
    return { ok: true };
  }

  async function updateGoal(id, updates) {
    const dbUpdates = {};
    if (updates.targetAmount !== undefined) dbUpdates.target_amount = Number(updates.targetAmount);
    if (updates.currentAmount !== undefined) dbUpdates.current_amount = Number(updates.currentAmount);
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline;

    const { error: goalError } = await supabase.from("goals").update(dbUpdates).eq("id", id);
    if (goalError) {
      console.error("Failed to update goal:", goalError);
      return { ok: false, message: goalError.message };
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
    categoriesFull: categories,
    transactions,
    goals,
    loading,
    error: storeError,
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