import { useMemo, useState } from "react";
import { useOrionStore } from "../data/useOrionStore";

function formatMoney(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function Savings() {
  const { categories, goals, addGoal, removeGoal, contributeToGoal } = useOrionStore();

  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    linkedCategory: "Vacation",
  });

  const totalSaved = useMemo(
    () => goals.reduce((sum, g) => sum + Number(g.currentAmount || 0), 0),
    [goals]
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
    });

    setForm({ name: "", targetAmount: "", linkedCategory: form.linkedCategory });
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <header style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Savings Goals</h1>
        <span style={{ opacity: 0.8 }}>
          Data Source: <strong>GET /api/goals</strong>
        </span>
      </header>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 style={{ marginTop: 0 }}>Overview</h2>
          <span style={{ opacity: 0.8 }}>
            Total Saved (dummy): <strong>{formatMoney(totalSaved)}</strong>
          </span>
        </div>
        <p style={{ marginTop: 6, opacity: 0.85 }}>
          Goals can be linked to a category (ex: Vacation) to show where contributions might come from
          later via automated rules.
        </p>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ marginTop: 0, marginBottom: 12 }}>Create a Goal</h2>
          <span style={{ opacity: 0.8, alignSelf: "center" }}>
            Future Action: <strong>POST /api/goals</strong>
          </span>
        </div>

        {/* ✅ 12-col grid prevents overlap */}
        <form
          onSubmit={onSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            gap: 12,
            alignItems: "end",
          }}
        >
          {/* Goal Name */}
          <div style={{ gridColumn: "span 6" }}>
            <label style={fieldLabel}>Goal Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              style={fieldInput}
              placeholder="e.g., Vacation Fund"
            />
          </div>

          {/* Target Amount */}
          <div style={{ gridColumn: "span 3" }}>
            <label style={fieldLabel}>Target Amount</label>
            <input
              name="targetAmount"
              value={form.targetAmount}
              onChange={onChange}
              style={fieldInput}
              placeholder="2000"
              inputMode="decimal"
            />
          </div>

          {/* Linked Category */}
          <div style={{ gridColumn: "span 3" }}>
            <label style={fieldLabel}>Linked Category</label>
            <select
              name="linkedCategory"
              value={form.linkedCategory}
              onChange={onChange}
              style={fieldInput}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Button row (full width) */}
          <div style={{ gridColumn: "span 12", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" style={{ ...primaryBtn, width: 220 }}>
              Create
            </button>
          </div>
        </form>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 style={{ marginTop: 0 }}>Your Goals</h2>
          <span style={{ opacity: 0.8 }}>
            Future Actions: <strong>PATCH /api/goals/:id</strong> •{" "}
            <strong>DELETE /api/goals/:id</strong>
          </span>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onRemove={() => removeGoal(g.id)}
              onContribute={(amt) => contributeToGoal(g.id, amt)}
            />
          ))}

          {goals.length === 0 && <div>No goals yet — create your first goal.</div>}
        </div>
      </section>
    </div>
  );
}

function GoalCard({ goal, onRemove, onContribute }) {
  const [amount, setAmount] = useState("");

  const progress = Math.min(
    100,
    Math.round((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100)
  );

  function submitContribution(e) {
    e.preventDefault();
    onContribute(amount);
    setAmount("");
  }

  return (
    <div
      style={{
        padding: 14,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(0,0,0,0.10)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{goal.name}</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
            Linked Category: <strong>{goal.linkedCategory || "None"}</strong>
          </div>
        </div>

        <button onClick={onRemove} style={ghostBtn}>
          Remove
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <div style={{ opacity: 0.9 }}>
          Saved: <strong>{formatMoney(goal.currentAmount)}</strong>
        </div>
        <div style={{ opacity: 0.9 }}>
          Target: <strong>{formatMoney(goal.targetAmount)}</strong>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{ height: 10, background: "rgba(255,255,255,0.10)", borderRadius: 999 }}>
          <div
            style={{
              height: 10,
              width: `${progress}%`,
              background: "#22c55e",
              borderRadius: 999,
            }}
          />
        </div>
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>{progress}%</div>
      </div>

      {/* ✅ Prevent overlap in flex row */}
      <form onSubmit={submitContribution} style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ ...fieldInput, flex: 1, minWidth: 0 }}
          placeholder="Contribution amount"
          inputMode="decimal"
        />
        <button type="submit" style={{ ...primaryBtn, width: 160 }}>
          Add
        </button>
      </form>

      <div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>
        Future Action: <strong>POST /api/goals/{goal.id}/contributions</strong>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 14,
  padding: 16,
};

const fieldLabel = { display: "block", fontSize: 12, opacity: 0.85, marginBottom: 6 };

const fieldInput = {
  width: "100%",
  minWidth: 0, 
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.15)",
  color: "inherit",
};

const primaryBtn = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const ghostBtn = {
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
};