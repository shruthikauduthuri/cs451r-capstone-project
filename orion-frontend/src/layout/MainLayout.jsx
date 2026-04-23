import { NavLink, Outlet } from "react-router-dom";

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" />
    </svg>
  );
}

function IconCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2H2v10l10 10 10-10L12 2z" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function IconSparkles() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2l1.7 4.6L18 8.3l-4.3 1.7L12 14l-1.7-4.3L6 8.3l4.3-1.7L12 2z" />
      <path d="M19 13l.9 2.4L22 16l-2.1.6L19 19l-.9-2.4L16 16l2.1-.6L19 13z" />
      <path d="M5 14l1.2 3.1L9 18.3l-2.8 1.1L5 22l-1.2-2.6L1 18.3l2.8-1.2L5 14z" />
    </svg>
  );
}

const navItems = [
  { to: "/dashboard", label: "Dashboard", Icon: IconHome },
  { to: "/transactions", label: "Transactions", Icon: IconCard },
  { to: "/categories", label: "Budget Categories", Icon: IconTag },
  { to: "/savings", label: "Savings Goals", Icon: IconTarget },
  { to: "/household", label: "Household", Icon: IconUsers },
  { to: "/settings", label: "Settings", Icon: IconSettings },
  { to: "/ask-ai", label: "Ask Orion AI", Icon: IconSparkles },
];

function Constellation() {
  return (
    <svg className="orion-constellation" viewBox="0 0 200 120" aria-hidden="true">
      <g stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" fill="none">
        <line x1="20" y1="40" x2="55" y2="25" />
        <line x1="55" y1="25" x2="90" y2="45" />
        <line x1="90" y1="45" x2="130" y2="30" />
        <line x1="130" y1="30" x2="165" y2="55" />
        <line x1="90" y1="45" x2="75" y2="85" />
        <line x1="75" y1="85" x2="110" y2="95" />
      </g>
      {[
        [20, 40],
        [55, 25],
        [90, 45],
        [130, 30],
        [165, 55],
        [75, 85],
        [110, 95],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2" fill="rgba(255,255,255,0.55)" />
      ))}
    </svg>
  );
}

export default function MainLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <aside
        style={{
          width: 232,
          flexShrink: 0,
          background: "var(--orion-sidebar)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          padding: "20px 14px",
        }}
      >
        <div style={{ padding: "8px 12px 28px", display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: 20,
              background: "linear-gradient(135deg, #3b82f6, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ★
          </span>
          <span style={{ fontSize: 1.125 * 16, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.03em" }}>
            Orion
          </span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => {
            const IconComponent = item.Icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#f8fafc" : "#94a3b8",
                  background: isActive ? "var(--orion-sidebar-active)" : "transparent",
                  transition: "background 0.15s, color 0.15s",
                })}
              >
                <IconComponent />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto", padding: "16px 12px 8px", fontSize: 12, color: "#475569" }}>
          Orion · Household finance
        </div>
      </aside>

      <div className="orion-app-bg" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Constellation />
        <div className="orion-page-inner" style={{ flex: 1, width: "100%" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
