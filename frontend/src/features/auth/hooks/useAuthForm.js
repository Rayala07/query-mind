/**
 * @file useAuthForm.js
 * @layer Hook Layer
 * @description
 * Manages local form state, field changes, client-side validation,
 * and submit handling for both the Login and Register forms.
 *
 * Responsibilities:
 *  - Holds form field values in local React state (NOT Redux — form state
 *    is ephemeral UI state and does not belong in global store)
 *  - Runs client-side validation before dispatching to the API
 *  - Calls the appropriate useAuth action on submit
 *
 * Usage:
 *  // Login form
 *  const form = useAuthForm("login", onSuccess);
 *  // Register form
 *  const form = useAuthForm("register", onSuccess);
 */

import { useState, useCallback } from "react";
import useAuth from "./useAuth";

// ---------------------------------------------------------------------------
// Validation Helpers
// ---------------------------------------------------------------------------

/** Simple email format check */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** Minimum password length requirement */
const MIN_PASSWORD_LENGTH = 8;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * @param {"login" | "register"} mode     - Which form this hook drives
 * @param {() => void}           onSuccess - Called after successful submission
 *
 * @returns {{
 *   fields: object,
 *   errors: object,
 *   showPassword: boolean,
 *   isSubmitting: boolean,
 *   handleChange: (e: Event) => void,
 *   togglePassword: () => void,
 *   handleSubmit: (e: Event) => Promise<void>
 * }}
 */
const useAuthForm = (mode, onSuccess) => {
  const { login, register, dismissError } = useAuth();

  // ---------------------------------------------------------------------------
  // Local Form Field State
  // ---------------------------------------------------------------------------

  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rememberMe: false,
    acceptTerms: false,
  });

  /** Per-field validation error messages */
  const [errors, setErrors] = useState({});

  /** Controls password visibility toggle */
  const [showPassword, setShowPassword] = useState(false);

  /** Tracks in-flight submission to disable the submit button */
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---------------------------------------------------------------------------
  // Field Change Handler
  // ---------------------------------------------------------------------------

  /**
   * Generic change handler for all form inputs.
   * Handles both text inputs (e.target.value) and checkboxes (e.target.checked).
   * Clears the field-level error and the global Redux error on each keystroke.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      setFields((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
      // Clear the error for this specific field as the user fixes it
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      // Also clear any Redux-level error (e.g., "Invalid credentials")
      dismissError();
    },
    [dismissError]
  );

  /**
   * Toggles the password field between plain-text and obscured display.
   */
  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  /**
   * Runs client-side validation for the current mode.
   * Returns `true` if the form is valid, `false` otherwise.
   * Populates the `errors` state with per-field messages.
   *
   * @returns {boolean}
   */
  const validate = useCallback(() => {
    const newErrors = {};

    if (mode === "register") {
      if (!fields.firstName.trim())
        newErrors.firstName = "First name is required.";
      if (!fields.lastName.trim())
        newErrors.lastName = "Last name is required.";
      if (!fields.acceptTerms)
        newErrors.acceptTerms = "You must accept the terms & conditions.";
    }

    if (!fields.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!isValidEmail(fields.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!fields.password) {
      newErrors.password = "Password is required.";
    } else if (fields.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields, mode]);

  // ---------------------------------------------------------------------------
  // Submit Handler
  // ---------------------------------------------------------------------------

  /**
   * Validates the form and, if valid, dispatches the appropriate auth action.
   * Calls `onSuccess()` after a successful login or registration.
   *
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validate()) return;

      setIsSubmitting(true);
      try {
        if (mode === "login") {
          await login({
            email: fields.email,
            password: fields.password,
            rememberMe: fields.rememberMe,
          });
        } else {
          await register({
            firstName: fields.firstName,
            lastName: fields.lastName,
            email: fields.email,
            password: fields.password,
          });
        }
        onSuccess?.();
      } catch {
        // Errors from the thunk are stored in Redux state and read via useAuth.
        // We don't need to do anything here — the UI reads error from useAuth.
      } finally {
        setIsSubmitting(false);
      }
    },
    [fields, mode, validate, login, register, onSuccess]
  );

  return {
    fields,
    errors,
    showPassword,
    isSubmitting,
    handleChange,
    togglePassword,
    handleSubmit,
  };
};

export default useAuthForm;
