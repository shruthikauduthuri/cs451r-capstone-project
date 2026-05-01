import { useAuth } from "../context/AuthProvider";
import { useOrionStore } from "../data/useOrionStore";
import { SpendingByCategoryPie, BudgetStatusDoughnut, SpendingTrendArea } from "../components/DashboardCharts";
import { downloadTextReport } from "../utils/downloadReport";
import "./Dashboard.css";

function formatMoney(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { transactions = [] } = useOrionStore();

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const remaining = totalIncome - totalExpenses;
  const pctRemaining = totalIncome > 0 ? Math.round((remaining / totalIncome) * 100) : 0;

  const recentTransactions = transactions.slice(0, 5);

  function handleDownloadReport() {
    downloadTextReport(`orion-dashboard-${new Date().toISOString().slice(0, 10)}.txt`, [
      "Orion — Dashboard report",
      "",
      `Total Income: ${formatMoney(totalIncome)}`,
      `Total Expenses: ${formatMoney(totalExpenses)}`,
      `Remaining Balance: ${formatMoney(remaining)} (${pctRemaining}% remaining)`,
      "",
      "Recent transactions:",
      ...recentTransactions.map((t) => {
        const amt = t.type === "income" ? `+${formatMoney(t.amount)}` : `-${formatMoney(t.amount)}`;
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
          <p className="dash-summary-label">Total Income</p>
          <p className="dash-summary-value">{formatMoney(totalIncome)}</p>
        </article>
        <article className="orion-card dash-summary-card">
          <p className="dash-summary-label">Remaining Balance</p>
          <p className="dash-summary-value">{formatMoney(remaining)}</p>
          <p className="dash-summary-meta">{pctRemaining}% remaining</p>
        </article>
      </section>

      <section className="dash-row dash-row--2">
        <article className="orion-card">
          <div className="orion-card-header">
            <h2 className="orion-card-title">Spending by Category</h2>
          </div>
          <SpendingByCategoryPie />
        </article>
        <article className="orion-card">
          <div className="orion-card-header">
            <h2 className="orion-card-title">Budget Status</h2>
          </div>
          <BudgetStatusDoughnut />
        </article>
      </section>

      <section className="dash-row">
        <article className="orion-card">
          <div className="orion-card-header">
            <h2 className="orion-card-title">Spending Trend</h2>
          </div>
          <SpendingTrendArea />
        </article>
      </section>

      <section className="dash-row">
        <article className="orion-card dash-recent">
          <div className="orion-card-header">
            <h2 className="orion-card-title">Recent Transactions</h2>
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
                    {isIncome ? `+${formatMoney(t.amount)}` : `-${formatMoney(t.amount)}`}
                  </span>
                </li>
              );
            })}
            {recentTransactions.length === 0 && (
              <li className="dash-recent-item" style={{ justifyContent: "center", color: "#94a3b8" }}>
                No transactions yet. Add one on the Transactions page.
              </li>
            )}
          </ul>
        </article>
      </section>
    </div>
  );
}
