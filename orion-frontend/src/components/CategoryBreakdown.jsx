export default function CategoryBreakdown({ categories, dataSource }) {
  const items =
    categories && categories.length > 0
      ? categories
      : [
          { id: "demo", name: "Demo Category", amount: 0, percentage: 0 },
        ];

  const maxPercentage = Math.max(...items.map((c) => c.percentage || 0), 1);

  return (
    <div className="panel">
      <div className="widget-header">
        <div>
          <h2 className="widget-title">Spending by Category</h2>
          <p className="widget-subtitle">Where your money is going</p>
        </div>
        <span className="widget-data-source">{dataSource}</span>
      </div>

      <ul className="category-list">
        {items.map((cat) => {
          const barWidth = `${(cat.percentage / maxPercentage) * 100}%`;

          return (
            <li key={cat.id} className="category-item">
              <div className="category-item-header">
                <span className="category-name">{cat.name}</span>
                <span className="category-amount">${cat.amount.toLocaleString()}</span>
              </div>
              <div className="category-bar-track">
                <div className="category-bar-fill" style={{ width: barWidth }} />
              </div>
              <span className="category-percentage">{cat.percentage}% of spending</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

