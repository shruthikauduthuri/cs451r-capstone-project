import { useMemo, useState } from "react";
import { useOrionStore } from "../data/useOrionStore";

const TYPE_OPTIONS = ["expense", "income"];

function formatMoney(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function Transactions() {
  const { categories, transactions, addTransaction, removeTransaction } = useOrionStore();

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "Groceries",
    date: new Date().toISOString().slice(0, 10),
    description: "",
  });

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expense,
      net: income - expense,
    };
  }, [transactions]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();

    const amountNum = Number(form.amount);
    if (!amountNum || amountNum <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }

    const newTx = {
      id: crypto.randomUUID(),
      type: form.type,
      amount: amountNum,
      category: form.category,
      date: form.date,
      description: form.description.trim() || "(no description)",
    };

    addTransaction(newTx);

    // Reset amount/description only (keep type/category/date for speed)
    setForm((prev) => ({ ...prev, amount: "", description: "" }));
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <header style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Transactions</h1>
        <span style={{ opacity: 0.8 }}>
          Data Source: <strong>GET /api/transactions</strong>
        </span>
      </header>

      {/* Summary */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        <div style={cardStyle}>
          <div style={labelStyle}>Income</div>
          <div style={valueStyle}>{formatMoney(totals.income)}</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Expenses</div>
          <div style={valueStyle}>{formatMoney(totals.expense)}</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Net</div>
          <div style={valueStyle}>{formatMoney(totals.net)}</div>
        </div>
      </section>

      {/* Add Transaction */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ marginTop: 0, marginBottom: 12 }}>Add Transaction</h2>
          <span style={{ opacity: 0.8, alignSelf: "center" }}>
            Future Action: <strong>POST /api/transactions</strong>
          </span>
        </div>

        <form
          onSubmit={onSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            gap: 12,
            alignItems: "end",
          }}
        >
          {/* Type */}
          <div style={{ gridColumn: "span 3" }}>
            <label style={fieldLabel}>Type</label>
            <select name="type" value={form.type} onChange={onChange} style={fieldInput}>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div style={{ gridColumn: "span 3" }}>
            <label style={fieldLabel}>Amount</label>
            <input
              name="amount"
              value={form.amount}
              onChange={onChange}
              style={fieldInput}
              placeholder="0.00"
              inputMode="decimal"
            />
          </div>

          {/* Category */}
          <div style={{ gridColumn: "span 6" }}>
            <label style={fieldLabel}>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={onChange}
              style={fieldInput}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>
              Examples: Vacation, Groceries, Vendors
            </div>
          </div>

          {/* Date + Add button row (no overlap) */}
          <div style={{ gridColumn: "span 12", display: "flex", gap: 12, alignItems: "end" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <label style={fieldLabel}>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={onChange}
                style={fieldInput}
              />
            </div>

            <div style={{ width: 220 }}>
              <label style={fieldLabel}>&nbsp;</label>
              <button type="submit" style={primaryBtn}>
                Add
              </button>
            </div>
          </div>

          {/* Description */}
          <div style={{ gridColumn: "span 12" }}>
            <label style={fieldLabel}>Description</label>
            <input
              name="description"
              value={form.description}
              onChange={onChange}
              style={fieldInput}
              placeholder="e.g., Costco, rent, paycheck..."
            />
          </div>
        </form>
      </section>

      {/* Table */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 style={{ marginTop: 0 }}>Transaction List</h2>
          <span style={{ opacity: 0.8 }}>
            Future Action: <strong>DELETE /api/transactions/:id</strong>
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", opacity: 0.9 }}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <td style={tdStyle}>{t.date}</td>
                  <td style={tdStyle}>{t.type}</td>
                  <td style={tdStyle}>{t.category}</td>
                  <td style={tdStyle}>{t.description}</td>
                  <td style={tdStyle}>{formatMoney(Number(t.amount))}</td>
                  <td style={tdStyle}>
                    <button onClick={() => removeTransaction(t.id)} style={ghostBtn}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td style={tdStyle} colSpan={6}>
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* Simple inline styling for Sprint 1 demo */
const cardStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 14,
  padding: 16,
};

const labelStyle = { fontSize: 12, opacity: 0.8 };
const valueStyle = { fontSize: 22, fontWeight: 700, marginTop: 6 };

const fieldLabel = { display: "block", fontSize: 12, opacity: 0.85, marginBottom: 6 };

const fieldInput = {
  width: "100%",
  minWidth: 0, // ✅ IMPORTANT: prevents overlap in grids/flex
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.15)",
  color: "inherit",
};

const primaryBtn = {
  width: "100%",
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

const thStyle = { padding: "10px 8px", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6 };
const tdStyle = { padding: "12px 8px", fontSize: 14, opacity: 0.95 };