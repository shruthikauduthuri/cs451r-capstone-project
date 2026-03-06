import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

const chartData = [
  { month: "Sep", spent: 1800 },
  { month: "Oct", spent: 2200 },
  { month: "Nov", spent: 1950 },
  { month: "Dec", spent: 2400 },
  { month: "Jan", spent: 2150 },
  { month: "Feb", spent: 2100 }
]

const recentTransactions = [
  { id: 1, date: "Mar 3", category: "Groceries", amount: -85, type: "expense", user: "Sarah" },
  { id: 2, date: "Mar 2", category: "Salary", amount: 3000, type: "income", user: "Alex" },
  { id: 3, date: "Mar 1", category: "Dining", amount: -42, type: "expense", user: "Jake" },
  { id: 4, date: "Feb 28", category: "Utilities", amount: -180, type: "expense", user: "Sarah" }
]

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-900 p-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400">Overview of your finances</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Total Budget</p>
            <DollarSign className="text-blue-500 w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold mt-2">$5,000</h2>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Total Spent</p>
            <TrendingDown className="text-red-500 w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold mt-2">$2,150</h2>
          <p className="text-xs text-gray-500">43% of budget</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Remaining</p>
            <TrendingUp className="text-green-500 w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold mt-2">$2,850</h2>
          <p className="text-xs text-gray-500">57% remaining</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Savings Goal</p>
            <PiggyBank className="text-purple-500 w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold mt-2">$650</h2>
          <p className="text-xs text-gray-500">of $2,000 goal</p>
        </div>

      </div>

      {/* CHART + TRANSACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CHART */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Spending Trend</h2>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="spent"
                stroke="#3b82f6"
                fill="#93c5fd"
              />
            </AreaChart>
          </ResponsiveContainer>

        </div>

        {/* TRANSACTIONS */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>

          <div className="space-y-4">

            {recentTransactions.map((t) => (
              <div
                key={t.id}
                className="flex justify-between border-b pb-3"
              >

                <div>
                  <p className="font-medium">{t.category}</p>
                  <p className="text-sm text-gray-500">
                    {t.date} • {t.user}
                  </p>
                </div>

                <p
                  className={`font-semibold ${
                    t.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}$
                  {Math.abs(t.amount)}
                </p>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard
