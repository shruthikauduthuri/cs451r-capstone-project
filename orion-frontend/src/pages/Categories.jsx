import { useState } from "react";
import { useOrionStore } from "../data/useOrionStore";
import { downloadCategoriesReport } from "../utils/downloadReport";
import "./Categories.css";

export default function Categories() {
  const { categories, transactions, addCategory, removeCategory } = useOrionStore();
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

  function handleDownloadAll() {
    downloadCategoriesReport({ categories, transactions });
  }

  return (
    <div className="cat-page">
      <header className="orion-page-header">
        <div>
          <h1 className="orion-page-title">Budget Categories</h1>
          <p className="orion-page-sub">Manage your spending categories</p>
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
        {categories.map((c) => (
          <article key={c} className="orion-card cat-card">
            <h3 className="cat-name">{c}</h3>
            <button
              type="button"
              className="btn-outline-light"
              style={{ marginTop: 12, fontSize: "0.8125rem" }}
              onClick={() => removeCategory(c)}
            >
              Remove
            </button>
          </article>
        ))}
        {categories.length === 0 && (
          <p style={{ color: "#94a3b8" }}>No categories yet. Add one below.</p>
        )}
      </section>

      <section id="cat-add" className="orion-card cat-manage">
        <h2 className="orion-card-title">Add a Category</h2>
        <form className="cat-form" onSubmit={onSubmit}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Medical" className="cat-input" />
          <button type="submit" className="btn-gradient">
            Add
          </button>
        </form>
      </section>
    </div>
  );
}