import { useState } from "react";
import "./Household.css";

const DEMO_MEMBERS = [
  { name: "Sarah Johnson", email: "sarah@example.com", initials: "SJ", role: "Admin", roleType: "admin", color: "#2563eb" },
  { name: "Alex Martinez", email: "alex@example.com", initials: "AM", role: "Partner", roleType: "partner", color: "#9333ea" },
  { name: "Jake Thompson", email: "jake@example.com", initials: "JT", role: "Roommate", roleType: "roommate", color: "#16a34a" },
];

export default function Household() {
  const [copied, setCopied] = useState(false);
  const joinCode = "ORION-2024-XYZ";

  function copyCode() {
    navigator.clipboard?.writeText(joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="hh-page">
      <header className="orion-page-header">
        <div>
          <h1 className="orion-page-title">Household Management</h1>
          <p className="orion-page-sub">Manage members and permissions</p>
        </div>
        <button type="button" className="btn-gradient hh-invite">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          Invite Member
        </button>
      </header>

      <article className="orion-card hh-card">
        <div className="hh-card-head">
          <h2 className="orion-card-title">Household Members (3)</h2>
          <span className="orion-badge">Members from API</span>
        </div>
        <ul className="hh-members">
          {DEMO_MEMBERS.map((m) => (
            <li key={m.email} className="hh-member">
              <div className="hh-avatar" style={{ background: m.color }}>
                {m.initials}
              </div>
              <div className="hh-member-info">
                <p className="hh-member-name">{m.name}</p>
                <p className="hh-member-email">{m.email}</p>
              </div>
              <span className={m.roleType === "admin" ? "hh-role hh-role--admin" : "hh-role"}>
                {m.roleType === "admin" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6-4.7-6 4.7 2.3-7-6-4.6h7.6z" />
                  </svg>
                )}
                {m.roleType !== "admin" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
                {m.role}
              </span>
            </li>
          ))}
        </ul>
      </article>

      <article className="orion-card hh-card">
        <h2 className="orion-card-title">Household Join Code</h2>
        <p className="hh-join-desc">Share this code with family members to join your household</p>
        <div className="hh-code-box">
          <p className="hh-code-label">Join Code</p>
          <p className="hh-code-value">{joinCode}</p>
        </div>
        <button type="button" className="btn-outline-light hh-copy" onClick={copyCode}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {copied ? "Copied!" : "Copy Code"}
        </button>
        <span className="orion-badge" style={{ marginTop: 16 }}>
          Join code from API
        </span>
      </article>
    </div>
  );
}
