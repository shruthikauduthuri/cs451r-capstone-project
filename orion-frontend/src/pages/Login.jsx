import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import "./Login.css";
import { apiAuth, applySession } from "../services/api";
import { useSnackbar } from "../components/Snackbar";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(() => searchParams.get("email")?.trim() ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const { token } = await apiAuth.login({ email, password });

      if (!token) {
        showSnackbar("Login failed. Please check your credentials.", "error");
        return;
      }

      await applySession(token);

      showSnackbar("Welcome back!", "success");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      const message =
        err.status === 401
          ? "Invalid email or password."
          : err.message || "Login failed. Please try again.";
      showSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
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

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
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