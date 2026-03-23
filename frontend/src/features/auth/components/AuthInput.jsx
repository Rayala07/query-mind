import { useRef, useState, useId } from 'react';
import { animate } from 'motion';

/**
 * AuthInput — Premium dark input.
 * @param {React.ReactNode} icon - Pass a @remixicon/react component directly
 */
const AuthInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  error,
  name,
  required = false,
}) => {
  const id = useId();
  const wrapperRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleFocus = () => {
    setIsFocused(true);
    if (wrapperRef.current)
      animate(wrapperRef.current, { boxShadow: '0 0 0 2px rgba(139,92,246,0.3)' }, { duration: 0.18 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (wrapperRef.current)
      animate(wrapperRef.current, { boxShadow: '0 0 0 0px rgba(139,92,246,0)' }, { duration: 0.18 });
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
          {required && <span style={{ color: 'var(--accent)' }} className="ml-0.5">*</span>}
        </label>
      )}

      <div
        ref={wrapperRef}
        className="relative flex items-center"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : isFocused ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: '10px',
          transition: 'border-color 0.18s',
        }}
      >
        {/* Left icon */}
        {icon && (
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ color: isFocused ? 'var(--accent)' : 'var(--text-muted)', transition: 'color 0.18s' }}
          >
            {icon}
          </span>
        )}

        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'off'}
          className="w-full bg-transparent outline-none text-sm font-normal"
          style={{
            padding: '11px 14px',
            paddingLeft: icon ? '2.25rem' : '14px',
            paddingRight: type === 'password' ? '2.5rem' : '14px',
            color: 'var(--text-primary)',
            caretColor: 'var(--accent)',
          }}
        />

        {/* Password toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center focus:outline-none cursor-pointer"
            style={{ color: 'var(--text-muted)', opacity: 0.7 }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword
              ? <EyeOffIcon />
              : <EyeIcon />
            }
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs flex items-center gap-1" style={{ color: 'var(--error)' }}>
          <AlertIcon />
          {error}
        </p>
      )}
    </div>
  );
};

/* Tiny inline SVG icons — only used internally for eye/alert, kept separate from props */
const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default AuthInput;
