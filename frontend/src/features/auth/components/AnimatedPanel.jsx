/**
 * @file AnimatedPanel.jsx
 * @description
 * The blue sliding panel that overlaps the auth forms.
 * It uses Motion One to slide left/right when the user toggles
 * between Login and Register views.
 */

import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { animate } from "motion";
import AuthButton from "./AuthButton";

/**
 * @param {object} props
 * @param {boolean} props.isLogin - If true, the panel slides to the right (Login view)
 * @param {func}    props.onToggle - Callback to toggle the isLogin state
 */
const AnimatedPanel = ({ isLogin, onToggle }) => {
  const panelRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (panelRef.current) {
      // Animate the panel position
      // In a 100% width container, the panel is 50%.
      // isLogin (true) -> panel is on the right -> translateX(0)
      // isLogin (false) -> panel is on the left -> translateX(-100%)
      // Wait, let's reverse that logic to match standard split-screen:
      // Typically: [Forms Area] [Blue Panel]
      // isLogin (true)  => [LoginForm] [Blue Panel] (panel on right)
      // isLogin (false) => [Blue Panel] [RegisterForm] (panel on left)
      
      const xOffset = isLogin ? "0%" : "-100%";
      
      animate(
        panelRef.current,
        { transform: `translateX(${xOffset})` },
        { duration: 0.6, easing: [0.22, 1, 0.36, 1] }
      );

      // Fade in/out the text content for a smoother feel
      if (contentRef.current) {
        animate(
          contentRef.current,
          { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0px)"] },
          { duration: 0.5, delay: 0.2 }
        );
      }
    }
  }, [isLogin]);

  return (
    <div className="auth-blue-panel" ref={panelRef}>
      <div className="auth-panel-content" ref={contentRef} key={isLogin ? "login" : "register"}>
        {isLogin ? (
          <>
            <h2 className="auth-panel-title">Hello, Friend!</h2>
            <p className="auth-panel-text">
              Enter your personal details and start journey with us
            </p>
            <AuthButton variant="outline" onClick={onToggle}>
              SIGN UP
            </AuthButton>
          </>
        ) : (
          <>
            <h2 className="auth-panel-title">Welcome Back!</h2>
            <p className="auth-panel-text">
              To keep connected with us please login with your personal info
            </p>
            <AuthButton variant="outline" onClick={onToggle}>
              SIGN IN
            </AuthButton>
          </>
        )}
      </div>

      {/* Decorative Blob SVG */}
      <div className="auth-panel-blob">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path 
            fill="rgba(255, 255, 255, 0.1)" 
            d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.4,90,-16.2,88.5,-0.9C87,14.5,81.4,28.9,73.3,41.9C65.2,54.9,54.7,66.4,41.7,74.1C28.7,81.8,14.4,85.7,-0.5,86.5C-15.3,87.4,-30.7,85.1,-44.4,78.2C-58,71.3,-70,59.8,-78.2,46.2C-86.4,32.7,-90.8,17,-91.2,1.2C-91.6,-14.6,-88,-30.5,-79.8,-44.2C-71.6,-57.8,-58.8,-69.3,-44.5,-76.3C-30.2,-83.3,-15.1,-85.8,0.2,-86.2C15.6,-86.6,30.6,-83.6,44.7,-76.4Z" 
            transform="translate(100 100)" 
          />
        </svg>
      </div>
    </div>
  );
};

AnimatedPanel.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default AnimatedPanel;
