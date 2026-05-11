import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE = process.env.EXPO_PUBLIC_BACKEND_URL || "";
const TOKEN_KEY = "gzen.token";

export async function setToken(token: string | null) {
  if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
  else await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (options.auth !== false) {
    const token = await getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}/api${path}`, { ...options, headers });
  let data: any = null;
  const text = await res.text();
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }
  if (!res.ok) {
    const msg =
      (data && (typeof data.detail === "string"
        ? data.detail
        : Array.isArray(data.detail)
        ? data.detail.map((e: any) => e?.msg || JSON.stringify(e)).join(" ")
        : null)) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

export const api = {
  // Auth
  signup: (body: { name: string; email: string; password: string }) =>
    request<{ access_token: string; user: any }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
      auth: false,
    }),
  login: (body: { email: string; password: string }) =>
    request<{ access_token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
      auth: false,
    }),
  me: () => request<any>("/auth/me", { method: "GET" }),
  logout: () => request<any>("/auth/logout", { method: "POST" }),

  // Profile
  getProfile: () => request<any>("/profile"),
  updateProfile: (body: any) =>
    request<any>("/profile", { method: "PUT", body: JSON.stringify(body) }),

  // Analytics
  daily: () => request<any>("/analytics/daily"),
  weekly: () => request<any>("/analytics/weekly"),
  submitUsage: (events: any[]) =>
    request<any>("/usage", { method: "POST", body: JSON.stringify(events) }),

  // Value-Gate
  detectRisk: (body: { app_id: string; intent?: string; time_of_day?: number }) =>
    request<any>("/value-gate/detect-risk", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  verifyTask: (body: { session_id: string; answer: string }) =>
    request<any>("/value-gate/verify-task", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  unlockSession: (body: { session_id: string; duration_minutes?: number }) =>
    request<any>("/value-gate/unlock-session", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // AI
  generateTask: (body: {
    intent?: string;
    goal?: string;
    time_of_day?: number;
    style?: string;
  }) =>
    request<any>("/ai/generate-task", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Rewards
  streak: () => request<any>("/rewards/streak"),
  points: () => request<any>("/rewards/points"),
};
