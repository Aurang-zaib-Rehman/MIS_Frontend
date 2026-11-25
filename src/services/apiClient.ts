/**
 * Centralized HTTP API Client
 * Phase 4.1 — Madrassa Management Information System (MIS)
 *
 * Handles HTTP requests, JWT Bearer token attachment, base URL resolution,
 * and unified error extraction.
 */

import type { Role } from "@/types/auth";

export const AUTH_TOKEN_KEY = "madrassa_jwt_token";
export const AUTH_USER_KEY = "madrassa_auth_user";

// Environment-configured API Base URL
const DEFAULT_API_BASE_URL = "http://localhost:5000";

export function getApiBaseUrl(): string {
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
  }
  return DEFAULT_API_BASE_URL;
}

/**
 * Storage helpers for authentication token and user identity cache
 */
export function getStoredToken(): string | null {
  if (typeof localStorage !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) return token;
  }
  if (typeof sessionStorage !== "undefined") {
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
}

export function setStoredToken(token: string): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function removeStoredToken(): void {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export interface CachedAuthUser {
  userId: string;
  username: string;
  role: Role;
}

export function getStoredUser(): CachedAuthUser | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: CachedAuthUser): void {
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch {
      // Storage unavailable or quota exceeded
    }
  }
}

export function removeStoredUser(): void {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(AUTH_USER_KEY);
  }
}

/**
 * Custom API Error containing HTTP status and server error message
 */
export class ApiError extends Error {
  public status: number;
  public data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Executes an HTTP fetch request against the Madrassa MIS backend
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const headers = new Headers(options.headers || {});

  // Default to application/json if sending a body and Content-Type is not set
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Attach Authorization Bearer token unless skipAuth is requested
  if (!options.skipAuth) {
    const token = getStoredToken();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Parse JSON response if present
  let data: Record<string, unknown> | null = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      data = (await response.json()) as Record<string, unknown>;
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status} (${response.statusText})`;
    if (data && typeof data === "object") {
      const msg = data.message || data.error;
      if (typeof msg === "string") {
        errorMessage = msg;
      }
    }

    // On 401 Unauthorized, automatically purge invalid or expired token
    if (response.status === 401 && !options.skipAuth) {
      removeStoredToken();
      removeStoredUser();
    }

    throw new ApiError(response.status, errorMessage, data);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

export default apiClient;
