// Tests for the Login page.
//
// Pattern demonstrated: page testing with mocked API and router.
// Mocks services/api to avoid real network calls. Wraps the page in
// MemoryRouter + SnackbarProvider so all hooks have what they need.

import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { SnackbarProvider } from "../components/Snackbar";
import Login from "./Login";

// mock the API module so no real HTTP calls happen during tests 
vi.mock("../services/api", () => ({
  apiAuth: {
    login: vi.fn(),
  },
  applySession: vi.fn(),
}));

// import the mocked module so we can control return values per test
import { apiAuth, applySession } from "../services/api";

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the login form with email and password fields", () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("calls apiAuth.login with the user's credentials on submit", async () => {
    apiAuth.login.mockResolvedValue({ token: "fake-token", userId: "user-123" });
    applySession.mockResolvedValue({});

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(apiAuth.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "secret123",
      });
    });
  });

  test("calls applySession with the token after a successful login", async () => {
    apiAuth.login.mockResolvedValue({ token: "fake-token", userId: "user-123" });
    applySession.mockResolvedValue({});

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(applySession).toHaveBeenCalledWith("fake-token");
    });
  });

  test("shows an error snackbar when login returns a 401", async () => {
    const error = new Error("Unauthorized");
    error.status = 401;
    apiAuth.login.mockRejectedValue(error);

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
    expect(applySession).not.toHaveBeenCalled();
  });

  test("disables the submit button while the request is in flight", async () => {
    // resolve later so we can observe the loading state
    let resolveLogin;
    apiAuth.login.mockReturnValue(new Promise((resolve) => { resolveLogin = resolve; }));

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByRole("button", { name: /logging in/i })).toBeDisabled();

    // clean up the pending promise so the test runner doesn't leak it
    resolveLogin({ token: "fake-token", userId: "user-123" });
  });
});