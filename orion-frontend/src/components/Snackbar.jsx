import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import "./Snackbar.css";

const SnackbarContext = createContext(null);

const DEFAULT_DURATIONS = {
  success: 4000,
  info: 4000,
  warning: 6000,
  error: 7000,
};

export function SnackbarProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const idRef = useRef(0);

  const removeSnackbar = useCallback((id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const showSnackbar = useCallback((message, severity = "info", duration) => {
    if (!message) return;

    idRef.current += 1;
    const id = idRef.current;
    const finalDuration = duration ?? DEFAULT_DURATIONS[severity] ?? 4000;

    setMessages((prev) => [...prev, { id, message, severity, duration: finalDuration }]);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <div className="orion-snackbar-stack" role="region" aria-label="Notifications">
        {messages.map((m) => (
          <SnackbarItem
            key={m.id}
            id={m.id}
            message={m.message}
            severity={m.severity}
            duration={m.duration}
            onClose={removeSnackbar}
          />
        ))}
      </div>
    </SnackbarContext.Provider>
  );
}

function SnackbarItem({ id, message, severity, duration, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icon = ICONS[severity] ?? ICONS.info;

  return (
    <div
      className={`orion-snackbar orion-snackbar--${severity}`}
      role={severity === "error" ? "alert" : "status"}
      aria-live={severity === "error" ? "assertive" : "polite"}
    >
      <span className="orion-snackbar__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="orion-snackbar__message">{message}</span>
      <button
        type="button"
        className="orion-snackbar__close"
        onClick={() => onClose(id)}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}

const ICONS = {
  success: "✓",
  error: "!",
  warning: "!",
  info: "i",
};

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return ctx;
}
