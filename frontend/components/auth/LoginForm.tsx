'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthAside from './AuthAside';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';
import { ApiRequestError, consumeSessionExpired } from '@/services/api';
import './Auth.css';

export default function LoginForm() {
  const router = useRouter();
  const { setUser, isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [nextPath, setNextPath] = useState('/dashboard');
  const [loading, setLoading] = useState(false);

  // Read the post-login destination and any "session expired" flag (client-only,
  // so we avoid a Suspense boundary requirement from useSearchParams).
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const next = params.get('next');
      if (next && next.startsWith('/')) setNextPath(next);
    } catch {
      /* ignore */
    }
    if (consumeSessionExpired()) {
      setNotice('Your session has expired. Please log in again.');
    }
  }, []);

  // Already signed in (e.g. opened /login directly) → skip the form.
  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace(nextPath);
  }, [authLoading, isAuthenticated, nextPath, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const user = await authService.login(email.trim(), password);
      setUser(user);
      router.replace(nextPath);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to log in. Please try again.');
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
          <h1 className="auth__title">Welcome back</h1>
          <p className="auth__subtitle">Log in to continue your business journey.</p>

          {notice && (
            <div className="auth__notice" role="status">
              {notice}
            </div>
          )}

          <form className="auth__form" onSubmit={submit}>
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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
            <Button type="submit" size="lg" fullWidth loading={loading} leftIcon={<FiLogIn />}>
              Log In
            </Button>
          </form>

          <p className="auth__switch">
            New to RuralMate AI? <Link href="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
