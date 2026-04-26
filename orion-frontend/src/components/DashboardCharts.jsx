import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useOrionStore } from "../data/useOrionStore";

const CATEGORY_COLORS = {
  Groceries: "#22c55e",
  Rent: "#a855f7",
  Utilities: "#eab308",
  Vacation: "#3b82f6",
  Dining: "#f97316",
  Gas: "#64748b",
  Salary: "#14b8a6",
  Other: "#94a3b8",
};

function getColor(name, index) {
  if (CATEGORY_COLORS[name]) return CATEGORY_COLORS[name];
  const fallback = ["#6366f1", "#ec4899", "#8b5cf6", "#06b6d4", "#84cc16", "#f43f5e"];
  return fallback[index % fallback.length];
}

function renderPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.15;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
}

function renderDoughnutLabel({ cx, cy, midAngle, outerRadius, percent, name }) {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
}

export function SpendingByCategoryPie() {
  const { transactions } = useOrionStore();

  const expenses = transactions.filter((t) => t.type === "expense");
  const totalExpense = expenses.reduce((s, t) => s + Number(t.amount), 0);

  const categoryMap = {};
  expenses.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
  });

  const pieData = Object.entries(categoryMap).map(([name, value], i) => ({
    name,
    value: totalExpense > 0 ? Math.round((value / totalExpense) * 100) : 0,
    color: getColor(name, i),
  }));

  if (pieData.length === 0) {
    return (
      <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 14 }}>
        No expense data yet. Add transactions to see your spending breakdown.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={88}
            labelLine={{ stroke: "#94a3b8" }}
            label={renderPieLabel}
          >
            {pieData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} stroke="#fff" strokeWidth={1} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v, name) => [`${v}%`, name]}
            contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BudgetStatusDoughnut() {
  const { transactions } = useOrionStore();

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);

  if (totalIncome === 0 && totalExpense === 0) {
    return (
      <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 14 }}>
        No budget data yet. Add income and expenses to see your status.
      </div>
    );
  }

  const rawSpentPct = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 100;
  const spentPct = totalExpense > 0 ? Math.max(1, Math.ceil(rawSpentPct)) : 0;
  const remainPct = Math.max(0, 100 - spentPct);

  const doughnutData = [
    { name: "Spent", value: spentPct, color: "#ef4444" },
    { name: "Remaining", value: remainPct, color: "#14b8a6" },
  ];

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={doughnutData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={58}
            outerRadius={88}
            labelLine={{ stroke: "#94a3b8" }}
            label={renderDoughnutLabel}
          >
            {doughnutData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} stroke="#fff" strokeWidth={1} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v, name) => [`${v}%`, name]}
            contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SpendingTrendArea() {
  const { transactions } = useOrionStore();

  const expenses = transactions.filter((t) => t.type === "expense");

  const monthMap = {};
  expenses.forEach((t) => {
    const d = new Date(t.date + "T12:00:00");
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    if (!monthMap[key]) monthMap[key] = { key, month: label, amount: 0 };
    monthMap[key].amount += Number(t.amount);
  });

  const trendData = Object.values(monthMap).sort((a, b) => a.key.localeCompare(b.key));

  if (trendData.length === 0) {
    return (
      <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 14 }}>
        No spending data yet. Add expense transactions to see trends over time.
      </div>
    );
  }

  const maxAmount = Math.max(...trendData.map((d) => d.amount));
  const yMax = Math.ceil(maxAmount / 500) * 500 || 500;

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <AreaChart data={trendData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="orionAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={[0, yMax]}
          />
          <Tooltip
            formatter={(v) => [`$${Math.round(v).toLocaleString()}`, "Spending"]}
            contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="url(#orionAreaFill)"
            dot={false}
            activeDot={{ r: 5, fill: "#3b82f6" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}