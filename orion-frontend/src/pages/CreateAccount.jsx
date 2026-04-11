import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { supabase } from "../supabaseClient";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (form.password !== form.confirm) {
      setErrorMsg("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
        },
        emailRedirectTo: "http://localhost:5173/login",
      },
    });

    console.log("SIGNUP DATA:", data);
    console.log("SIGNUP ERROR:", error);

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("rate limit")) {
        setErrorMsg(
          "Supabase email sending limit was hit. Wait a while before trying again, or turn off Confirm email in Supabase while testing."
        );
      } else {
        setErrorMsg(error.message);
      }
      return;
    }

    setSuccessMsg("Account created successfully.");

    navigate(`/login?email=${encodeURIComponent(form.email.trim())}`, {
      replace: false,
    });
  }

  return (
    <div className="login-page">
      <p className="login-slogan">Orion: Where your budget finds its direction.</p>

      <div className="login-card-wrap login-card-wrap--wide">
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

          <h1 className="login-title">Create account</h1>
          <p className="login-sub">Set up your household finance workspace.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="auth-name-row">
              <div className="login-field">
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={onChange}
                  placeholder="Jane"
                  required
                />
              </div>
              <div className="login-field">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={onChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="register-email">Email</label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={onChange}
                placeholder="Create a password"
                required
                minLength={8}
              />
            </div>

            <div className="login-field">
              <label htmlFor="register-confirm">Confirm password</label>
              <input
                id="register-confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={onChange}
                placeholder="Confirm your password"
                required
                minLength={8}
              />
            </div>

            {errorMsg && <p className="login-error">{errorMsg}</p>}
            {successMsg && <p className="login-success">{successMsg}</p>}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="login-footer">
            Already have an account?{" "}
            <Link to="/login" className="login-link login-link--emph">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}