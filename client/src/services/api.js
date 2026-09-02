const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/**
 * Base fetch client handling authentication headers and response parsing
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("solink_auth_token") || localStorage.getItem("solink_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    // If 401 Unauthorized, remove stale token from storage
    if (response.status === 401) {
      localStorage.removeItem("solink_auth_token");
      localStorage.removeItem("solink_token");
    }

    const errorMessage =
      typeof data === "object" && data !== null && data.error
        ? data.error
        : typeof data === "string" && data.trim()
        ? data
        : `HTTP ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data;
}
