function formatMoney(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function openReportWindow(title, buildContent) {
  const win = window.open("", "_blank");
  if (!win) {
    alert("Please allow pop-ups to download reports.");
    return;
  }

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${title} — Orion</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    @page { 
      size: letter; 
      margin: 0.75in 0.85in; 
    }
    
    @media print {
      body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    }
    
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      color: #1e293b;
      font-size: 11pt;
      line-height: 1.5;
      background: #fff;
    }

    .print-bar {
      position: fixed;
      top: 0; left: 0; right: 0;
      background: #0f172a;
      color: #f8fafc;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 100;
      font-size: 13px;
    }

    .print-bar button {
      background: linear-gradient(135deg, #6366f1, #a855f7);
      color: #fff;
      border: none;
      padding: 8px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
    }

    .report {
      max-width: 8.5in;
      margin: 60px auto 40px;
      padding: 0 24px;
    }

    .header {
      border-bottom: 3px solid #6366f1;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }

    .header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-star {
      color: #6366f1;
      font-size: 22px;
    }

    .brand-name {
      font-size: 24px;
      font-weight: 700;
      color: #6366f1;
    }

    .date {
      font-size: 11px;
      color: #64748b;
    }

    .report-title {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 4px;
    }

    .report-subtitle {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
    }

    .section {
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 13px;
      font-weight: 700;
      color: #6366f1;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 10px;
      padding-bottom: 4px;
      border-bottom: 1px solid #e2e8f0;
    }

    .summary-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .summary-card {
      flex: 1;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 16px;
    }

    .summary-label {
      font-size: 10px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .summary-value {
      font-size: 22px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 2px;
    }

    .summary-meta {
      font-size: 10px;
      color: #94a3b8;
      margin-top: 2px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5pt;
    }

    thead th {
      background: #f1f5f9;
      color: #475569;
      font-weight: 600;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 8px 12px;
      text-align: left;
      border-bottom: 2px solid #e2e8f0;
    }

    tbody td {
      padding: 8px 12px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }

    tbody tr:nth-child(even) {
      background: #fafbfc;
    }

    .amount-in { color: #16a34a; font-weight: 600; }
    .amount-out { color: #dc2626; font-weight: 600; }

    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-expense { background: #fef2f2; color: #dc2626; }
    .badge-income { background: #f0fdf4; color: #16a34a; }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #6366f1, #a855f7);
      border-radius: 4px;
    }

    .footer {
      margin-top: 40px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      font-size: 10px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }

    .goal-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 12px;
    }

    .goal-name {
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
    }

    .goal-amounts {
      font-size: 12px;
      color: #64748b;
      margin: 4px 0 8px;
    }

    .goal-pct {
      font-size: 11px;
      font-weight: 600;
      color: #6366f1;
      margin-top: 4px;
    }

    .cat-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }

    .cat-chip {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 12px;
      font-weight: 600;
      color: #334155;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <span>★ Orion Report Preview</span>
    <div style="display:flex;gap:8px;">
      <button onclick="window.print()">Save as PDF / Print</button>
    </div>
  </div>
  <div class="report">
    <div class="header">
      <div class="header-top">
        <div class="brand">
          <span class="brand-star">★</span>
          <span class="brand-name">Orion</span>
        </div>
        <span class="date">Generated ${today}</span>
      </div>
      <h1 class="report-title">${title}</h1>
      <p class="report-subtitle">Household Finance Report</p>
    </div>
    ${buildContent()}
    <div class="footer">
      <span>Orion — Where your budget finds its direction.</span>
      <span>Generated ${today}</span>
    </div>
  </div>
</body>
</html>`);
  win.document.close();
}

// ─── Dashboard Report ───

export function downloadDashboardReport({ transactions }) {
  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const remaining = totalIncome - totalExpenses;
  const pctRemaining = totalIncome > 0 ? Math.round((remaining / totalIncome) * 100) : 0;

  const categoryMap = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
  });

  const recent = transactions.slice(0, 10);

  openReportWindow("Dashboard Overview", () => `
    <div class="section">
      <div class="section-title">Financial Summary</div>
      <div class="summary-row">
        <div class="summary-card">
          <p class="summary-label">Total Income</p>
          <p class="summary-value">${formatMoney(totalIncome)}</p>
        </div>
        <div class="summary-card">
          <p class="summary-label">Total Expenses</p>
          <p class="summary-value">${formatMoney(totalExpenses)}</p>
        </div>
        <div class="summary-card">
          <p class="summary-label">Remaining Balance</p>
          <p class="summary-value">${formatMoney(remaining)}</p>
          <p class="summary-meta">${pctRemaining}% of income remaining</p>
        </div>
      </div>
    </div>

    ${Object.keys(categoryMap).length > 0 ? `
    <div class="section">
      <div class="section-title">Spending by Category</div>
      <table>
        <thead><tr><th>Category</th><th>Amount</th><th>% of Total</th></tr></thead>
        <tbody>
          ${Object.entries(categoryMap).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => `
            <tr>
              <td>${cat}</td>
              <td class="amount-out">${formatMoney(amt)}</td>
              <td>${totalExpenses > 0 ? Math.round((amt / totalExpenses) * 100) : 0}%</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    ` : ""}

    ${recent.length > 0 ? `
    <div class="section">
      <div class="section-title">Recent Transactions</div>
      <table>
        <thead><tr><th>Date</th><th>Category</th><th>Type</th><th>Amount</th><th>Note</th></tr></thead>
        <tbody>
          ${recent.map(t => `
            <tr>
              <td>${t.date}</td>
              <td>${t.category}</td>
              <td><span class="badge ${t.type === "income" ? "badge-income" : "badge-expense"}">${t.type}</span></td>
              <td class="${t.type === "income" ? "amount-in" : "amount-out"}">${t.type === "income" ? "+" : "-"}${formatMoney(t.amount)}</td>
              <td>${t.description || "—"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    ` : `<div class="section"><p style="color:#94a3b8;">No transactions recorded yet.</p></div>`}
  `);
}

// ─── Transactions Report ───

export function downloadTransactionsReport({ transactions, selectedMonth, monthLabel }) {
  const filtered = transactions.filter(t => t.date?.startsWith(selectedMonth));
  const totalIncome = filtered.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpenses = filtered.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const net = totalIncome - totalExpenses;

  openReportWindow(`Transactions — ${monthLabel}`, () => `
    <div class="section">
      <div class="section-title">Monthly Summary</div>
      <div class="summary-row">
        <div class="summary-card">
          <p class="summary-label">Income</p>
          <p class="summary-value" style="color:#16a34a">${formatMoney(totalIncome)}</p>
        </div>
        <div class="summary-card">
          <p class="summary-label">Expenses</p>
          <p class="summary-value" style="color:#dc2626">${formatMoney(totalExpenses)}</p>
        </div>
        <div class="summary-card">
          <p class="summary-label">Net</p>
          <p class="summary-value" style="color:${net >= 0 ? "#16a34a" : "#dc2626"}">${formatMoney(net)}</p>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">All Transactions (${filtered.length})</div>
      ${filtered.length > 0 ? `
      <table>
        <thead><tr><th>Date</th><th>Category</th><th>Member</th><th>Type</th><th>Amount</th><th>Note</th></tr></thead>
        <tbody>
          ${filtered.map(t => `
            <tr>
              <td>${t.date}</td>
              <td>${t.category}</td>
              <td>${t.member || "—"}</td>
              <td><span class="badge ${t.type === "income" ? "badge-income" : "badge-expense"}">${t.type}</span></td>
              <td class="${t.type === "income" ? "amount-in" : "amount-out"}">${t.type === "income" ? "+" : "-"}${formatMoney(t.amount)}</td>
              <td>${t.description || "—"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      ` : `<p style="color:#94a3b8;">No transactions for this month.</p>`}
    </div>
  `);
}

// ─── Categories Report ───

export function downloadCategoriesReport({ categories, transactions }) {
  const categoryMap = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
  });
  const totalSpent = Object.values(categoryMap).reduce((s, v) => s + v, 0);

  openReportWindow("Budget Categories", () => `
    <div class="section">
      <div class="section-title">Active Categories (${categories.length})</div>
      <div class="cat-grid">
        ${categories.map(c => `<div class="cat-chip">${c}</div>`).join("")}
      </div>
    </div>

    ${totalSpent > 0 ? `
    <div class="section">
      <div class="section-title">Spending by Category</div>
      <table>
        <thead><tr><th>Category</th><th>Total Spent</th><th>% of Total</th><th>Breakdown</th></tr></thead>
        <tbody>
          ${categories.map(c => {
            const spent = categoryMap[c] || 0;
            const pct = totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0;
            return `
              <tr>
                <td style="font-weight:600">${c}</td>
                <td class="amount-out">${formatMoney(spent)}</td>
                <td>${pct}%</td>
                <td>
                  <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
    ` : ""}
  `);
}

// ─── Savings Goals Report ───

export function downloadSavingsReport({ goals }) {
  const totalTarget = goals.reduce((s, g) => s + Number(g.targetAmount), 0);
  const totalSaved = goals.reduce((s, g) => s + Number(g.currentAmount), 0);
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  openReportWindow("Savings Goals", () => `
    <div class="section">
      <div class="section-title">Overview</div>
      <div class="summary-row">
        <div class="summary-card">
          <p class="summary-label">Total Saved</p>
          <p class="summary-value" style="color:#16a34a">${formatMoney(totalSaved)}</p>
        </div>
        <div class="summary-card">
          <p class="summary-label">Total Target</p>
          <p class="summary-value">${formatMoney(totalTarget)}</p>
        </div>
        <div class="summary-card">
          <p class="summary-label">Overall Progress</p>
          <p class="summary-value" style="color:#6366f1">${overallPct}%</p>
          <div class="progress-bar" style="margin-top:6px"><div class="progress-fill" style="width:${overallPct}%"></div></div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Individual Goals (${goals.length})</div>
      ${goals.length > 0 ? goals.map(g => {
        const pct = Math.min(100, Math.round((Number(g.currentAmount) / Number(g.targetAmount)) * 100));
        const remaining = Math.max(0, Number(g.targetAmount) - Number(g.currentAmount));
        return `
          <div class="goal-card">
            <p class="goal-name">${g.name}</p>
            <p class="goal-amounts">${formatMoney(g.currentAmount)} of ${formatMoney(g.targetAmount)} — ${formatMoney(remaining)} remaining</p>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <p class="goal-pct">${pct}% complete${g.linkedCategory ? ` · Linked to ${g.linkedCategory}` : ""}</p>
          </div>
        `;
      }).join("") : `<p style="color:#94a3b8;">No savings goals created yet.</p>`}
    </div>
  `);
}

// Keep the old function for backward compatibility
export function downloadTextReport(filename, lines) {
  const text = lines.join("\n");
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}