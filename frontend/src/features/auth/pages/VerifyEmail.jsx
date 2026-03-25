import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  RiMailSendLine,
  RiCheckboxCircleLine,
  RiTimeLine,
} from '@remixicon/react';
import AuthCard from '../components/AuthCard';

/* ─── Brand Panel ─── */
const BrandPanel = () => (
  <div
    className="hidden lg:flex flex-col justify-between p-14 relative overflow-hidden"
    style={{
      background: 'linear-gradient(160deg, #0f0c24 0%, #130f2e 60%, #0c0a1e 100%)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
    }}
  >
    {/* Dot-grid bg */}
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: 'radial-gradient(rgba(139,92,246,0.18) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    }} />

    {/* Radial fade overlay */}
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
      background: 'radial-gradient(ellipse at 40% 50%, rgba(15,12,36,0) 0%, rgba(15,12,36,0.85) 70%)',
    }} />

    {/* Glow blobs */}
    <div aria-hidden="true" className="absolute pointer-events-none" style={{ top: '15%', left: '15%', width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 65%)', filter: 'blur(50px)' }} />
    <div aria-hidden="true" className="absolute pointer-events-none" style={{ bottom: '20%', right: '10%', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)', filter: 'blur(50px)' }} />

    {/* Logo */}
    <div className="relative z-10 flex items-center gap-3">
      <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff', userSelect: 'none' }}>
        Q
      </div>
      <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 15 }}>QueryMind</span>
    </div>

    {/* Hero copy */}
    <div className="relative z-10">
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '6px 12px', borderRadius: 99, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
        <RiMailSendLine size={14} color="var(--accent)" />
        <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>Almost there!</span>
      </div>

      <h2 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: 16 }}>
        One step<br />
        <span style={{ color: 'var(--accent)' }}>left</span><br />
        to go.
      </h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 280, marginBottom: 36 }}>
        Check your inbox and click the verification link we sent you. It only takes a second.
      </p>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { Icon: RiMailSendLine,        text: 'Verification email sent to your inbox' },
          { Icon: RiCheckboxCircleLine,  text: 'Click the link to confirm your address' },
          { Icon: RiTimeLine,            text: 'Link expires after 24 hours' },
        ].map(({ Icon, text }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon size={16} color="var(--accent)" style={{ opacity: 0.8, flexShrink: 0 }} />
            <span style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>{text}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="relative z-10" />
  </div>
);

/* ─── Resend Button ─── */
const ResendButton = ({ email }) => {
  const [cooldown, setCooldown] = useState(0);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    try {
      await fetch('/api/auth/resend-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSent(true);
      setCooldown(30);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleResend}
      disabled={cooldown > 0 || loading}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: cooldown > 0 || loading ? 'not-allowed' : 'pointer',
        color: cooldown > 0 ? 'var(--text-muted)' : 'var(--accent)',
        fontWeight: 600,
        fontSize: 13,
        textDecoration: 'none',
        transition: 'opacity 0.2s',
        opacity: cooldown > 0 ? 0.5 : 1,
      }}
    >
      {loading
        ? 'Sending…'
        : cooldown > 0
          ? `Resend in ${cooldown}s`
          : sent
            ? 'Resend again'
            : 'Resend email'}
    </button>
  );
};

/* ─── VerifyEmail Page ─── */
const VerifyEmail = () => {
  const location = useLocation();
  const email = location.state?.email ?? null;

  return (
    <div className="h-dvh w-full overflow-hidden grid lg:grid-cols-2" style={{ background: 'var(--bg-base)' }}>
      <BrandPanel />

      {/* Content column */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '28px 24px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff', userSelect: 'none' }}>Q</div>
            <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>QueryMind</span>
          </div>

          <AuthCard>
            {/* Icon badge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <RiMailSendLine size={28} color="var(--accent)" />
              </div>
            </div>

            {/* Heading */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>
                Check your inbox
              </h1>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                We've sent a verification link to{' '}
                {email
                  ? <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
                  : 'your email address'
                }.
                {' '}Please verify your email to activate your account.
              </p>
            </div>

            {/* Separator */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '20px 0' }} />

            {/* CTA */}
            <p style={{ fontSize: 13.5, textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Already verified?{' '}
              <Link
                to="/login"
                style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}
              >
                Sign in
              </Link>
            </p>

            {/* Resend */}
            <p style={{ fontSize: 13, textAlign: 'center', color: 'var(--text-muted)' }}>
              Didn't receive it?{' '}
              {email
                ? <ResendButton email={email} />
                : (
                  <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                    Register again
                  </Link>
                )
              }
            </p>
          </AuthCard>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
