// src/data/store.js
// Simple in-memory store for Sprint 1 demo (replaces a real DB/API)

export const DEFAULT_CATEGORIES = [
    "Groceries",
    "Rent",
    "Utilities",
    "Vacation",
    "Vendors",
    "Dining",
    "Gas",
    "Other",
  ];
  
  export const DEFAULT_TRANSACTIONS = [
    {
      id: "t1",
      type: "income",
      amount: 3200,
      category: "Other",
      date: "2026-03-01",
      description: "Paycheck",
    },
    {
      id: "t2",
      type: "expense",
      amount: 120.45,
      category: "Groceries",
      date: "2026-03-02",
      description: "Costco",
    },
    {
      id: "t3",
      type: "expense",
      amount: 65,
      category: "Gas",
      date: "2026-03-03",
      description: "Shell",
    },
    {
      id: "t4",
      type: "expense",
      amount: 240,
      category: "Vendors",
      date: "2026-03-04",
      description: "Internet bill",
    },
  ];

  export const DEFAULT_GOALS = [
    {
      id: "g1",
      name: "Vacation Fund",
      targetAmount: 2000,
      currentAmount: 650,
      linkedCategory: "Vacation",
    },
  ];