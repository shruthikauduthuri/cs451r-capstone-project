import { useState } from "react";
import { useOrionStore } from "../data/useOrionStore";

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

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <header style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Categories</h1>
        <span style={{ opacity: 0.8 }}>
          Data Source: <strong>GET /api/categories</strong>
        </span>
      </header>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ marginTop: 0, marginBottom: 12 }}>Add Category</h2>
          <span style={{ opacity: 0.8, alignSelf: "center" }}>
            Future Action: <strong>POST /api/categories</strong>
          </span>
        </div>

        <form onSubmit={onSubmit} style={{ display: "flex", gap: 10 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={fieldInput}
            placeholder="e.g., School, Medical, Soccer, Subscriptions..."
          />
          <button type="submit" style={primaryBtn}>
            Add
          </button>
        </form>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 style={{ marginTop: 0 }}>Category List</h2>
          <span style={{ opacity: 0.8 }}>
            Future Action: <strong>DELETE /api/categories/:name</strong>
          </span>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {categories.map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(0,0,0,0.10)",
              }}
            >
              <div>{c}</div>
              <button onClick={() => removeCategory(c)} style={ghostBtn}>
                Remove
              </button>
            </div>
          ))}
          {categories.length === 0 && <div>No categories yet.</div>}
        </div>
      </section>
    </div>
  );
}

const cardStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 14,
  padding: 16,
};

const fieldInput = {
  flex: 1,
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