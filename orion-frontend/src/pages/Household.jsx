import { useState } from "react";

export default function Household() {
  const [householdName, setHouseholdName] = useState("");
  const [joinCode, setJoinCode] = useState(null);
  const [members, setMembers] = useState([]);

  const [joinInput, setJoinInput] = useState("");
  const [role, setRole] = useState("partner");

  function createHousehold(e) {
    e.preventDefault();

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    setJoinCode(code);

    setMembers([
      {
        name: "You",
        role: "admin",
      },
    ]);
  }

  function joinHousehold(e) {
    e.preventDefault();

    if (!joinCode || joinInput !== joinCode) {
      alert("Invalid join code.");
      return;
    }

    setMembers((prev) => [
      ...prev,
      {
        name: `Member ${prev.length}`,
        role,
      },
    ]);

    setJoinInput("");
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1>Household</h1>

      <section style={cardStyle}>
        <h2>Create Household</h2>

        <form onSubmit={createHousehold} style={{ display: "flex", gap: 10 }}>
          <input
            value={householdName}
            onChange={(e) => setHouseholdName(e.target.value)}
            placeholder="Household name"
            style={fieldInput}
          />

          <button type="submit" style={primaryBtn}>
            Create
          </button>
        </form>

        {joinCode && (
          <p style={{ marginTop: 12 }}>
            Join Code: <strong>{joinCode}</strong>
          </p>
        )}

        <div style={{ fontSize: 12, opacity: 0.7 }}>
          Future API: POST /api/households
        </div>
      </section>

      <section style={cardStyle}>
        <h2>Join Household</h2>

        <form onSubmit={joinHousehold} style={{ display: "flex", gap: 10 }}>
          <input
            value={joinInput}
            onChange={(e) => setJoinInput(e.target.value)}
            placeholder="Enter join code"
            style={fieldInput}
          />

          <select value={role} onChange={(e) => setRole(e.target.value)} style={fieldInput}>
            <option value="partner">Partner</option>
            <option value="roommate">Roommate</option>
            <option value="child">Child</option>
          </select>

          <button type="submit" style={primaryBtn}>
            Join
          </button>
        </form>

        <div style={{ fontSize: 12, opacity: 0.7 }}>
          Future API: POST /api/households/join
        </div>
      </section>

      <section style={cardStyle}>
        <h2>Members</h2>

        {members.map((m, i) => (
          <div key={i} style={memberRow}>
            <div>{m.name}</div>
            <div>{m.role}</div>
          </div>
        ))}

        {members.length === 0 && <p>No members yet.</p>}
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

const memberRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};