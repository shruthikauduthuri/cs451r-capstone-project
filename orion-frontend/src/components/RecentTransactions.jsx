export default function RecentTransactions({ transactions, dataSource }) {
  const rows =
    transactions && transactions.length > 0
      ? transactions
      : [
          {
            id: 0,
            name: "Sample Transaction",
            category: "Demo",
            date: "Today",
            amount: "-$0.00",
            type: "debit",
            status: "Pending",
          },
        ];

  return (
    <div className="panel">
      <div className="widget-header">
        <div>
          <h2 className="widget-title">Recent Transactions</h2>
          <p className="widget-subtitle">Latest activity across your accounts</p>
        </div>
        <span className="widget-data-source">{dataSource}</span>
      </div>

      <div className="transactions-list">
        <div className="transactions-header">
          <span>Description</span>
          <span>Category</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
        </div>

        <ul className="transactions-rows">
          {rows.map((tx) => {
            const isCredit = tx.type === "credit";

            return (
              <li key={tx.id} className="transactions-row">
                <span className="transactions-name">{tx.name}</span>
                <span className="transactions-category">{tx.category}</span>
                <span className="transactions-date">{tx.date}</span>
                <span
                  className={
                    isCredit ? "transactions-amount transactions-amount--credit" : "transactions-amount transactions-amount--debit"
                  }
                >
                  {tx.amount}
                </span>
                <span className="transactions-status">{tx.status}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

