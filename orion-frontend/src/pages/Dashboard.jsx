import SummaryCards from "../components/SummaryCards";
import RecentTransactions from "../components/RecentTransactions";
import CategoryBreakdown from "../components/CategoryBreakdown";
import SavingsGoals from "../components/SavingsGoals";
import "./Dashboard.css";

const summaryData = [
  {
    id: "income",
    label: "Total Income",
    value: "$8,450",
    change: "+12.3%",
    trend: "up",
    helperText: "vs last month",
  },
  {
    id: "expenses",
    label: "Total Expenses",
    value: "$5,320",
    change: "+4.8%",
    trend: "down",
    helperText: "vs last month",
  },
  {
    id: "net-savings",
    label: "Net Savings",
    value: "$3,130",
    change: "+18.4%",
    trend: "up",
    helperText: "of monthly income",
  },
  {
    id: "budget-utilization",
    label: "Budget Utilization",
    value: "72%",
    change: "-5.1%",
    trend: "up",
    helperText: "of planned budget",
  },
];

const recentTransactions = [
  {
    id: 1,
    name: "Grocery Store",
    category: "Groceries",
    date: "Mar 2",
    amount: "-$76.20",
    type: "debit",
    status: "Cleared",
  },
  {
    id: 2,
    name: "Paycheck",
    category: "Income",
    date: "Mar 1",
    amount: "+$2,400.00",
    type: "credit",
    status: "Posted",
  },
  {
    id: 3,
    name: "Electric Utility",
    category: "Utilities",
    date: "Feb 28",
    amount: "-$120.50",
    type: "debit",
    status: "Scheduled",
  },
  {
    id: 4,
    name: "Coffee Shop",
    category: "Dining Out",
    date: "Feb 27",
    amount: "-$9.75",
    type: "debit",
    status: "Cleared",
  },
  {
    id: 5,
    name: "Streaming Service",
    category: "Subscriptions",
    date: "Feb 25",
    amount: "-$15.99",
    type: "debit",
    status: "Cleared",
  },
];

const categoryData = [
  { id: "housing", name: "Housing", amount: 1450, percentage: 32 },
  { id: "groceries", name: "Groceries", amount: 520, percentage: 12 },
  { id: "transportation", name: "Transportation", amount: 310, percentage: 7 },
  { id: "dining", name: "Dining Out", amount: 260, percentage: 6 },
  { id: "entertainment", name: "Entertainment", amount: 180, percentage: 4 },
  { id: "other", name: "Other", amount: 890, percentage: 20 },
];

const savingsGoals = [
  {
    id: "emergency-fund",
    name: "Emergency Fund",
    targetAmount: 5000,
    currentAmount: 3250,
    dueDate: "Dec 2026",
  },
  {
    id: "vacation",
    name: "Summer Vacation",
    targetAmount: 2500,
    currentAmount: 1200,
    dueDate: "Aug 2025",
  },
  {
    id: "car",
    name: "Car Down Payment",
    targetAmount: 8000,
    currentAmount: 4600,
    dueDate: "Mar 2027",
  },
];

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Overview</h1>
          <p className="dashboard-subtitle">
            A quick snapshot of your household finances.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <button className="dashboard-range-button">Last 30 days</button>
          <button className="dashboard-secondary-button">Download report</button>
        </div>
      </header>

      <section className="dashboard-section">
        <SummaryCards
          cards={summaryData}
          dataSource="Data Source: GET /api/dashboard"
        />
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-grid-item">
          <CategoryBreakdown
            categories={categoryData}
            dataSource="Data Source: GET /api/categories"
          />
        </div>

        <div className="dashboard-grid-item">
          <RecentTransactions
            transactions={recentTransactions}
            dataSource="Data Source: GET /api/transactions"
          />
        </div>
      </section>

      <section className="dashboard-section">
        <SavingsGoals
          goals={savingsGoals}
          dataSource="Data Source: GET /api/dashboard"
        />
      </section>
    </div>
  );
}