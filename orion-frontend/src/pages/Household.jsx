import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import "./Household.css";

const ROLE_COLORS = {
  admin: "#2563eb",
  partner: "#9333ea",
  roommate: "#16a34a",
  child: "#f59e0b",
};

const ROLE_OPTIONS = ["admin", "partner", "roommate", "child"];

export default function Household() {
  const { user, profile, hasRole, refreshProfile } = useAuth();
  const [members, setMembers] = useState([]);
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const [householdName, setHouseholdName] = useState("");
  const [creating, setCreating] = useState(false);

  const [joinInput, setJoinInput] = useState("");
  const [joining, setJoining] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!profile) {
      setLoading(false);
      return;
    }

    async function loadHousehold() {
      setLoading(true);

      if (!profile.household_id) {
        setLoading(false);
        return;
      }

      const { data: hh, error: hhError } = await supabase
        .from("households")
        .select("*")
        .eq("id", profile.household_id)
        .single();

      if (hhError) {
        console.error("Error fetching household:", hhError.message);
        setLoading(false);
        return;
      }
      setHousehold(hh);

      const { data: memberData, error: memError } = await supabase
        .from("profiles")
        .select("id, username, role, created_at")
        .eq("household_id", profile.household_id);

      if (memError) {
        console.error("Error fetching members:", memError.message);
      } else {
        setMembers(memberData || []);
      }

      setLoading(false);
    }

    loadHousehold();
  }, [profile]);

  async function handleCreate() {
    if (!householdName.trim()) return;
    setCreating(true);
    setErrorMsg("");

    const { data: newHH, error: createError } = await supabase
      .from("households")
      .insert({ name: householdName.trim(), created_by: user.id })
      .select()
      .single();

    if (createError) {
      setErrorMsg(createError.message);
      setCreating(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ household_id: newHH.id, role: "admin" })
      .eq("id", user.id);

    if (updateError) {
      setErrorMsg(updateError.message);
      setCreating(false);
      return;
    }

    window.location.href = "/household";
  }

  async function handleJoin() {
    if (!joinInput.trim()) return;
    setJoining(true);
    setErrorMsg("");

    try {
      const { data: foundHH, error: findError } = await supabase
        .from("households")
        .select("id")
        .eq("join_code", joinInput.trim().toUpperCase())
        .maybeSingle();

      if (findError) {
        setErrorMsg("Search error: " + findError.message);
        setJoining(false);
        return;
      }

      if (!foundHH) {
        setErrorMsg("No household found with that join code.");
        setJoining(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ household_id: foundHH.id, role: "partner" })
        .eq("id", user.id);

      if (updateError) {
        setErrorMsg("Join error: " + updateError.message);
        setJoining(false);
        return;
      }

      window.location.href = "/household";
    } catch (err) {
      setErrorMsg("Unexpected error: " + err.message);
      setJoining(false);
    }
  }

  async function handleRoleChange(memberId, newRole) {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", memberId);

    if (error) {
      alert("Error updating role: " + error.message);
      return;
    }

    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
  }

  function copyCode() {
    if (!household?.join_code) return;
    navigator.clipboard?.writeText(household.join_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getInitials(name) {
    if (!name) return "?";
    return name
      .split(/[\s@]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  }

  if (loading) {
    return (
      <div className="hh-page">
        <p style={{ color: "#94a3b8" }}>Loading household...</p>
      </div>
    );
  }

  if (!profile?.household_id) {
    return (
      <div className="hh-page">
        <header className="orion-page-header">
          <div>
            <h1 className="orion-page-title">Household</h1>
            <p className="orion-page-sub">Create or join a household to get started</p>
          </div>
        </header>

        <article className="orion-card hh-card">
          <h2 className="orion-card-title">Create a Household</h2>
          <p className="hh-join-desc">Start a new household and invite your family, partner, or roommates.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Household name (e.g. The Johnsons)"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#f8fafc",
                fontSize: "0.875rem",
              }}
            />
            <button type="button" className="btn-gradient" onClick={handleCreate} disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </article>

        <article className="orion-card hh-card">
          <h2 className="orion-card-title">Join a Household</h2>
          <p className="hh-join-desc">Enter the join code shared by your household admin.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Enter join code (e.g. A1B2C3D4)"
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#f8fafc",
                fontSize: "0.875rem",
                fontFamily: "monospace",
                letterSpacing: "0.05em",
              }}
            />
            <button type="button" className="btn-gradient" onClick={handleJoin} disabled={joining}>
              {joining ? "Joining..." : "Join"}
            </button>
          </div>
        </article>

        {errorMsg && (
          <p style={{ color: "#ef4444", marginTop: 8, fontSize: "0.875rem" }}>{errorMsg}</p>
        )}
      </div>
    );
  }

  return (
    <div className="hh-page">
      <header className="orion-page-header">
        <div>
          <h1 className="orion-page-title">{household?.name || "Household"}</h1>
          <p className="orion-page-sub">Manage members and permissions</p>
        </div>
        {hasRole("admin") && (
          <button type="button" className="btn-gradient hh-invite" onClick={copyCode}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            {copied ? "Code Copied!" : "Invite Member"}
          </button>
        )}
      </header>

      <article className="orion-card hh-card">
        <div className="hh-card-head">
          <h2 className="orion-card-title">Household Members ({members.length})</h2>
        </div>
        <ul className="hh-members">
          {members.map((m) => {
            const isCurrentUser = m.id === user.id;
            const isAdmin = hasRole("admin");

            return (
              <li key={m.id} className="hh-member">
                <div className="hh-avatar" style={{ background: ROLE_COLORS[m.role] || "#64748b" }}>
                  {getInitials(m.username)}
                </div>
                <div className="hh-member-info">
                  <p className="hh-member-name">
                    {m.username || "Unknown"}
                    {isCurrentUser && <span style={{ color: "#94a3b8", fontWeight: 400 }}> (you)</span>}
                  </p>
                  <p className="hh-member-email">Joined {new Date(m.created_at).toLocaleDateString()}</p>
                </div>

                {isAdmin && !isCurrentUser ? (
                  <select
                    className="hh-role-select"
                    value={m.role}
                    onChange={(e) => handleRoleChange(m.id, e.target.value)}
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={m.role === "admin" ? "hh-role hh-role--admin" : "hh-role"}>
                    {m.role === "admin" && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6-4.7-6 4.7 2.3-7-6-4.6h7.6z" />
                      </svg>
                    )}
                    {m.role.charAt(0).toUpperCase() + m.role.slice(1)}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </article>

      {hasRole("admin") && (
        <article className="orion-card hh-card">
          <h2 className="orion-card-title">Household Join Code</h2>
          <p className="hh-join-desc">Share this code with others to join your household</p>
          <div className="hh-code-box">
            <p className="hh-code-label">Join Code</p>
            <p className="hh-code-value">{household?.join_code}</p>
          </div>
          <button type="button" className="btn-outline-light hh-copy" onClick={copyCode}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </article>
      )}
    </div>
  );
}