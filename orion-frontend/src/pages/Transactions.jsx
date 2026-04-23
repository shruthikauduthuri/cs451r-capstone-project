import { useEffect, useMemo, useState } from "react";
import { useOrionStore } from "../data/useOrionStore";
import { downloadTextReport } from "../utils/downloadReport";
import "./Transactions.css";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

const TYPE_OPTIONS = ["expense", "income"];

function formatMoney(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function formatDisplayDate(iso) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function monthKey(iso) {
  const d = new Date(iso + "T12:00:00");
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function generateMonthOptions() {
  const options = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    options.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    });
  }
  return options;
}

const MONTH_OPTIONS = generateMonthOptions();

export default function Transactions() {
  const { categories, transactions, addTransaction, removeTransaction } = useOrionStore();

  const { user, profile } = useAuth();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function loadMembers() {
      if (!profile?.household_id) {
        const name = user?.user_metadata?.first_name
          ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`.trim()
          : user?.email || "Me";
        setMembers([name]);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("household_id", profile.household_id);
      if (data?.length) {
        setMembers(data.map((m) => m.username || "Unknown"));
      } else {
        const name = user?.user_metadata?.first_name
          ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`.trim()
          : user?.email || "Me";
        setMembers([name]);
      }
    }
    if (user) loadMembers();
  }, [profile, user]);

  const [selectedMonth, setSelectedMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
  );
    const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "Groceries",
    date: new Date().toISOString().slice(0, 10),
    description: "",
    member: "",
  });

  const filtered = useMemo(
    () => transactions.filter((t) => monthKey(t.date) === selectedMonth),
    [transactions, selectedMonth]
  );

  const totals = useMemo(() => {
    const income = filtered.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    return { income, expense };
  }, [filtered]);

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
    addTransaction({
      id: crypto.randomUUID(),
      type: form.type,
      amount: amountNum,
      category: form.category,
      date: form.date,
      description: form.description.trim() || "(no description)",
      member: form.member,
    });
    setForm((prev) => ({ ...prev, amount: "", description: "" }));
  }

  function handleDownloadReport() {
    downloadTextReport(`orion-transactions-${selectedMonth}.txt`, [
      "Orion — Transactions report",
      `Period: ${MONTH_OPTIONS.find((m) => m.key === selectedMonth)?.label || selectedMonth}`,
      "",
      `Total Income: ${formatMoney(totals.income)}`,
      `Total Expenses: ${formatMoney(totals.expense)}`,
      "",
      "Transactions:",
      ...filtered.map(
        (t) =>
          `  ${formatDisplayDate(t.date)} · ${t.category} · ${t.type} · ${formatMoney(Number(t.amount))} · ${t.member || "—"}`
      ),
    ]);
  }

  return (
    <div className="tx-page">
      <header className="orion-page-header tx-header">
        <div>
          <h1 className="orion-page-title">Transactions</h1>
          <p className="orion-page-sub">Track all income and expenses</p>
        </div>
        <button type="button" className="btn-gradient tx-add-btn" onClick={() => document.getElementById("tx-add-form")?.scrollIntoView({ behavior: "smooth" })}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
          Add Transaction
        </button>
      </header>

      <article className="orion-card tx-main-card">
        <div className="tx-card-head">
          <div>
            <h2 className="orion-card-title">All Transactions</h2>
            <span className="orion-badge tx-inline-badge">Transaction list from API</span>
          </div>
        </div>

        <div className="tx-filter-row">
          <div>
            <p className="tx-filter-label">Select Month</p>
            <select
              className="tx-month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="btn-outline-light" onClick={handleDownloadReport}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download Report
          </button>
        </div>

        <div className="tx-totals">
          <div className="tx-total tx-total--in">
            <p className="tx-total-label">Total Income</p>
            <p className="tx-total-value">{formatMoney(totals.income)}</p>
          </div>
          <div className="tx-total tx-total--out">
            <p className="tx-total-label">Total Expenses</p>
            <p className="tx-total-value">{formatMoney(totals.expense)}</p>
          </div>
        </div>

        <ul className="tx-list">
          {filtered.map((t) => {
            const isIncome = t.type === "income";
            return (
              <li key={t.id} className="tx-row">
                <div className="tx-row-left">
                  <span className={isIncome ? "tx-icon tx-icon--in" : "tx-icon tx-icon--out"}>{isIncome ? "+" : "−"}</span>
                  <div>
                    <p className="tx-row-title">{t.category}</p>
                    <p className="tx-row-meta">
                      {formatDisplayDate(t.date)} · {t.member || "—"}
                    </p>
                  </div>
                </div>
                <div className="tx-row-right">
                  <span className={isIncome ? "tx-amt tx-amt--in" : "tx-amt tx-amt--out"}>
                    {isIncome ? "+" : "-"}
                    {formatMoney(Number(t.amount))}
                  </span>
                  <button type="button" className="tx-remove" onClick={() => removeTransaction(t.id)} title="Remove">
                    ×
                  </button>
                </div>
              </li>
            );
          })}
          {filtered.length === 0 && <li className="tx-empty">No transactions for this month.</li>}
        </ul>

        <div id="tx-add-form" className="tx-add-section">
          <h3 className="tx-add-title">Add transaction</h3>
          <form className="tx-form" onSubmit={onSubmit}>
            <div className="tx-form-grid">
              <label className="tx-f">
                Type
                <select name="type" value={form.type} onChange={onChange}>
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="tx-f">
                Amount
                <input name="amount" value={form.amount} onChange={onChange} placeholder="0.00" inputMode="decimal" />
              </label>
              <label className="tx-f">
                Category
                <select name="category" value={form.category} onChange={onChange}>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="tx-f">
                Date
                <input type="date" name="date" value={form.date} onChange={onChange} />
              </label>
              <label className="tx-f">
                Member
                <select name="member" value={form.member} onChange={onChange}>
                {members.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
              <label className="tx-f tx-f--wide">
                Note
                <input name="description" value={form.description} onChange={onChange} placeholder="Optional" />
              </label>
            </div>
            <button type="submit" className="btn-gradient tx-submit">
              Save transaction
            </button>
          </form>
        </div>
      </article>
    </div>
  );
}
