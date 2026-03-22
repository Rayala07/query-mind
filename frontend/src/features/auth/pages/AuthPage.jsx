/**
 * @file AuthPage.jsx
 * @description
 * The main container for the authentication feature.
 * Manages the `isLogin` toggle state and renders the split-screen layout
 * with the sliding blue panel.
 */

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import AnimatedPanel from "../components/AnimatedPanel";
import "../styles/auth.css";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * isLogin = true  -> Show Login Form (Panel on right)
   * isLogin = false -> Show Register Form (Panel on left)
   */
  const [isLogin, setIsLogin] = useState(location.pathname !== "/register");

  useEffect(() => {
    setIsLogin(location.pathname !== "/register");
  }, [location.pathname]);

  const toggleAuthMode = () => {
    const nextIsLogin = !isLogin;
    navigate(nextIsLogin ? "/login" : "/register");
  };

  return (
    <main className="auth-page-wrapper">
      <div className={`auth-card-container ${isLogin ? "show-login" : "show-register"}`}>
        {/* White Panel (Forms Area) */}
        <div className="auth-white-panel">
          <LoginForm />
          <RegisterForm />
        </div>

        {/* Blue Panel (Sliding Overlay) */}
        <AnimatedPanel isLogin={isLogin} onToggle={toggleAuthMode} />
      </div>
    </main>
  );
};

export default AuthPage;
