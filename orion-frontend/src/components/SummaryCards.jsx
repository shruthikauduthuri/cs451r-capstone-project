export default function SummaryCards({ cards, dataSource }) {
  const items = cards && cards.length > 0 ? cards : [
    {
      id: "placeholder-income",
      label: "Total Income",
      value: "$0",
      change: "0%",
      trend: "up",
      helperText: "Dummy data",
    },
  ];

  return (
    <div className="summary-cards">
      <div className="widget-header">
        <div>
          <h2 className="widget-title">Summary</h2>
          <p className="widget-subtitle">Key numbers for this period</p>
        </div>
        <span className="widget-data-source">{dataSource}</span>
      </div>

      <div className="summary-cards-grid">
        {items.map((card) => {
          const isUp = card.trend === "up";

          return (
            <article key={card.id} className="summary-card">
              <h3 className="summary-card-label">{card.label}</h3>
              <p className="summary-card-value">{card.value}</p>

              <div className="summary-card-footer">
                <span
                  className={
                    isUp ? "summary-card-change summary-card-change--up" : "summary-card-change summary-card-change--down"
                  }
                >
                  {card.change}
                </span>
                <span className="summary-card-helper">{card.helperText}</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

