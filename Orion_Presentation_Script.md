# Orion — Capstone Project Demo
## Presentation Script & Speaker Outline
**CS451R Software Engineering Capstone | April 3, 2026**
**Team: Ayan Agayeva, Berenice Moreno-Perez, Montana Nicholson, Shruthika Uduthuri**

---

## Running Order

| # | Section | Speaker | Est. Time |
|---|---------|---------|-----------|
| 1 | Introduction & Team Overview | Ayan | 1–2 min |
| 2 | Interface Demo | Ayan | 3–4 min |
| 3 | Figma & Design Documentation | Ayan | 2 min |
| 4 | Database Architecture | Berenice | 3–4 min |
| 5 | API Integration | Montana | 3–4 min |
| 6 | LLM Stretch Goal | Shruthika | 3–4 min |
| 7 | Jira & Confluence Organization | Ayan | 2 min |
| 8 | Obstacles & Learning Achievements | All (round-robin) | 3 min |
| 9 | What We're Continuing to Work On | All (round-robin) | 2 min |
| 10 | Closing & Q&A | Ayan | 1 min |

**Total estimated time: ~25–28 minutes**

---

## Section 1 — Introduction & Team Overview
**Speaker: Ayan**

- Welcome the audience and introduce the project: *"Our project is Orion — a role-based household budgeting platform for families, partners, and roommates to manage finances collaboratively."*
- Briefly introduce each team member by name and role (gesture to each person):
  - Ayan Agayeva — Front-End Developer & Project Manager
  - Berenice Moreno-Perez — Database Architect
  - Montana Nicholson — Backend Developer (API Focus)
  - Shruthika Uduthuri — Backend Developer (LLM Focus)
- Give a one-sentence preview of what the demo will cover: *"Today we'll walk you through our live prototype, the technical decisions behind it, our stretch goal, and where we're headed next."*

---

## Section 2 — Interface Demo (Live)
**Speaker: Ayan**

> Open the running React app before this section begins.

**Points to cover:**
- Briefly explain the tech stack driving the UI: React 18 + Vite, React Router for navigation, custom `useOrionStore` hook for state.
- Walk through each page in order, narrating what the user would do:

  1. **Dashboard** — Show the financial overview cards (total income, expenses, net savings, budget utilization). Point out the spending-by-category breakdown and recent transactions list.
  2. **Transactions** — Add a sample transaction live (e.g., "Groceries, $80, expense"). Show how it immediately appears in the list and updates the Dashboard.
  3. **Categories** — Create a custom category. Then delete one and show how its transactions auto-reassign to "Other."
  4. **Savings Goals** — Create a goal (e.g., "Emergency Fund, $1,000"), then make a contribution and show the progress bar update.
  5. **Household** — Show the household creation flow: generate a join code, demonstrate the role assignment options (Admin, Partner, Roommate, Child).

- Close by noting: *"All of this persists across page refresh via localStorage — a deliberate architectural choice to mirror what a real API call would look like, making backend integration a drop-in replacement."*

---

## Section 3 — Figma & Design Documentation
**Speaker: Ayan**

> Switch to Figma in browser.

**Points to cover:**
- Show the Figma workspace. Briefly orient the audience: *"These are the design mockups we built before and alongside the prototype."*
- Highlight the screens that are not yet implemented (authentication, analytics charts, mobile layout) — explain that Figma is the source of truth for those features as we move into the next sprint.
- Point out any component library or design system decisions visible in Figma (color choices, spacing, component reuse).
- Note: *"Figma keeps design and development aligned — when the feature gets built, there's no ambiguity about what it should look like."*

---

## Section 4 — Database Architecture
**Speaker: Berenice**

> Share screen showing ER diagram or schema documentation.

**Points to cover:**
- Describe the role you're designing for: *"My job is to make sure the data layer can support everything the app does and scales as we add real users."*
- Walk through the core entities and their relationships:
  - **Users** — stores auth info and role assignment
  - **Households** — links multiple users; stores join codes
  - **Transactions** — belongs to a user and household; has type, amount, category, date, description
  - **Categories** — household-scoped; default set + custom
  - **SavingsGoals** — belongs to household; tracks target and current amounts
- Explain key design decisions:
  - Why categories are household-scoped (shared visibility, personal accountability)
  - How soft deletes or reassignment logic is handled at the database level
  - Indexing strategy for transaction queries (filtering by date, category, household)
- Current state: *"Right now the schema lives in our design docs. In Sprint 2 we'll stand up a PostgreSQL instance and connect it through Montana's API layer."*

---

## Section 5 — API Integration
**Speaker: Montana**

> Share screen showing `src/services/api.js` or API spec doc.

