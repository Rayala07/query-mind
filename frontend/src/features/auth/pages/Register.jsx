import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiMailLine,
  RiLockPasswordLine,
  RiUser3Line,
  RiShieldKeyholeLine,
  RiUserAddLine,
  RiBarChart2Line,
  RiTimeLine,
} from '@remixicon/react';
import AuthCard from '../components/AuthCard';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import useAuth from '../hooks/useAuth.js';

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
        <RiUserAddLine size={14} color="var(--accent)" />
        <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>Free to start — no card needed</span>
      </div>

      <h2 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: 16 }}>
        Start thinking<br />
        <span style={{ color: 'var(--accent)' }}>smarter</span><br />
        today.
      </h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 280, marginBottom: 36 }}>
        Join thousands of researchers, builders, and thinkers who use QueryMind to cut through the noise.
      </p>

      {/* Stat strip */}
      <div style={{ display: 'flex', gap: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { Icon: RiUser3Line,    value: '10k+',  label: 'Users' },
          { Icon: RiBarChart2Line, value: '4.9★', label: 'Rating' },
          { Icon: RiTimeLine,     value: '< 1s',  label: 'Response' },
        ].map(({ Icon, value, label }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="relative z-10" />
  </div>
);

/* ─── Register Page ─── */
const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const navigate = useNavigate();

  const { handleRegister, isLoading } = useAuth();

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister(form);
    navigate('/login');
  };

  return (
    <div className="h-dvh w-full overflow-hidden grid lg:grid-cols-2" style={{ background: 'var(--bg-base)' }}>
      <BrandPanel />

      {/* Form column */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '28px 24px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff', userSelect: 'none' }}>Q</div>
            <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>QueryMind</span>
          </div>

          <AuthCard>
            {/* Heading */}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.02em' }}>
                Create your account
              </h1>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
                Join QueryMind and unlock smarter thinking
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <AuthInput
                label="Full name"
                name="name" type="text"
                value={form.name} onChange={handleChange('name')}
                placeholder="Alex Johnson"
                icon={<RiUser3Line size={15} />}
                required
              />
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
                placeholder="Min. 8 characters"
                icon={<RiLockPasswordLine size={15} />}
                required
              />
              <AuthInput
                label="Confirm password"
                name="confirmPassword" type="password"
                value={form.confirmPassword} onChange={handleChange('confirmPassword')}
                placeholder="Re-enter your password"
                icon={<RiShieldKeyholeLine size={15} />}
                required
              />

              <div style={{ marginTop: 6 }}>
                <AuthButton isLoading={isLoading}>{isLoading ? 'Creating account…' : 'Create account'}</AuthButton>
              </div>
            </form>

            {/* Redirect */}
            <p style={{ fontSize: 13, textAlign: 'center', marginTop: 22, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </AuthCard>
        </div>
      </div>
    </div>
  );
};

export default Register;