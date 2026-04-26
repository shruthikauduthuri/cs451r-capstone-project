import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../components/Snackbar";
import "./Login.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (password.length < 6) {
      showSnackbar("Password must be at least 6 characters.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showSnackbar("Passwords do not match.", "error");
      return;
    }

    if (!session) {
      showSnackbar("Session expired. Please request a new reset link.", "error");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      showSnackbar(error.message, "error");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    showSnackbar("Password updated. Redirecting to your dashboard...", "success");

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
