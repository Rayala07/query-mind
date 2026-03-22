/**
 * @file AuthButton.jsx
 * @description
 * A reusable button component for the authentication feature.
 * Supports primary and outline variants, and a loading state.
 */

import React from "react";
import PropTypes from "prop-types";

/**
 * @param {object} props
 * @param {node}    props.children  - Button content (text or icons)
 * @param {string}  props.variant   - Style variant: "primary" | "outline"
 * @param {boolean} props.isLoading - If true, shows a spinner and disables the button
 * @param {func}    props.onClick   - Click handler
 * @param {string}  props.type      - HTML button type ("button" | "submit")
 * @param {boolean} props.disabled  - Standard disabled state
 */
const AuthButton = ({
  children,
  variant = "primary",
  isLoading = false,
  onClick,
  type = "button",
  disabled = false,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`auth-btn auth-btn-${variant} ${isLoading ? "is-loading" : ""}`}
      {...props}
    >
      {isLoading ? (
        <span className="auth-loader" aria-hidden="true" />
      ) : (
        children
      )}
    </button>
  );
};

AuthButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "outline"]),
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

export default AuthButton;
