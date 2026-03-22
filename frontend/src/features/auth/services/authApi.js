/**
 * @file authApi.js
 * @layer API Layer
 * @description
 * The lowest layer in the 4-layer architecture. This module is purely
 * responsible for making HTTP requests to the authentication endpoints.
 * It contains ZERO business logic — it simply sends data and returns
 * the raw server response.
 *
 * Token Strategy — Cookie-Based (HttpOnly):
 *  All authentication tokens (access + refresh) are stored in HttpOnly
 *  cookies managed entirely by the server. The browser attaches them
 *  automatically on every request via `withCredentials: true`.
 *  This file never reads, writes, or even knows about token strings —
 *  that concern belongs to the server.
 *
 * All other layers (hooks, store, UI) must NEVER import axios directly.
 * Every API call goes through this file.
 */

import axios from "axios";

// ---------------------------------------------------------------------------
// Axios Instance
// ---------------------------------------------------------------------------

/**
 * Configured Axios instance for all auth API calls.
 *
 * Key settings:
 *  - `baseURL`        — points to the backend API prefix (configurable via env)
 *  - `withCredentials: true` — instructs the browser to include HttpOnly
 *    cookies on every cross-origin request automatically.
 *    No token is manually read or attached anywhere in this file.
 */
const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ← required for HttpOnly cookie transport
});

// ---------------------------------------------------------------------------
// Response Interceptor — Handle 401 (access token expired) globally
// ---------------------------------------------------------------------------

/**
 * When the server responds with 401, the access-token cookie has expired.
 * We attempt a silent refresh (the refresh-token cookie is sent automatically).
 * If the refresh also fails, the user is redirected to the login page.
 *
 * Because tokens live in HttpOnly cookies, the browser handles setting the
 * new cookie from the Set-Cookie response header — no client-side token
 * handling is needed.
 */
authAxios.interceptors.response.use(
  (response) => response, // pass successful responses through unchanged
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // The refresh-token cookie is sent automatically; the server responds
        // with a new Set-Cookie header for the access token.
        await authAxios.post("/auth/refresh");
        // Retry the original request — the new access-token cookie is now set
        return authAxios(originalRequest);
      } catch {
        // Refresh failed — redirect to login
        window.location.href = "/auth";
      }
    }

    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// Auth API Functions
// ---------------------------------------------------------------------------

/**
 * Sends login credentials to the server.
 * The server responds with the user object and sets HttpOnly cookies
 * for the access token and refresh token.
 *
 * @param {{ email: string, password: string, rememberMe?: boolean }} credentials
 * @returns {Promise<{ user: object }>}
 */
export const loginRequest = async (credentials) => {
  const { data } = await authAxios.post("/auth/login", credentials);
  return data;
};

/**
 * Registers a new user account.
 * The server auto-logs the user in by setting the auth cookies on response.
 *
 * @param {{ firstName: string, lastName: string, email: string, password: string }} userData
 * @returns {Promise<{ user: object }>}
 */
export const registerRequest = async (userData) => {
  const { data } = await authAxios.post("/auth/register", userData);
  return data;
};

/**
 * Logs the current user out.
 * The server clears the HttpOnly auth cookies on its end.
 *
 * @returns {Promise<void>}
 */
export const logoutRequest = async () => {
  await authAxios.post("/auth/logout");
};

/**
 * Explicitly requests a new access-token cookie using the refresh-token cookie.
 * Normally called automatically by the response interceptor on 401.
 * Can also be called manually on app startup to restore a session.
 *
 * @returns {Promise<{ user: object }>}
 */
export const refreshTokenRequest = async () => {
  const { data } = await authAxios.post("/auth/refresh");
  return data;
};
