import { NavLink, Outlet } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  display: "block",
  padding: "10px 12px",
  borderRadius: 8,
  textDecoration: "none",
  color: isActive ? "#fff" : "#cbd5e1",
  background: isActive ? "#1f2937" : "transparent",
});

export default function MainLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",       // ensures full width
      }}
    >
      <aside
        style={{
          width: 240,
          padding: 16,
          background: "#0b1220",
          color: "#fff",
          flexShrink: 0,     // prevents sidebar from shrinking
        }}
      >
        <h2 style={{ marginTop: 0 }}>Orion</h2>

        <nav style={{ display: "grid", gap: 6, marginTop: 16 }}>
          <NavLink to="/dashboard" style={linkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/transactions" style={linkStyle}>
            Transactions
          </NavLink>
          <NavLink to="/categories" style={linkStyle}>
            Categories
          </NavLink>
          <NavLink to="/savings" style={linkStyle}>
            Savings
          </NavLink>
          <NavLink to="/household" style={linkStyle}>
            Household
          </NavLink>
        </nav>
      </aside>

      <main
        style={{
          flex: 1,                 // fills remaining screen space
          background: "#0f172a",
          color: "#e2e8f0",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            padding: 24,
            width: "100%",         // allow full expansion
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}