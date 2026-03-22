/**
 * @file AuthInput.jsx
 * @description
 * A reusable, labeled input component for the authentication feature.
 * Supports error messaging, custom icons, and standard HTML input props.
 */

import React from "react";
import PropTypes from "prop-types";

/**
 * @param {object} props
 * @param {string} props.id          - Unique identifier for the input and label
 * @param {string} props.label       - Descriptive label text
 * @param {string} props.type        - Input type (text, password, email, etc.)
 * @param {string} props.placeholder - Placeholder text
 * @param {any}    props.value       - Current value of the input
 * @param {func}   props.onChange    - Change handler function
 * @param {string} props.error       - Validation error message (if any)
 * @param {node}   props.rightIcon   - Optional icon or element to display on the right
 */
const AuthInput = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  rightIcon,
  ...props
}) => {
  return (
    <div className="auth-input-group">
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      
      <div className={`auth-input-wrapper ${error ? "has-error" : ""}`}>
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="auth-field"
          {...props}
        />
        
        {rightIcon && (
          <div className="auth-input-icon">
            {rightIcon}
          </div>
        )}
      </div>

      {error && <span className="auth-error-message">{error}</span>}
    </div>
  );
};

AuthInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  rightIcon: PropTypes.node,
};

export default AuthInput;
