import { useState } from "react";
import { getCurrentUser } from "../services/api";
import { supabase } from "../supabaseClient";

export default function ApiTester() {
  const [results, setResults] = useState([]);

  function log(label, status, data) {
    setResults(prev => [{
      label,
      status,
      data: JSON.stringify(data, null, 2),
      time: new Date().toLocaleTimeString()
    }, ...prev]);
  }

  async function testGetCurrentUser() {
    try {
      const data = await getCurrentUser();
      log("GET /api/users/me", "ok", data);
    } catch (e) {
      log("GET /api/users/me", "error", { error: e.message });
    }
  }

  async function testGetCurrentUserNoToken() {
    try {
      const res = await fetch("http://localhost:5033/api/users/me");
      const data = await res.json();
      log("GET /api/users/me (no token)", res.ok ? "ok" : "error", data);
    } catch (e) {
      log("GET /api/users/me (no token)", "error", { error: e.message });
    }
  }

  async function testLogin() {
    try {
      const res = await fetch("http://localhost:5033/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@test.com", password: "wrongpassword" }),
      });
      const data = await res.json();
      log("POST /api/auth/login (wrong pw)", res.ok ? "ok" : "error", data);
    } catch (e) {
      log("POST /api/auth/login (wrong pw)", "error", { error: e.message });
    }
  }

  async function testGetBudgets() {
    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      const res = await fetch("http://localhost:5033/api/budgets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      log("GET /api/budgets", res.ok ? "ok" : "error", data);
    } catch (e) {
      log("GET /api/budgets", "error", { error: e.message });
    }
  }

  async function testNotFound() {
    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      const res = await fetch("http://localhost:5033/api/budgets/99999", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      log("GET /api/budgets/99999 (expect 404)", res.ok ? "ok" : "error", data);
    } catch (e) {
      log("GET /api/budgets/99999", "error", { error: e.message });
    }
  }

  function clearResults() { setResults([]); }

  const tests = [
    { label: "GET /api/users/me (with token)", fn: testGetCurrentUser, expect: "200" },
    { label: "GET /api/users/me (no token)", fn: testGetCurrentUserNoToken, expect: "401" },
    { label: "POST /api/auth/login (wrong pw)", fn: testLogin, expect: "401" },
    { label: "GET /api/budgets", fn: testGetBudgets, expect: "200" },
    { label: "GET /api/budgets/99999", fn: testNotFound, expect: "404" },
  ];

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 800 }}>
      <h2 style={{ marginBottom: "1rem" }}>API Tester</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1.5rem" }}>
        {tests.map(t => (
          <button key={t.label} onClick={t.fn} style={{
            padding: "6px 12px", fontSize: 13, cursor: "pointer",
            border: "1px solid #ccc", borderRadius: 6, background: "#f9f9f9"
          }}>
            {t.label} <span style={{ color: "#888" }}>→ {t.expect}</span>
          </button>
        ))}
        <button onClick={clearResults} style={{
          padding: "6px 12px", fontSize: 13, cursor: "pointer",
          border: "1px solid #eee", borderRadius: 6, color: "#999"
        }}>
          Clear
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {results.map((r, i) => (
          <div key={i} style={{
            border: `1px solid ${r.status === "ok" ? "#c3e6cb" : "#f5c6cb"}`,
            borderRadius: 6, padding: "10px 14px",
            background: r.status === "ok" ? "#f0fff4" : "#fff5f5"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>{r.label}</span>
              <span style={{ fontSize: 12, color: "#888" }}>{r.time}</span>
            </div>
            <pre style={{ margin: 0, fontSize: 12, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {r.data}
            </pre>
          </div>
        ))}
        {results.length === 0 && (
          <p style={{ color: "#aaa", fontSize: 13 }}>No results yet — run a test above.</p>
        )}
      </div>
    </div>
  );
}