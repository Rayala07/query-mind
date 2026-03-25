import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiMailLine,
  RiLockPasswordLine,
  RiSparkling2Line,
  RiBrainLine,
  RiShieldKeyholeLine,
  RiFlashlightLine,
} from '@remixicon/react';
import AuthCard from '../components/AuthCard';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import useAuth from "../hooks/useAuth.js"

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

    {/* Radial fade overlay over dot-grid */}
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
      background: 'radial-gradient(ellipse at 40% 50%, rgba(15,12,36,0) 0%, rgba(15,12,36,0.85) 70%)',
    }} />

    {/* Glow blobs */}
    <div aria-hidden="true" className="absolute pointer-events-none" style={{ top: '20%', left: '10%', width: '260px', height: '260px', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 65%)', filter: 'blur(50px)' }} />
    <div aria-hidden="true" className="absolute pointer-events-none" style={{ bottom: '20%', right: '5%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)', filter: 'blur(50px)' }} />

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
        <RiSparkling2Line size={14} color="var(--accent)" />
        <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>AI-Powered Knowledge Base</span>
      </div>

      <h2 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: 16 }}>
        Your knowledge,<br />
        <span style={{ color: 'var(--accent)' }}>intelligently</span><br />
        organised.
      </h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 280, marginBottom: 36 }}>
        QueryMind connects the dots across your data, documents, and ideas — giving you answers in seconds.
      </p>

      {/* Feature list — icon + text only */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { Icon: RiBrainLine, text: 'Semantic search across all your data' },
          { Icon: RiFlashlightLine, text: 'Instant answers, zero noise' },
          { Icon: RiShieldKeyholeLine, text: 'Private and secure by default' },
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

/* ─── Login Page ─── */
const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const { handleLogin, isLoading } = useAuth();

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(form);
    navigate("/");
  };

  return (
    <div className="h-dvh w-full overflow-hidden grid lg:grid-cols-2" style={{ background: 'var(--bg-base)' }}>
      <BrandPanel />

      {/* Form column */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff', userSelect: 'none' }}>Q</div>
            <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>QueryMind</span>
          </div>

          <AuthCard>
            {/* Heading */}
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.02em' }}>
                Welcome back
              </h1>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
                Sign in to continue to QueryMind
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <AuthInput
                label="Email address"
                name="email" type="email"
                value={form.email} onChange={handleChange('email')}
                placeholder="you@example.com"
                icon={<RiMailLine size={15} />}
                required
              />
              <AuthInput
                label="Password"
                name="password" type="password"
                value={form.password} onChange={handleChange('password')}
                placeholder="••••••••"
                icon={<RiLockPasswordLine size={15} />}
                required
              />

              {/* Forgot password */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500, textDecoration: 'none', opacity: 0.9 }}>Forgot password?</Link>
              </div>

              <div style={{ marginTop: 4 }}>
                <AuthButton isLoading={isLoading}>{isLoading ? 'Signing in…' : 'Sign in'}</AuthButton>
              </div>
            </form>

            {/* Redirect */}
            <p style={{ fontSize: 13, textAlign: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
            </p>
          </AuthCard>
        </div>
      </div>
    </div>
  );
};

export default Login;