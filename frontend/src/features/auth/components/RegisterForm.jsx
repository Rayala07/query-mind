/**
 * @file RegisterForm.jsx
 * @description
 * High-level Registration Form component. Consumes `useAuthForm`
 * and `useAuth` to handle user signup.
 */

import React from "react";
import useAuth from "../hooks/useAuth";
import useAuthForm from "../hooks/useAuthForm";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import SocialLogin from "./SocialLogin";

const RegisterForm = () => {
  const { error: reduxError } = useAuth();

  const {
    fields,
    errors,
    showPassword,
    isSubmitting,
    handleChange,
    togglePassword,
    handleSubmit,
  } = useAuthForm("register", () => {
    console.log("Registration successful!");
  });

  return (
    <div className="auth-form-container register-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Create Account</h1>

        {reduxError && (
          <div className="auth-alert error-alert">
            {reduxError}
          </div>
        )}

        <div className="auth-form-row">
          <AuthInput
            id="firstName"
            label="First Name"
            placeholder="John"
            value={fields.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />
          <AuthInput
            id="lastName"
            label="Last Name"
            placeholder="Doe"
            value={fields.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
        </div>

        <AuthInput
          id="email"
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          value={fields.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <AuthInput
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Min. 8 characters"
          value={fields.password}
          onChange={handleChange}
          error={errors.password}
          required
          rightIcon={
            <button
              type="button"
              className="password-toggle"
              onClick={togglePassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          }
        />

        <label className={`auth-checkbox-label ${errors.acceptTerms ? "has-error" : ""}`}>
          <input
            type="checkbox"
            name="acceptTerms"
            checked={fields.acceptTerms}
            onChange={handleChange}
            className="auth-checkbox"
          />
          I accept the <a href="/terms" className="auth-link">Terms & Conditions</a>
        </label>
        {errors.acceptTerms && <span className="auth-error-message">{errors.acceptTerms}</span>}

        <AuthButton type="submit" isLoading={isSubmitting}>
          SIGN UP
        </AuthButton>

        <SocialLogin />
      </form>
    </div>
  );
};

export default RegisterForm;
