'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthAside from './AuthAside';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';
import { ApiRequestError } from '@/services/api';
import './Auth.css';

export default function RegisterForm() {
  const router = useRouter();
  const { setUser, isAuthenticated, loading: authLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already signed in (e.g. opened /register directly) → go to the dashboard.
  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace('/dashboard');
  }, [authLoading, isAuthenticated, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Please enter your name.');
    if (!email.trim()) return setError('Please enter your email.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      const user = await authService.register(name.trim(), email.trim(), password);
      setUser(user);
      router.replace('/dashboard');
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : 'Unable to register. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <AuthAside />
      <div className="auth__main">
        <div className="auth__card">
          <Link href="/" className="auth__back">
            <FiArrowLeft /> Back to home
          </Link>
          <h1 className="auth__title">Create your account</h1>
          <p className="auth__subtitle">Start your business analysis in minutes.</p>

          <form className="auth__form" onSubmit={submit}>
            <Input
              label="Full Name"
              name="name"
              icon={<FiUser />}
              placeholder="e.g. Ravi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              icon={<FiMail />}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              icon={<FiLock />}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              hint="Minimum 6 characters"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              }
            />
            {error && (
              <div className="auth__error" role="alert">
                {error}
              </div>
            )}
            <Button type="submit" size="lg" fullWidth loading={loading} rightIcon={<FiArrowRight />}>
              Create Account
            </Button>
          </form>

          <p className="auth__switch">
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
