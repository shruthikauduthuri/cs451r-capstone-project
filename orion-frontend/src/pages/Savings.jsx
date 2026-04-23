import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrionStore } from "../data/useOrionStore";
import { downloadTextReport } from "../utils/downloadReport";
import "./Savings.css";

const VISIBILITY_OPTIONS = [
  { value: "household", label: "Everyone" },
  { value: "admin-only", label: "Admin only" },
  { value: "no-children", label: "Hide from children" },
  { value: "no-roommates", label: "Hide from roommates" },
  { value: "private", label: "Only me" },
];

function canSeeItem(item, userRole) {
  const vis = item.visibility || "household";
  if (vis === "household") return true;
  if (vis === "private") return false;
  if (vis === "admin-only") return userRole === "admin";
  if (vis === "no-children") return userRole !== "child";
  if (vis === "no-roommates") return userRole !== "roommate";
  return true;
}

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
    linkedCategory: categories[0] || "Other",
    visibility: "household",
  });

  const visibleGoals = useMemo(
    () => goals.filter((g) => hasRole("admin") || canSeeItem(g, profile?.role)),
    [goals, profile]
  );

  const totalSaved = useMemo(
    () => visibleGoals.reduce((sum, g) => sum + Number(g.currentAmount || 0), 0),
    [visibleGoals]
  );

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    const targetNum = Number(form.targetAmount);
    if (!form.name.trim()) return alert("Goal name is required.");
    if (!targetNum || targetNum <= 0) return alert("Target amount must be > 0.");

    addGoal({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      targetAmount: targetNum,
      currentAmount: 0,
      linkedCategory: form.linkedCategory,
      description: "",
      contributors: [],
      visibility: form.visibility,
      createdBy: user?.id,
    });

    setForm({ name: "", targetAmount: "", linkedCategory: categories[0] || "Other", visibility: "household" });
  }

  function handleDownloadReport() {
    downloadTextReport("orion-savings-goals.txt", [
      "Orion — Savings goals",
      `Total saved across goals: ${formatMoney(totalSaved)}`,
      "",
      ...visibleGoals.map((g) => {
        const p = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
        return `${g.name}: ${formatMoney(g.currentAmount)} / ${formatMoney(g.targetAmount)} (${p}%)`;
      }),
    ]);
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
          <button type="button" className="btn-gradient" onClick={() => document.getElementById("sv-add")?.scrollIntoView({ behavior: "smooth" })}>
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
            <input name="targetAmount" value={form.targetAmount} onChange={onChange} placeholder="2000" inputMode="decimal" required />
          </label>
          <label className="sv-f">
            Linked category
            <select name="linkedCategory" value={form.linkedCategory} onChange={onChange}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="sv-f">
            Who can see this?
            <select name="visibility" value={form.visibility} onChange={onChange}>
              {VISIBILITY_OPTIONS.map((v) => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
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
  const progress = Math.min(100, Math.round((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100));
  const remaining = Math.max(0, Number(goal.targetAmount) - Number(goal.currentAmount));
  const contributors = goal.contributors?.length ? goal.contributors : [];

  const visLabel = VISIBILITY_OPTIONS.find((v) => v.value === (goal.visibility || "household"))?.label || "Everyone";

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
          {goal.description ? <p className="sv-goal-desc">{goal.description}</p> : null}
        </div>
      </div>

      <div className="sv-goal-stats">
        <div>
          <p className="sv-goal-amt">{formatMoney(goal.currentAmount)}</p>
          <p className="sv-goal-of">of {formatMoney(goal.targetAmount)} goal</p>
        </div>
        <span className="sv-goal-pct">{progress}%</span>
      </div>

      <div className="sv-goal-bar">
        <div className="sv-goal-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="sv-goal-remain">{formatMoney(remaining)} remaining to reach goal</p>

      {contributors.length > 0 && (
        <>
          <p className="sv-contrib-label">Contributors:</p>
          <p className="sv-contrib-names">
            {contributors.map((n) => (
              <span key={n} className="sv-contrib-link">{n}</span>
            ))}
          </p>
        </>
      )}

      {isAdmin && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 12,
          paddingTop: 12,
          borderTop: "1px solid #e2e8f0",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, color: "#94a3b8" }}>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>Visibility:</span>
          <select
            value={goal.visibility || "household"}
            onChange={(e) => onVisibilityChange(e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: 6,
              border: "1px solid #334155",
              background: "#0f172a",
              color: "#f8fafc",
              fontSize: "0.8125rem",
              cursor: "pointer",
            }}
          >
            {VISIBILITY_OPTIONS.map((v) => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>
      )}

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