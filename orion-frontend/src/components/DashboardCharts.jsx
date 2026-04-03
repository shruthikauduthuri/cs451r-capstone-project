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

const PIE_DATA = [
  { name: "Rent", value: 64, color: "#a855f7" },
  { name: "Vacation", value: 19, color: "#3b82f6" },
  { name: "Groceries", value: 9, color: "#22c55e" },
  { name: "Utilities", value: 8, color: "#eab308" },
];

const DOUGHNUT_DATA = [
  { name: "Spent", value: 47, color: "#ef4444" },
  { name: "Remaining", value: 53, color: "#14b8a6" },
];

const TREND_DATA = [
  { month: "Sep", amount: 980 },
  { month: "Oct", amount: 1200 },
  { month: "Nov", amount: 890 },
  { month: "Dec", amount: 1650 },
  { month: "Jan", amount: 1420 },
  { month: "Feb", amount: 1880 },
];

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
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={PIE_DATA}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={88}
            labelLine={{ stroke: "#94a3b8" }}
            label={renderPieLabel}
          >
            {PIE_DATA.map((entry) => (
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
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={DOUGHNUT_DATA}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={58}
            outerRadius={88}
            labelLine={{ stroke: "#94a3b8" }}
            label={renderDoughnutLabel}
          >
            {DOUGHNUT_DATA.map((entry) => (
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
  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <AreaChart data={TREND_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
            domain={[0, 2400]}
            ticks={[0, 600, 1200, 1800, 2400]}
          />
          <Tooltip
            formatter={(v) => [`$${v.toLocaleString()}`, "Spending"]}
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
