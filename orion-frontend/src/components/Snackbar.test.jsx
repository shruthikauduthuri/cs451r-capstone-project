import { describe, test, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SnackbarProvider, useSnackbar } from "./Snackbar";

function TestConsumer({ message = "Hello world", severity = "success" }) {
  const { showSnackbar } = useSnackbar();
  return (
    <button type="button" onClick={() => showSnackbar(message, severity)}>
      Trigger
    </button>
  );
}

function renderWithProvider(ui) {
  return render(<SnackbarProvider>{ui}</SnackbarProvider>);
}

describe("Snackbar", () => {
  test("does not show a message until showSnackbar is called", () => {
    renderWithProvider(<TestConsumer />);
    expect(screen.queryByText("Hello world")).not.toBeInTheDocument();
  });

  test("shows the message when showSnackbar is called", async () => {
    const user = userEvent.setup();
    renderWithProvider(<TestConsumer />);

    await user.click(screen.getByRole("button", { name: /trigger/i }));

    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  test("shows different severities with different messages", async () => {
    const user = userEvent.setup();
    renderWithProvider(<TestConsumer message="Something failed" severity="error" />);

    await user.click(screen.getByRole("button", { name: /trigger/i }));

    expect(screen.getByText("Something failed")).toBeInTheDocument();
  });

  test("throws if useSnackbar is used outside the provider", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    function BadConsumer() {
      useSnackbar();
      return null;
    }

    expect(() => render(<BadConsumer />)).toThrow();

    errorSpy.mockRestore();
  });
});
