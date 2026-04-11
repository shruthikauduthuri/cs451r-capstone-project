import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Savings from "./pages/Savings";
import Household from "./pages/Household";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import CreateAccount from "./pages/CreateAccount";
import AskAI from "./pages/AskAI";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing / auth */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-account" element={<CreateAccount />} />

        {/* App shell with sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/household" element={<Household />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ask-ai" element={<AskAI />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
