/**
 * @file useAuth.js
 * @layer Hook Layer
 * @description
 * The primary auth hook. This is the ONLY way UI components should
 * interact with Redux auth state and dispatch auth actions.
 *
 * This hook:
 *  - Reads auth state from the Redux store via named selectors
 *  - Wraps dispatch calls so UI components never import store, thunks,
 *    or action creators directly
 *  - Provides a stable, documented API surface for any component that
 *    needs auth functionality
 *
 * Usage:
 *  const { user, isLoading, error, login, register, logout } = useAuth();
 */

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelectors, clearError, loginThunk, logoutThunk, registerThunk } from "../store/authSlice";

/**
 * Custom hook that exposes authentication state and actions to UI components.
 *
 * Token Strategy — Cookie-Based:
 *  There is no `token` field — auth cookies are HttpOnly and managed by the
 *  browser. This hook only exposes the user object and auth status.
 *
 * @returns {{
 *   user: Object|null,
 *   isLoading: boolean,
 *   error: string|null,
 *   isAuthenticated: boolean,
 *   login: (credentials: object) => Promise<void>,
 *   register: (userData: object) => Promise<void>,
 *   logout: () => Promise<void>,
 *   dismissError: () => void
 * }}
 */
const useAuth = () => {
  const dispatch = useDispatch();

  // ---------------------------------------------------------------------------
  // State — read from Redux store via named selectors
  // ---------------------------------------------------------------------------

  const user = useSelector(authSelectors.user);
  const isLoading = useSelector(authSelectors.isLoading);
  const error = useSelector(authSelectors.error);
  const isAuthenticated = useSelector(authSelectors.isAuthenticated);

  // ---------------------------------------------------------------------------
  // Actions — wrapped in useCallback to ensure referential stability
  // ---------------------------------------------------------------------------

  /**
   * Dispatches the login thunk with the given credentials.
   * Returns the unwrapped result so callers can react to success/failure.
   *
   * @param {{ email: string, password: string, rememberMe?: boolean }} credentials
   */
  const login = useCallback(
    (credentials) => dispatch(loginThunk(credentials)).unwrap(),
    [dispatch]
  );

  /**
   * Dispatches the register thunk with the given user data.
   *
   * @param {{ firstName: string, lastName: string, email: string, password: string }} userData
   */
  const register = useCallback(
    (userData) => dispatch(registerThunk(userData)).unwrap(),
    [dispatch]
  );

  /**
   * Dispatches the logout thunk, clearing all session data.
   */
  const logout = useCallback(
    () => dispatch(logoutThunk()).unwrap(),
    [dispatch]
  );

  /**
   * Clears the current error from Redux state.
   * Typically called when the user starts editing a field after a failed attempt.
   */
  const dismissError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    dismissError,
  };
};

export default useAuth;
