import { useEffect, useRef } from 'react';
import { animate } from 'motion';

/**
 * AuthCard — Thin-bordered glassmorphism card with Motion One entrance.
 */
const AuthCard = ({ children }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      animate(
        cardRef.current,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.5, easing: [0.22, 1, 0.36, 1] }
      );
    }
  }, []);

  return (
    <div
      ref={cardRef}
      style={{
        opacity: 0,
        background: 'rgba(13,13,26,0.7)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '18px',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        padding: 'clamp(1.5rem, 4vw, 2rem)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {children}
    </div>
  );
};

export default AuthCard;
