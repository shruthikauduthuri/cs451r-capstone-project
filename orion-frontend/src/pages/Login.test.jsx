import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SnackbarProvider } from "../components/Snackbar";
import Login from "./Login";

function renderLogin() {
  return render(
    <MemoryRouter>
      <SnackbarProvider>
        <Login />
      </SnackbarProvider>
    </MemoryRouter>
  );
}

describe("Login page", () => {
  test("renders the login form with email and password fields", () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });
});