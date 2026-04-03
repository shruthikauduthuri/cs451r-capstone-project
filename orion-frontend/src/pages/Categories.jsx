import { useState } from "react";
import { useOrionStore } from "../data/useOrionStore";
import { downloadTextReport } from "../utils/downloadReport";
import "./Categories.css";

const BUDGET_CARDS = [
  {
    id: "groceries",
    name: "Groceries",
    icon: "cart",
    color: "#22c55e",
    spent: 215,
    budget: 500,
    iconBg: "#dcfce7",
  },
  {
    id: "vacation",
    name: "Vacation",
    icon: "plane",
    color: "#3b82f6",
    spent: 450,
    budget: 1000,
    iconBg: "#dbeafe",
  },
  {
    id: "rent",
    name: "Rent",
    icon: "home",
    color: "#a855f7",
    spent: 1500,
    budget: 1500,
    iconBg: "#f3e8ff",
  },
  {
    id: "utilities",
    name: "Utilities",
    icon: "bolt",
    color: "#eab308",
    spent: 180,
    budget: 200,
    iconBg: "#fef9c3",
  },
];

function CategoryIcon({ type }) {
  switch (type) {
    case "cart":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      );
    case "plane":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17.8 19.2L16 11l3.5-3.5c1-1 1-2.5 0-3.5s-2.5-1-3.5 0L12 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.4 1.2c-.2.5 0 1 .4 1.3L9 12l-2 8.8c-.1.5.1 1 .5 1.2.4.2.9.1 1.2-.2l3-2.5 3 2.5c.3.3.8.4 1.2.2.4-.2.6-.7.5-1.2z" />
        </svg>
      );
    case "home":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "bolt":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Categories() {
  const { categories, addCategory, removeCategory } = useOrionStore();
  const [name, setName] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    const res = addCategory(name);
    if (!res.ok) {
      alert(res.message);
      return;
    }
    setName("");
  }

  function downloadCategoryReport(card) {
    downloadTextReport(`orion-category-${card.id}.txt`, [
      `Orion — ${card.name} category`,
      "",
      `Spent: $${card.spent.toLocaleString()}`,
      `Budget: $${card.budget.toLocaleString()}`,
      `Used: ${Math.round((card.spent / card.budget) * 100)}%`,
    ]);
  }

  function handleDownloadAll() {
    downloadTextReport("orion-budget-categories.txt", [
      "Orion — Budget categories",
      "",
      ...BUDGET_CARDS.map(
        (c) => `${c.name}: $${c.spent} of $${c.budget} (${Math.round((c.spent / c.budget) * 100)}%)`
      ),
    ]);
  }

  return (
    <div className="cat-page">
      <header className="orion-page-header">
        <div>
          <h1 className="orion-page-title">Budget Categories</h1>
          <p className="orion-page-sub">Manage your spending categories and budgets</p>
          <span className="orion-badge orion-badge--dark" style={{ marginTop: 10 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            Category data from API
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="btn-outline-light" onClick={handleDownloadAll}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download Report
          </button>
          <button type="button" className="btn-gradient" onClick={() => document.getElementById("cat-add")?.scrollIntoView({ behavior: "smooth" })}>
            + Add Category
          </button>
        </div>
      </header>

      <section className="cat-grid">
        {BUDGET_CARDS.map((card) => {
          const pct = Math.min(100, Math.round((card.spent / card.budget) * 100));
          return (
            <article key={card.id} className="orion-card cat-card">
              <div className="cat-card-top">
                <div className="cat-icon" style={{ background: card.iconBg, color: card.color }}>
                  <CategoryIcon type={card.icon} />
                </div>
                <button type="button" className="cat-dl" aria-label="Download category" onClick={() => downloadCategoryReport(card)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                </button>
              </div>
              <h3 className="cat-name">{card.name}</h3>
              <div className="cat-nums">
                <div>
                  <p className="cat-spent">${card.spent.toLocaleString()}</p>
                  <p className="cat-of">of ${card.budget.toLocaleString()} budget</p>
                </div>
                <span className="cat-pct">{pct}%</span>
              </div>
              <div className="cat-bar">
                <div className="cat-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </article>
          );
        })}
      </section>

      <section id="cat-add" className="orion-card cat-manage">
        <h2 className="orion-card-title">Category names (app list)</h2>
        <p className="cat-manage-sub">Names used when logging transactions. Data persists locally for demo.</p>
        <form className="cat-form" onSubmit={onSubmit}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Medical" className="cat-input" />
          <button type="submit" className="btn-gradient">
            Add
          </button>
        </form>
        <ul className="cat-pill-list">
          {categories.map((c) => (
            <li key={c} className="cat-pill">
              <span>{c}</span>
              <button type="button" onClick={() => removeCategory(c)} className="cat-pill-x">
                ×
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
