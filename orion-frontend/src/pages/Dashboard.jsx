import { SpendingByCategoryPie, BudgetStatusDoughnut, SpendingTrendArea } from "../components/DashboardCharts";
import { downloadTextReport } from "../utils/downloadReport";
import "./Dashboard.css";

const recentTransactions = [
  { id: 1, category: "Groceries", date: "Mar 3", amount: -85, type: "expense" },
  { id: 2, category: "Salary", date: "Mar 2", amount: 3000, type: "income" },
  { id: 3, category: "Dining", date: "Mar 1", amount: -42, type: "expense" },
];

export default function Dashboard() {
  function handleDownloadReport() {
    downloadTextReport(`orion-dashboard-${new Date().toISOString().slice(0, 10)}.txt`, [
      "Orion — Dashboard report",
      "",
      "Total Budget: $5,000",
      "Remaining Balance: $2,850 (57% remaining)",
      "",
      "Spending by category (approx.): Rent 64%, Vacation 19%, Groceries 9%, Utilities 8%",
      "Budget status: Spent 47%, Remaining 53%",
      "",
      "Recent transactions:",
      ...recentTransactions.map((t) => {
        const amt =
          t.type === "income" ? `+$${t.amount.toLocaleString()}` : `-$${Math.abs(t.amount).toLocaleString()}`;
        return `  ${t.category} · ${t.date} · ${amt}`;
      }),
    ]);
  }

  return (
    <div className="dash-page">
      <header className="orion-page-header">
        <div>
          <h1 className="orion-page-title">Dashboard</h1>
          <p className="orion-page-sub">Overview of your household finances</p>
          <p className="orion-page-tagline">Orion: Where your budget finds its direction.</p>
        </div>
        <button type="button" className="btn-outline-light" onClick={handleDownloadReport}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download Report
        </button>
      </header>

      <section className="dash-row dash-row--2">
        <article className="orion-card dash-summary-card">
          <p className="dash-summary-label">Total Budget</p>
          <p className="dash-summary-value">$5,000</p>
          <div className="orion-badge dash-api-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Data pulled from API
          </div>
        </article>
        <article className="orion-card dash-summary-card">
          <p className="dash-summary-label">Remaining Balance</p>
          <p className="dash-summary-value">$2,850</p>
          <p className="dash-summary-meta">57% remaining</p>
          <div className="orion-badge dash-api-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Data pulled from API
          </div>
        </article>
      </section>

      <section className="dash-row dash-row--2">
        <article className="orion-card">
          <div className="orion-card-header">
            <h2 className="orion-card-title">Spending by Category</h2>
            <span className="orion-badge">Category breakdown from API</span>
          </div>
          <SpendingByCategoryPie />
        </article>
        <article className="orion-card">
          <div className="orion-card-header">
            <h2 className="orion-card-title">Budget Status</h2>
            <span className="orion-badge">Budget status from API</span>
          </div>
          <BudgetStatusDoughnut />
        </article>
      </section>

      <section className="dash-row">
        <article className="orion-card">
          <div className="orion-card-header">
            <h2 className="orion-card-title">Spending Trend</h2>
            <span className="orion-badge">Chart data from API</span>
          </div>
          <SpendingTrendArea />
        </article>
      </section>

      <section className="dash-row">
        <article className="orion-card dash-recent">
          <div className="orion-card-header">
            <h2 className="orion-card-title">Recent Transactions</h2>
            <span className="orion-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
              Transaction data from API
            </span>
          </div>
          <ul className="dash-recent-list">
            {recentTransactions.map((t) => {
              const isIncome = t.type === "income";
              return (
                <li key={t.id} className="dash-recent-item">
                  <div>
                    <p className="dash-recent-cat">{t.category}</p>
                    <p className="dash-recent-date">{t.date}</p>
                  </div>
                  <span className={isIncome ? "dash-recent-amt dash-recent-amt--in" : "dash-recent-amt dash-recent-amt--out"}>
                    {isIncome ? `+$${t.amount.toLocaleString()}` : `-$${Math.abs(t.amount).toLocaleString()}`}
                  </span>
                </li>
              );
            })}
          </ul>
        </article>
      </section>
    </div>
  );
}
