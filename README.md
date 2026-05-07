# Orion: Household Budget Management Platform
> A role-based collaborative budgeting platform for families, partners, and roommates to manage shared finances through a secure, personalized dashboard.

## Project Overview

Orion is a full-stack web application built as a capstone project for CS 451R. It allows household members to collaboratively track income, expenses, and shared budgets in real time. The platform supports role-based access control, meaning each user (e.g., admin, member) sees a tailored dashboard based on their household role.

**Core Features:**
- Role-based authentication and personalized dashboards
- Household creation and member management
- Shared expense and budget tracking
- AI-powered financial insights (via Google Gemini)
- Real-time data sync with Supabase

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Python / Flask |
| Database | Supabase (PostgreSQL) |
| AI Integration | Google Gemini API |
| Auth | Supabase Auth |

## Repository Structure

```
cs451r-capstone-project/
├── api/                          # Flask backend: REST API endpoints
├── orion-frontend/               # React frontend (Vite)
├── flask-ai/                     # Gemini AI integration service
├── .vscode/                      # Editor configuration
├── .editorconfig
├── diagram_architecture.png
├── diagram_flowchart.png
├── diagram_matrix.png
├── orion_project_documentation_v2.docx
└── Orion_Capstone_Presentation.pptx
```

## Prerequisites

Make sure you have the following installed before running the project:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.10 or higher)
- [pip](https://pip.pypa.io/)

## Database Setup (Supabase)

This project uses a hosted **Supabase** database. You do **not** need to set up a local database.

The database credentials and API keys have been shared separately in the "Comment" section of the assignment submission.

1. Create a `.env` file inside `/api`, `/orion-frontend`, and `/flask-ai`
2. Paste in the values provided using the formats below

> Do not commit `.env` files to GitHub. They are listed in `.gitignore`.

## Environment Variables

### `/api/.env`
```env
SUPABASE_URL=
SUPABASE_KEY=
GEMINI_API_KEY=
FLASK_ENV=development
```

### `/orion-frontend/.env`
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GEMINI_API_KEY=
```

### `/flask-ai/.env`
```env
GEMINI_API_KEY=
SUPABASE_ACCESS_TOKEN=
SUPABASE_PROJECT_REF=
```

## Running the Application Locally

### 1. Clone the Repository

```bash
git clone https://github.com/shruthikauduthuri/cs451r-capstone-project.git
cd cs451r-capstone-project
```

### 2. Start the Flask Backend

```bash
cd api
pip install -r requirements.txt
python app.py
```

The API will run at: `http://localhost:5033`

### 3. Start the Gemini AI Service

```bash
cd ../flask-ai
pip install -r requirements.txt
python app.py
```

The AI service will run at: `http://localhost:5050`

### 4. Start the React Frontend

```bash
cd ../orion-frontend
npm install
npm run dev
```

The frontend will run at: `http://localhost:5173`

> Open your browser and navigate to **http://localhost:5173** to use the application.

## Test Credentials

Create your own account, then confirm your email and begin exploring the application.

## Documentation

Full project documentation is available here: https://drive.google.com/drive/folders/1aQcibMrRIzhTmNG9ujtV6qeIyaOkW5cX?usp=share_link
