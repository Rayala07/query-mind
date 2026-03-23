import { useRef } from 'react';
import { animate } from 'motion';

/**
 * AuthButton — Gradient CTA with Motion One hover + press.
 */
const AuthButton = ({ children, onClick, isLoading = false, disabled = false, type = 'submit' }) => {
  const btnRef = useRef(null);

  const handleMouseEnter = () => {
    if (btnRef.current && !isLoading && !disabled)
      animate(btnRef.current, { scale: 1.012 }, { duration: 0.18, easing: [0.22, 1, 0.36, 1] });
  };
  const handleMouseLeave = () => {
    if (btnRef.current)
      animate(btnRef.current, { scale: 1 }, { duration: 0.2, easing: [0.22, 1, 0.36, 1] });
  };
  const handleMouseDown = () => {
    if (btnRef.current)
      animate(btnRef.current, { scale: 0.975 }, { duration: 0.1 });
  };
  const handleMouseUp = () => {
    if (btnRef.current)
      animate(btnRef.current, { scale: 1 }, { duration: 0.2, easing: [0.34, 1.56, 0.64, 1] });
  };

  const isDisabled = disabled || isLoading;

  /* Tiny spinner SVG */
  const Spinner = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" className="animate-spin">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={isDisabled}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 24px',
        background: isDisabled
          ? 'rgba(139,92,246,0.4)'
          : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        letterSpacing: '0.01em',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        outline: 'none',
        boxShadow: 'none',
      }}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
};

export default AuthButton;
