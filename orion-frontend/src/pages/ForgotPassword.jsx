import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="login-page">
      <p className="login-slogan">Orion: Where your budget finds its direction.</p>

      <div className="login-card-wrap">
        <div className="login-card">
          <p className="auth-nav">
            <Link to="/login" className="login-link">
              ← Back to sign in
            </Link>
          </p>

          <div className="login-brand">
            <span className="login-star" aria-hidden="true">★</span>
            <span className="login-brand-text">Orion</span>
          </div>

          <h1 className="login-title">Forgot password</h1>
          <p className="login-sub">
            Enter the email for your account and we&apos;ll send you a link to reset your password.
          </p>

          {submitted ? (
            <div className="auth-message">
              <p>
                If an account exists for <strong>{email}</strong>, you&apos;ll receive an email with reset
                instructions shortly. Check your spam folder if you don&apos;t see it.
              </p>
              <Link to="/login" className="login-submit auth-submit-link">
                Return to sign in
              </Link>
            </div>
          ) : (
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="forgot-email">Email</label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              {errorMsg && (
                <p style={{ color: "#ef4444", fontSize: "0.875rem", margin: "0 0 8px" }}>{errorMsg}</p>
              )}

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}