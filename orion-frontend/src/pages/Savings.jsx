import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useOrionStore } from "../data/useOrionStore";
import { downloadSavingsReport } from "../utils/downloadReport";
import "./Savings.css";

const VISIBILITY_OPTIONS = [
  { value: "household", label: "Everyone" },
  { value: "admin-only", label: "Admin only" },
  { value: "no-children", label: "Hide from children" },
  { value: "no-roommates", label: "Hide from roommates" },
  { value: "private", label: "Only me" },
];

function formatMoney(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function Savings() {
  const { user, profile, hasRole } = useAuth();
  const { categories, goals, addGoal, removeGoal, updateGoal, contributeToGoal } = useOrionStore();

  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    visibility: "household",
  });

  // Goals from Supabase use snake_case: target_amount, current_amount
  const visibleGoals = useMemo(() => {
    if (hasRole("admin")) return goals;
    return goals; // all users see all their own goals for now
  }, [goals, profile]);

  const totalSaved = useMemo(
    () => visibleGoals.reduce((sum, g) => sum + Number(g.current_amount || 0), 0),
    [visibleGoals]
  );

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const targetNum = Number(form.targetAmount);
    if (!form.name.trim()) return alert("Goal name is required.");
    if (!targetNum || targetNum <= 0) return alert("Target amount must be > 0.");

    const result = await addGoal({
      name: form.name.trim(),
      targetAmount: targetNum,
      currentAmount: 0,
      deadline: form.deadline || null,
    });

    if (!result.ok) {
      alert(result.message || "Failed to create goal.");
      return;
    }

    setForm({ name: "", targetAmount: "", deadline: "", visibility: "household" });
  }

  function handleDownloadReport() {
    // Normalize for report utility
    const reportGoals = visibleGoals.map((g) => ({
      ...g,
      name: g.name,
      currentAmount: g.current_amount,
      targetAmount: g.target_amount,
    }));
    downloadSavingsReport({ goals: reportGoals });
  }

  return (
    <div className="sv-page">
      <header className="orion-page-header">
        <div>
          <h1 className="orion-page-title">Savings Goals</h1>
          <p className="orion-page-sub">Track shared household savings goals</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="btn-outline-light" onClick={handleDownloadReport}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download Report
          </button>
          <button
            type="button"
            className="btn-gradient"
            onClick={() => document.getElementById("sv-add")?.scrollIntoView({ behavior: "smooth" })}
          >
            + Add Goal
          </button>
        </div>
      </header>

      <div className="sv-stack">
        {visibleGoals.map((g) => (
          <GoalCard
            key={g.id}
            goal={g}
            isAdmin={hasRole("admin")}
            onRemove={() => removeGoal(g.id)}
            onContribute={(amt) => contributeToGoal(g.id, amt)}
            onVisibilityChange={(vis) => updateGoal(g.id, { visibility: vis })}
          />
        ))}
        {visibleGoals.length === 0 && <p className="sv-empty">No goals yet — create one below.</p>}
      </div>

      <section id="sv-add" className="orion-card sv-form-card">
        <h2 className="orion-card-title">Create a goal</h2>
        <form className="sv-form" onSubmit={onSubmit}>
          <label className="sv-f">
            Goal name
            <input name="name" value={form.name} onChange={onChange} placeholder="e.g., Emergency fund" required />
          </label>
          <label className="sv-f">
            Target amount
            <input
              name="targetAmount"
              value={form.targetAmount}
              onChange={onChange}
              placeholder="2000"
              inputMode="decimal"
              required
            />
          </label>
          <label className="sv-f">
            Deadline (optional)
            <input type="date" name="deadline" value={form.deadline} onChange={onChange} />
          </label>
          <button type="submit" className="btn-gradient sv-create">
            Create goal
          </button>
        </form>
      </section>
    </div>
  );
}

function GoalCard({ goal, isAdmin, onRemove, onContribute, onVisibilityChange }) {
  const [amount, setAmount] = useState("");

  // Supabase uses snake_case
  const currentAmount = Number(goal.current_amount || 0);
  const targetAmount = Number(goal.target_amount || 0);
  const progress = targetAmount > 0 ? Math.min(100, Math.round((currentAmount / targetAmount) * 100)) : 0;
  const remaining = Math.max(0, targetAmount - currentAmount);

  function submitContribution(e) {
    e.preventDefault();
    onContribute(amount);
    setAmount("");
  }

  return (
    <article className="orion-card sv-goal">
      <div className="sv-goal-head">
        <div className="sv-goal-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </div>
        <div className="sv-goal-title-block">
          <div className="sv-goal-title-row">
            <h3 className="sv-goal-name">{goal.name}</h3>
            <button type="button" className="sv-remove" onClick={onRemove}>
              Remove
            </button>
          </div>
          {goal.deadline && (
            <p className="sv-goal-desc">
              Deadline: {new Date(goal.deadline + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          )}
        </div>
      </div>

      <div className="sv-goal-stats">
        <div>
          <p className="sv-goal-amt">{formatMoney(currentAmount)}</p>
          <p className="sv-goal-of">of {formatMoney(targetAmount)} goal</p>
        </div>
        <span className="sv-goal-pct">{progress}%</span>
      </div>

      <div className="sv-goal-bar">
        <div className="sv-goal-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="sv-goal-remain">{formatMoney(remaining)} remaining to reach goal</p>

      <form className="sv-contrib-form" onSubmit={submitContribution}>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Contribution amount"
          inputMode="decimal"
          className="sv-contrib-input"
        />
        <button type="submit" className="btn-gradient sv-contrib-btn">
          $ Add Contribution
        </button>
      </form>
    </article>
  );
}
