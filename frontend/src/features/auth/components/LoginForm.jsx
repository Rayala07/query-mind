/**
 * @file LoginForm.jsx
 * @description
 * High-level Login Form component. Consumes `useAuthForm` and
 * `useAuth` to handle the login flow and display errors.
 */

import React from "react";
import useAuth from "../hooks/useAuth";
import useAuthForm from "../hooks/useAuthForm";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import SocialLogin from "./SocialLogin";

const LoginForm = () => {
  const { error: reduxEmailError } = useAuth();
  
  // onSuccess is currently a no-op as the UI will redirect based on auth status
  const { 
    fields, 
    errors, 
    showPassword, 
    isSubmitting, 
    handleChange, 
    togglePassword, 
    handleSubmit 
  } = useAuthForm("login", () => {
    console.log("Login successful!");
  });

  return (
    <div className="auth-form-container login-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Sign In</h1>
        
        {/* Global Error Display (from Redux) */}
        {reduxEmailError && (
          <div className="auth-alert error-alert">
            {reduxEmailError}
          </div>
        )}

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

        <div className="auth-form-extras">
          <label className="auth-checkbox-label">
            <input
              type="checkbox"
              name="rememberMe"
              checked={fields.rememberMe}
              onChange={handleChange}
              className="auth-checkbox"
            />
            Keep me logged in
          </label>
          <a href="/forgot-password" title="Forgot Password" className="auth-link">
            Forgot Password?
          </a>
        </div>

        <AuthButton type="submit" isLoading={isSubmitting}>
          LOG IN
        </AuthButton>

        <SocialLogin />
      </form>
    </div>
  );
};

export default LoginForm;
