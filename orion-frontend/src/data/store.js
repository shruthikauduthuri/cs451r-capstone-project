export const DEFAULT_CATEGORIES = [
  "Groceries",
  "Rent",
  "Utilities",
  "Vacation",
  "Vendors",
  "Dining",
  "Gas",
  "Salary",
  "Other",
];

export const DEFAULT_TRANSACTIONS = [
  {
    id: "t1",
    type: "income",
    amount: 3000,
    category: "Salary",
    date: "2026-04-01",
    description: "Salary",
    member: "Alex",
  },
  {
    id: "t2",
    type: "expense",
    amount: 145,
    category: "Groceries",
    date: "2026-04-02",
    description: "Groceries",
    member: "Sarah",
  },
  {
    id: "t3",
    type: "expense",
    amount: 68,
    category: "Dining",
    date: "2026-04-03",
    description: "Dining",
    member: "Jake",
  },
];

export const DEFAULT_GOALS = [
  {
    id: "g1",
    name: "Vacation Fund",
    targetAmount: 2000,
    currentAmount: 650,
    linkedCategory: "Vacation",
    description: "Summer trip to Europe",
    contributors: ["Sarah", "Alex", "Jake"],
  },
];
