import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(() => searchParams.get("email")?.trim() ?? "");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    navigate("/dashboard");
  }

  return (
    <div className="login-page">
      <p className="login-slogan">Orion: Where your budget finds its direction.</p>

      <div className="login-card-wrap">
        <div className="login-card">
          <div className="login-brand">
            <span className="login-star" aria-hidden="true">
              ★
            </span>
            <span className="login-brand-text">Orion</span>
          </div>

          <h1 className="login-title">Welcome back</h1>
          <p className="login-sub">Sign in to manage your household finances</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="login-field">
              <div className="login-row-labels">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="login-link">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="login-submit">
              Login
            </button>
          </form>

          <p className="login-footer">
            Don&apos;t have an account?{" "}
            <Link to="/create-account" className="login-link login-link--emph">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
