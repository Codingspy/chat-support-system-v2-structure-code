export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return (window as any).NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
}

// Demo mode for testing without authentication
const DEMO_MODE = true; // Set to false when you want to use real auth

export async function apiFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined)
  };
  
  // In demo mode, use a demo token or skip auth
  if (DEMO_MODE) {
    headers.Authorization = `Bearer demo-token`;
  } else if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fullUrl = `${baseUrl}${path}`;
  console.log(`API Call: ${fullUrl}`, { headers, body: init.body });

  try {
    // Add timeout and better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const res = await fetch(fullUrl, { 
      ...init, 
      headers,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    console.log(`API Response: ${res.status} ${res.statusText}`);
    
    if (!res.ok) {
      let details: any = undefined;
      try { details = await res.json(); } catch {}
      console.error(`API Error: ${res.status}`, details);
      throw new Error(details?.message || `Request failed: ${res.status}`);
    }
    
    // Some endpoints return no content
    const text = await res.text();
    const result = text ? JSON.parse(text) : undefined;
    console.log(`API Success:`, result);
    return result as T;
  } catch (error: any) {
    console.error(`API Fetch Error for ${fullUrl}:`, error);
    
    // Provide more specific error messages
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server not responding');
    } else if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server - please check if backend is running on localhost:4000');
    }
    
    throw error;
  }
}

export const authApi = {
  async register(payload: { email: string; name: string; password: string; role?: "user" | "agent" | "admin" }) {
    const data = await apiFetch<{ user: any; accessToken: string; refreshToken: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    }
    return data.user;
  },
  async login(payload: { email: string; password: string }) {
    const data = await apiFetch<{ user: any; accessToken: string; refreshToken: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    }
    return data.user;
  },
  async refresh() {
    if (typeof window === "undefined") return null;
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;
    const data = await apiFetch<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken })
    });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;
  }
};

export const ticketsApi = {
  list: () => apiFetch("/tickets"),
  create: (p: { subject: string; priority?: "low" | "medium" | "high"; tags?: string[]; initialMessage?: string }) =>
    apiFetch("/tickets", { method: "POST", body: JSON.stringify(p) }),
  get: (ticketId: string) => apiFetch(`/tickets/${ticketId}`),
  update: (ticketId: string, p: any) => apiFetch(`/tickets/${ticketId}`, { method: "PATCH", body: JSON.stringify(p) }),
  remove: (ticketId: string) => apiFetch(`/tickets/${ticketId}`, { method: "DELETE" })
};

export const messagesApi = {
  list: (ticketId: string) => apiFetch<any[]>(`/messages/${ticketId}`),
  send: (ticketId: string, content: string) => apiFetch(`/messages/${ticketId}`, { method: "POST", body: JSON.stringify({ content }) }),
  setStatus: (messageId: string, status: "delivered" | "read") =>
    apiFetch(`/messages/status/${messageId}`, { method: "PATCH", body: JSON.stringify({ status }) })
};

export const sessionsApi = {
  start: (p: { ticketId: string; metadata?: Record<string, unknown> }) => apiFetch("/sessions/start", { method: "POST", body: JSON.stringify(p) }),
  end: (sessionId: string) => apiFetch(`/sessions/end/${sessionId}`, { method: "POST" }),
  list: (ticketId: string) => apiFetch(`/sessions/ticket/${ticketId}`)
};


