import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!session) {
      setErrorMsg("Session expired. Please request a new reset link.");
      return;
    }

    setLoading(true);

    supabase.auth.updateUser({ password: password }).then(({ error }) => {
        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
        setSuccess(true);
        setLoading(false);
      });
  
      setTimeout(() => {
        navigate("/dashboard");
      }, 4000);
  }

  if (authLoading) {
    return (
      <div className="login-page">
        <div className="login-card-wrap">
          <div className="login-card">
            <p style={{ textAlign: "center", color: "#94a3b8" }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <p className="login-slogan">Orion: Where your budget finds its direction.</p>

      <div className="login-card-wrap">
        <div className="login-card">
          <div className="login-brand">
            <span className="login-star" aria-hidden="true">★</span>
            <span className="login-brand-text">Orion</span>
          </div>

          <h1 className="login-title">Reset your password</h1>
          <p className="login-sub">Enter your new password below.</p>

          {success ? (
            <div className="auth-message">
              <p>Your password has been updated successfully. Redirecting to your dashboard...</p>
            </div>
          ) : (
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="new-password">New Password</label>
                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              <div className="login-field">
                <label htmlFor="confirm-password">Confirm New Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                />
              </div>

              {errorMsg && (
                <p style={{ color: "#ef4444", fontSize: "0.875rem", margin: "0 0 8px" }}>{errorMsg}</p>
              )}

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}