**Points to cover:**
- Explain the abstraction strategy: *"I architected the API layer so the frontend never calls the store directly — every data action goes through `services/api.js`. Right now it hits localStorage, but the interface is identical to what a real REST API would expect."*
- Walk through a representative set of endpoints and what they do:
  - `GET /api/transactions` → fetch all transactions for the household
  - `POST /api/transactions` → add a new transaction
  - `DELETE /api/transactions/:id` → remove a transaction
  - `POST /api/households` → create a household
  - `POST /api/households/join` → join via code
  - `PATCH /api/goals/:id` → contribute to a savings goal
- Explain what the swap-out will look like: *"When we connect a real backend, we update the bodies of these functions only — zero changes to any component."*
- Mention any backend framework being evaluated for Sprint 2 (e.g., Express.js, FastAPI).
- Note authentication considerations: how JWT tokens will slot into the existing request structure.

---

## Section 6 — LLM Stretch Goal & Progress
**Speaker: Shruthika**

> Share screen showing any prototype, notebook, or design doc for the LLM feature.

**Points to cover:**
- Introduce the stretch goal: *"Our LLM stretch goal is to integrate an AI layer that gives households personalized budget recommendations based on their actual spending data."*
- Describe the intended user-facing feature:
  - A user asks something like *"How can I save more this month?"* or *"Where am I overspending?"*
  - The LLM receives sanitized transaction data as context and responds with actionable suggestions.
- Describe current progress:
  - Research and evaluation of LLM providers (e.g., OpenAI API, Anthropic Claude, local models)
  - Prompt design: how transaction data will be structured and passed as context
  - Any prototype or proof-of-concept work completed so far
- Discuss technical considerations:
  - Privacy: transaction data must be anonymized before being sent to an external API
  - Rate limiting and cost management
  - How the LLM response will be surfaced in the UI (chat panel, insight card, etc.)
- Be honest about where things stand: *"This is a stretch goal, so it's not in the live prototype yet, but here's exactly what we've been building toward…"*

---

## Section 7 — Jira & Confluence Organization
**Speaker: Ayan**

> Share screen showing Jira board and Confluence space.

**Points to cover:**
- **Jira board:**
  - Show the current sprint board — columns (Backlog, In Progress, In Review, Done)
  - Point out how user stories are written (with role, action, benefit)
  - Show the ticket structure: acceptance criteria, story points, assignee
  - Note velocity or burndown if available
- **Confluence:**
  - Show the space structure: Requirements, Design Docs, Sprint Notes, Meeting Minutes
  - Highlight the pages most relevant to the demo: Architecture doc, API spec, user stories
  - Explain how the team uses it: *"Every design decision gets documented here so nothing lives only in someone's head."*
- Key message: *"Our project management practices are designed to make onboarding new contributors easy and keep everyone on the same page across a distributed team."*

---

## Section 8 — Obstacles & Learning Achievements
**Speaker: All (round-robin, ~30–45 seconds each)**

> Each person briefly speaks to one obstacle and one thing they learned.

**Suggested talking points:**

- **Ayan:** Managing the gap between prototype fidelity and real-world expectations — learning how to scope Sprint 1 tightly enough to ship something functional while keeping the architecture extensible.

- **Berenice:** Designing a schema that works for the current localStorage-based prototype *and* the future PostgreSQL backend — learning to think in migrations, not just initial design.

- **Montana:** Building an API abstraction layer that doesn't feel like over-engineering for a prototype — learning that the extra investment pays off when the real backend arrives.

- **Shruthika:** Finding the right balance of context to give the LLM (too much token cost, too little produces generic advice) — learning about prompt engineering and responsible data handling for AI features.

---

## Section 9 — What We're Continuing to Work On
**Speaker: All (round-robin)**

**Each person names their Sprint 2 priority:**

- **Ayan:** Connecting the UI to the live API endpoints, refining the component library, and implementing the authentication screens currently in Figma.

- **Berenice:** Standing up the PostgreSQL database, running the first migration, and testing the schema under realistic household data loads.

- **Montana:** Wiring up the Express/FastAPI backend to replace `services/api.js`, implementing JWT auth, and writing integration tests for each endpoint.

- **Shruthika:** Building the first working LLM integration prototype — connecting transaction data to the model API and surfacing a basic insight card in the UI.

---

## Section 10 — Closing & Q&A
**Speaker: Ayan**

- *"That covers everything we've built so far and where we're headed. Orion started as a design on paper and it's already a working product — we're excited to keep building."*
- Thank the audience.
- Open the floor: *"We're happy to take any questions."*
- During Q&A: direct technical questions to the appropriate teammate based on the topic.

---

## Presentation Tips

- **Transitions:** Each speaker should briefly introduce the next — e.g., *"I'll hand it off to Berenice now to walk through the database design."* This keeps the flow natural.
- **Live demo risk:** Have a backup video recording of the working prototype in case of technical issues.
- **Timing:** Keep each section tight. If a demo is running long, skip to the next feature rather than rushing through Q&A.
- **Q&A:** If a question is unclear, it's fine to say *"Can you clarify what you mean?"* before answering.
