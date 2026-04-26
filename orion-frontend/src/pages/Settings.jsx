import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import { useSnackbar } from "../components/Snackbar";
import "./Settings.css";

export default function Settings() {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [emailNotif, setEmailNotif] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);

  // Load user metadata on mount
  useEffect(() => {
    if (user) {
      setFirstName(user.user_metadata?.first_name || "");
      setLastName(user.user_metadata?.last_name || "");
    }
  }, [user]);

  async function handleSaveProfile() {
    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName },
    });

    if (error) {
      showSnackbar(error.message, "error");
      setSaving(false);
      return;
    }

    // Also update the profiles table username
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ username: firstName + " " + lastName })
      .eq("id", user.id);

    if (profileError) {
      showSnackbar("Profile saved, but username update failed: " + profileError.message, "warning");
    } else {
      showSnackbar("Profile updated!", "success");
    }

    setSaving(false);
  }

  return (
    <div className="set-page">
      <header className="orion-page-header">
        <div>
          <h1 className="orion-page-title">Settings</h1>
          <p className="orion-page-sub">Manage your account and preferences</p>
        </div>
      </header>

      <article className="orion-card set-card">
        <div className="set-card-h">
          <span className="set-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <div>
            <h2 className="set-card-title">Profile Settings</h2>
            <p className="set-card-sub">Update your personal information</p>
          </div>
        </div>
        <div className="set-fields">
          <label className="set-f">
            First Name
            <input
              type="text"
              className="set-input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label className="set-f">
            Last Name
            <input
              type="text"
              className="set-input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label className="set-f set-f--full">
            Email
            <span className="set-val">{user?.email || ""}</span>
          </label>
        </div>
        <button
          type="button"
          className="btn-gradient set-btn"
          onClick={handleSaveProfile}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </article>

      <article className="orion-card set-card">
        <div className="set-card-h">
          <span className="set-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <div>
            <h2 className="set-card-title">Security</h2>
            <p className="set-card-sub">Manage your password and security preferences</p>
          </div>
        </div>
        <div className="set-stack">
          <label className="set-f">
            Current Password
            <input type="password" placeholder="••••••••" className="set-input" />
          </label>
          <label className="set-f">
            New Password
            <input type="password" placeholder="••••••••" className="set-input" />
          </label>
          <label className="set-f">
            Confirm New Password
            <input type="password" placeholder="••••••••" className="set-input" />
          </label>
        </div>
        <button type="button" className="btn-gradient set-btn">
          Update Password
        </button>
      </article>

      <article className="orion-card set-card">
        <div className="set-card-h">
          <span className="set-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </span>
          <div>
            <h2 className="set-card-title">Notifications</h2>
            <p className="set-card-sub">Manage how you receive notifications</p>
          </div>
        </div>
        <div className="set-toggle-list">
          <div className="set-toggle-row">
            <div>
              <p className="set-toggle-title">Email Notifications</p>
              <p className="set-toggle-desc">Receive updates about transactions and budgets.</p>
            </div>
            <button
              type="button"
              className={emailNotif ? "set-switch set-switch--on" : "set-switch"}
              onClick={() => setEmailNotif((v) => !v)}
              aria-pressed={emailNotif}
            >
              <span className="set-switch-knob" />
            </button>
          </div>
          <div className="set-toggle-row">
            <div>
              <p className="set-toggle-title">Budget Alerts</p>
              <p className="set-toggle-desc">Get notified when approaching budget limits.</p>
            </div>
            <button
              type="button"
              className={budgetAlerts ? "set-switch set-switch--on" : "set-switch"}
              onClick={() => setBudgetAlerts((v) => !v)}
              aria-pressed={budgetAlerts}
            >
              <span className="set-switch-knob" />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
