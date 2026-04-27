import { supabase } from "../supabaseClient";


const DEFAULT_DOTNET_BASE_URL = "http://localhost:5043";
const DEFAULT_FLASK_BASE_URL = "http://127.0.0.1:5000";
const GEMINI_ENDPOINT = "/gemini-response";

function getDotnetBaseUrl() {
	return import.meta.env.VITE_DOTNET_API_URL || DEFAULT_DOTNET_BASE_URL;
}

function getFlaskBaseUrl() {
	return import.meta.env.VITE_FLASK_API_BASE_URL || DEFAULT_FLASK_BASE_URL;
}


async function getAuthToken() {
	try {
		const { data } = await supabase.auth.getSession();
		return data?.session?.access_token ?? null;
	} catch {
		return null;
	}
}


async function parseResponseBody(response) {
	const text = await response.text();
	if (!text) return null;

	const contentType = response.headers.get("content-type") || "";
	if (contentType.includes("application/json")) {
		try {
			return JSON.parse(text);
		} catch {
			return text;
		}
	}
	return text;
}


async function dotnetRequest(path, { method = "GET", body, signal, headers } = {}) {
	const token = await getAuthToken();

	const finalHeaders = {
		Accept: "application/json",
		...(body !== undefined ? { "Content-Type": "application/json" } : {}),
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...(headers || {}),
	};

	const url = `${getDotnetBaseUrl()}${path}`;

	let response;
	try {
		response = await fetch(url, {
			method,
			headers: finalHeaders,
			body: body !== undefined ? JSON.stringify(body) : undefined,
			signal,
		});
	} catch (networkError) {
		throw new Error(
			`Could not reach the Orion API at ${url}. Is the .NET API running?`
		);
	}

	const payload = await parseResponseBody(response);

	if (!response.ok) {
		const message =
			(payload && typeof payload === "object" && (payload.message || payload.error || payload.title)) ||
			(typeof payload === "string" && payload) ||
			`Request failed with status ${response.status}`;
		const err = new Error(message);
		err.status = response.status;
		err.payload = payload;
		throw err;
	}

	return payload;
}

export const apiAuth = {
	/**
	 * Register a new account.
	 * @param {{ email: string, password: string }} payload
	 * @returns {Promise<{ token: string|null, userId: string|null }>}
	 */
	async register({ email, password }) {
		const data = await dotnetRequest("/api/auth/register", {
			method: "POST",
			body: { Email: email, Password: password },
		});
		return normalizeAuthResponse(data);
	},

	/**
	 * Log in.
	 * @param {{ email: string, password: string }} payload
	 * @returns {Promise<{ token: string|null, userId: string|null }>}
	 */
	async login({ email, password }) {
		const data = await dotnetRequest("/api/auth/login", {
			method: "POST",
			body: { Email: email, Password: password },
		});
		return normalizeAuthResponse(data);
	},

	async logout() {
		return dotnetRequest("/api/auth/logout", { method: "POST" });
	},

	async resetPassword({ email }) {
		return dotnetRequest("/api/auth/reset-password", {
			method: "POST",
			body: { Email: email },
		});
	},

	async session() {
		return dotnetRequest("/api/auth/session");
	},
};


function normalizeAuthResponse(data) {
	if (!data || typeof data !== "object") return { token: null, userId: null };
	return {
		token: data.Token ?? data.token ?? null,
		userId: data.UserId ?? data.userId ?? null,
	};
}

/**
 * Push an access token from the .NET API into the Supabase JS client so
 * AuthContext + any RLS-aware Supabase queries recognize the user as
 * logged in. We don't have a refresh token from the .NET API, so we pass the
 * access token for both — Supabase will refresh on the next auth check.
 *
 * @param {string} accessToken
 * @returns {Promise<object|null>}
 */
