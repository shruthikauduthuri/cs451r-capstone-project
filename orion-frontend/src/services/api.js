import { supabase } from "../supabaseClient"; 

const DEFAULT_API_BASE_URL = "http://localhost:5033";
const GEMINI_ENDPOINT = "/gemini-response";

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
}

async function parseJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const fallbackText = await response.text();
    throw new Error(fallbackText || "Unexpected response from the AI service.");
  }
  return response.json();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  console.log("TOKEN:", token); // DEBUG — remove before production

  if (!token) {
    throw new Error("No auth token found. User not logged in.");
  }

  const res = await fetch(`${getApiBaseUrl()}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return parseJsonResponse(res);
}

export async function sendGeminiMessage(message, options = {}) {
  const trimmedMessage = message.trim();
  if (!trimmedMessage) {
    throw new Error("Message is required.");
  }

  const response = await fetch(`${getApiBaseUrl()}${GEMINI_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    },
    body: JSON.stringify({ message: trimmedMessage }),
    signal: options.signal,
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload?.error || payload?.message || "Failed to get a response from the AI service."
    );
  }

  if (typeof payload.response !== "string" || !payload.response.trim()) {
    throw new Error("The AI service returned an empty response.");
  }

  return payload.response;
}