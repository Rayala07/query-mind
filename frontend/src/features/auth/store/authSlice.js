/**
 * @file authSlice.js
 * @layer Data Layer (Redux)
 * @description
 * Redux slice for authentication state. This is the single source of truth
 * for everything auth-related in the client: the current user object,
 * loading state, and error messages.
 *
 * Token Strategy — Cookie-Based (HttpOnly):
 *  We do NOT store any token string in Redux state or localStorage.
 *  Auth tokens live exclusively in HttpOnly cookies managed by the server.
 *  The only client-visible auth data is the `user` object returned by
 *  the server after successful login/register/refresh.
 *
 * Contains:
 *  - Initial state definition
 *  - Async thunks (loginThunk, registerThunk, logoutThunk) that call the API layer
 *  - Synchronous reducers (clearError, setCredentials, resetAuth)
 *  - Named selectors for clean, consistent state access in the Hook layer
 */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  loginRequest,
  logoutRequest,
  registerRequest,
} from "../services/authApi";

// ---------------------------------------------------------------------------
// Initial State
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} AuthState
 * @property {Object|null}  user            - Authenticated user object { id, email, firstName, lastName }
 * @property {boolean}      isLoading       - True while any async auth operation is in flight
 * @property {string|null}  error           - Error message from the last failed operation
 * @property {boolean}      isAuthenticated - True when a user object is present in state
 */
const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// ---------------------------------------------------------------------------
// Async Thunks — Live in the Data Layer; call the API Layer
// ---------------------------------------------------------------------------

/**
 * Logs in a user with email and password.
 * The server sets the HttpOnly auth cookies in the response; we only
 * store the returned user object in Redux.
 *
 * @param {{ email: string, password: string, rememberMe?: boolean }} credentials
 */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginRequest(credentials);
      return data; // { user }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Registers a new user account.
 * Automatically logs in the user — the server sets auth cookies on success.
 *
 * @param {{ firstName: string, lastName: string, email: string, password: string }} userData
 */
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerRequest(userData);
      return data; // { user }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Logs out the current user.
 * The server clears the HttpOnly cookies on its end; we reset Redux state here.
 */
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutRequest();
    } catch (error) {
      // Even if the server call fails, we clear local state
      return rejectWithValue(error.message);
    }
  }
);

// ---------------------------------------------------------------------------
// Slice Definition
// ---------------------------------------------------------------------------

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Clears the current error message (e.g., when the user starts re-typing).
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Manually hydrates user credentials — used to restore a session on
     * app startup without forcing the user to log in again (e.g., after a
     * successful /auth/refresh call that returns the user object).
     *
     * @param {{ user: object }} payload
     */
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    /**
     * Resets the entire auth state back to its initial shape.
     */
    resetAuth: () => initialState,
  },

  // -------------------------------------------------------------------------
  // Extra Reducers — Handle async thunk lifecycle actions
  // -------------------------------------------------------------------------
  extraReducers: (builder) => {
    // --- Login ---
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // --- Register ---
    builder
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // --- Logout ---
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutThunk.fulfilled, () => initialState)
      .addCase(logoutThunk.rejected, () => initialState); // always reset on logout
  },
});

// ---------------------------------------------------------------------------
// Exports — Actions
// ---------------------------------------------------------------------------

export const { clearError, setCredentials, resetAuth } = authSlice.actions;

// ---------------------------------------------------------------------------
// Exports — Selectors
// Centralising selectors here so the Hook layer never needs to know the
// exact Redux state shape.
// ---------------------------------------------------------------------------

/**
 * Named selectors for the auth slice.
 * Usage in hooks: `const user = useSelector(authSelectors.user)`
 */
export const authSelectors = {
  /** @returns {Object|null} The authenticated user object */
  user: (state) => state.auth.user,

  /** @returns {boolean} Whether an async auth operation is in-flight */
  isLoading: (state) => state.auth.isLoading,

  /** @returns {string|null} The last error message, or null */
  error: (state) => state.auth.error,

  /** @returns {boolean} Whether the user is authenticated */
  isAuthenticated: (state) => state.auth.isAuthenticated,
};

export default authSlice.reducer;