export async function applySession(accessToken) {
	if (!accessToken) return null;
	const { data, error } = await supabase.auth.setSession({
		access_token: accessToken,
		refresh_token: accessToken,
	});
	if (error) {
		console.warn("applySession: Supabase rejected token:", error.message);
		return null;
	}
	return data?.session ?? null;
}

export const apiProfile = {
	getMe() {
		return dotnetRequest("/api/profile/me");
	},

	/**
	 * PUT /api/profile/me — update display name, email, household name, role.
	 * @param {{ displayName?: string, email?: string,
	 *           householdName?: string, role?: string }} payload
	 */
	updateMe(payload) {
		return dotnetRequest("/api/profile/me", {
			method: "PUT",
			body: {
				DisplayName: payload.displayName ?? "",
				Email: payload.email ?? "",
				HouseholdName: payload.householdName ?? "",
				Role: payload.role ?? "",
				Updated_at: new Date().toISOString(),
			},
		});
	},

	transition() {
		return dotnetRequest("/api/profile/transition", { method: "POST" });
	},
};


export const apiHouseholds = {
	create() {
		return dotnetRequest("/api/households", { method: "POST" });
	},

	join(joinCode) {
		return dotnetRequest("/api/households/join", {
			method: "POST",
			body: { JoinCode: joinCode },
		});
	},

	members(householdId) {
		return dotnetRequest(`/api/households/${householdId}/members`);
	},

	update(householdId, { joinCode } = {}) {
		return dotnetRequest(`/api/households/${householdId}`, {
			method: "PUT",
			body: { JoinCode: joinCode ?? null },
		});
	},

	addMember(householdId, userId) {
		return dotnetRequest(`/api/households/${householdId}/members/${userId}`, {
			method: "PUT",
		});
	},

	removeMember(householdId, userId) {
		return dotnetRequest(`/api/households/${householdId}/members/${userId}`, {
			method: "DELETE",
		});
	},
};


export const apiAccounts = {
	list() {
		return dotnetRequest("/api/accounts");
	},
	get(id) {
		return dotnetRequest(`/api/accounts/${id}`);
	},
	/**
	 * @param {{ name: string, type: string, balance: number }} account
	 */
	create(account) {
		return dotnetRequest("/api/accounts", {
			method: "POST",
			body: {
				Name: account.name,
				Type: account.type,
				Balance: Number(account.balance) || 0,
			},
		});
	},
	/**
	 * @param {{ name: string, type: string, balance: number }} account
	 */
	update(id, account) {
		return dotnetRequest(`/api/accounts/${id}`, {
			method: "PUT",
			body: {
				Name: account.name,
				Type: account.type,
				Balance: Number(account.balance) || 0,
				Updated_at: new Date().toISOString(),
			},
		});
	},
	remove(id) {
		return dotnetRequest(`/api/accounts/${id}`, { method: "DELETE" });
	},
	transition() {
		return dotnetRequest("/api/accounts/transition", { method: "POST" });
	},
};


export const apiTransactions = {
	list() {
		return dotnetRequest("/api/transactions");
	},
	get(id) {
		return dotnetRequest(`/api/transactions/${id}`);
	},

	create(transaction) {
		return dotnetRequest("/api/transactions", {
			method: "POST",
			body: transaction,
		});
	},
	update(id, transaction) {
		return dotnetRequest(`/api/transactions/${id}`, {
			method: "PUT",
			body: transaction,
		});
	},
	remove(id) {
		return dotnetRequest(`/api/transactions/${id}`, { method: "DELETE" });
	},
};


export const apiGoals = {
	list() {
		return dotnetRequest("/api/goals");
	},
	get(id) {
		return dotnetRequest(`/api/goals/${id}`);
	},
	/**
	 * The endpoint takes the raw Goal model.
	 * @param {{ user_id: string, name: string, target_amount: number,
	 *           current_amount?: number, deadline: string }} goal
	 */
	create(goal) {
		return dotnetRequest("/api/goals", { method: "POST", body: goal });
	},
	update(id, goal) {
		return dotnetRequest(`/api/goals/${id}`, { method: "PUT", body: goal });
	},
	remove(id) {
		return dotnetRequest(`/api/goals/${id}`, { method: "DELETE" });
	},
};


export const apiBudgets = {
	list() {
		return dotnetRequest("/api/budgets");
	},
	get(id) {
		return dotnetRequest(`/api/budgets/${id}`);
	},
	/**
	 * @param {{ user_id: string, category_id: string, amount_limit: number,
	 *           month: number, year: number }} budget
	 */
	create(budget) {
		return dotnetRequest("/api/budgets", { method: "POST", body: budget });
	},
	update(id, budget) {
		return dotnetRequest(`/api/budgets/${id}`, { method: "PUT", body: budget });
	},
	remove(id) {
		return dotnetRequest(`/api/budgets/${id}`, { method: "DELETE" });
	},
};


export const apiSharedExpenses = {
	list() {
		return dotnetRequest("/api/shared-expenses");
	},
	create(expense) {
		return dotnetRequest("/api/shared-expenses", {
			method: "POST",
			body: expense,
		});
	},
	update(id, expense) {
		return dotnetRequest(`/api/shared-expenses/${id}`, {
			method: "PUT",
			body: expense,
		});
	},
};


export const apiCategories = {
	list() {
		return dotnetRequest("/api/categories");
	},
	get(id) {
		return dotnetRequest(`/api/categories/${id}`);
	},
	/**
	 * @param {{ name: string, type?: string, is_default?: boolean }} category
	 */
	create(category) {
		return dotnetRequest("/api/categories", {
			method: "POST",
			body: {
				Name: category.name,
				Type: category.type ?? "expense",
				IsDefault: category.is_default ?? false,
			},
		});
	},
	update(id, category) {
		return dotnetRequest(`/api/categories/${id}`, {
			method: "PUT",
			body: {
				Name: category.name,
				Type: category.type ?? "expense",
				IsDefault: category.is_default ?? false,
			},
		});
	},
	remove(id) {
		return dotnetRequest(`/api/categories/${id}`, { method: "DELETE" });
	},
};


export const apiPrivacy = {
	list() {
		return dotnetRequest("/api/privacy");
	},
	get(id) {
		return dotnetRequest(`/api/privacy/${id}`);
	},
	/**
	 * @param {{ rule_type: string, value: string }} rule
	 */
	create(rule) {
		return dotnetRequest("/api/privacy", {
			method: "POST",
			body: { RuleType: rule.rule_type, Value: rule.value },
		});
	},
	update(id, rule) {
		return dotnetRequest(`/api/privacy/${id}`, {
			method: "PUT",
			body: { RuleType: rule.rule_type, Value: rule.value },
		});
	},
	remove(id) {
		return dotnetRequest(`/api/privacy/${id}`, { method: "DELETE" });
	},
};


async function parseFlaskJsonResponse(response) {
	const contentType = response.headers.get("content-type") || "";

	if (!contentType.includes("application/json")) {
		const fallbackText = await response.text();
		throw new Error(fallbackText || "Unexpected response from the AI service.");
	}

	return response.json();
}

export async function sendGeminiMessage(message, options = {}) {
	const trimmedMessage = message.trim();

	if (!trimmedMessage) {
		throw new Error("Message is required.");
	}

	const response = await fetch(`${getFlaskBaseUrl()}${GEMINI_ENDPOINT}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			...(options.headers || {}),
		},
		body: JSON.stringify({ message: trimmedMessage }),
		signal: options.signal,
	});

	const payload = await parseFlaskJsonResponse(response);

	if (!response.ok || !payload?.success) {
		throw new Error(payload?.error || payload?.message || "Failed to get a response from the AI service.");
	}

	if (typeof payload.response !== "string" || !payload.response.trim()) {
		throw new Error("The AI service returned an empty response.");
	}

	return payload.response;
}