# Orion — Household Finance Manager

Orion is a full-stack web application that empowers households to manage their finances together and build financial literacy as a team.

## About

Orion brings everyone in a household onto the same page financially. Track shared expenses, set savings goals, manage budgets by category, and view spending trends, all in one place. Designed with clarity and collaboration in mind, Orion makes financial literacy accessible for everyone in the home.

## Frontend Tech Stack

| Technology | Purpose |
|---|---|
| React | UI component library |
| Vite | Build tool and dev server |
| JSX | Component templating |
| CSS Modules | Page-scoped styling |
| Recharts | Data visualization (charts) |
| React Router | Client-side routing |

## UI Design

The Orion frontend is designed in **Figma** and implemented in React. The UI includes:

- **Dashboard** — Overview of household finances with charts and summary cards
- **Transactions** — Log and browse income and expense entries
- **Categories** — Manage and visualize spending by category
- **Savings** — Set and track household savings goals
- **Household** — Manage household members and shared contributions
- **Settings** — User preferences and account configuration
- **Login** — Secure authentication flow

The design system uses a consistent Orion theme (`orion-theme.css`) with shared color variables, typography, and component styles across all pages.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

Clone the repository:
```bash
git clone https://github.com/shruthikauduthuri/cs451r-capstone-project.git
cd cs451r-capstone-project/orion-frontend
```

Install dependencies:
```bash
npm install
```

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```
