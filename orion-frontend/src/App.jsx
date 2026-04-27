import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SnackbarProvider } from "./components/Snackbar";
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
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function AppRoutes() {
  const { session, loading } = useAuth();

  return (
    <Routes>
      {/* Landing / auth */}
      <Route
        path="/"
        element={
          loading ? (
            <div>Loading...</div>
          ) : session ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/login"
        element={session ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/create-account" element={<CreateAccount />} />
      {/* Protected app shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/household" element={<Household />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ask-ai" element={<AskAI />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SnackbarProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </SnackbarProvider>
    </BrowserRouter>
  );
}
