import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
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
            <span className="login-star" aria-hidden="true">
              ★
            </span>
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
                instructions shortly.
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

              <button type="submit" className="login-submit">
                Send reset link
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
