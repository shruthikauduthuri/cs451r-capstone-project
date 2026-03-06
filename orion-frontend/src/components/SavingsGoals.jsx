export default function SavingsGoals({ goals, dataSource }) {
  const items =
    goals && goals.length > 0
      ? goals
      : [
          {
            id: "demo-goal",
            name: "Demo Goal",
            targetAmount: 1000,
            currentAmount: 250,
            dueDate: "Soon",
          },
        ];

  return (
    <div className="panel">
      <div className="widget-header">
        <div>
          <h2 className="widget-title">Savings Goals</h2>
          <p className="widget-subtitle">Progress towards your targets</p>
        </div>
        <span className="widget-data-source">{dataSource}</span>
      </div>

      <ul className="goals-list">
        {items.map((goal) => {
          const progress = Math.min(
            100,
            Math.round((goal.currentAmount / goal.targetAmount) * 100)
          );

          return (
            <li key={goal.id} className="goals-item">
              <div className="goals-item-header">
                <div>
                  <h3 className="goals-name">{goal.name}</h3>
                  <p className="goals-meta">
                    Target {goal.targetAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })} · Due{" "}
                    {goal.dueDate}
                  </p>
                </div>
                <span className="goals-progress-badge">{progress}%</span>
              </div>

              <div className="goals-bar-track">
                <div
                  className="goals-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="goals-current">
                Saved{" "}
                {goal.currentAmount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}{" "}
                of{" "}
                {goal.targetAmount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

