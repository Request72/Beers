// Security summary (student note): login UI supports MFA flow and relies on secure cookies,
// so no access tokens are stored in the browser.
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, verifyMfa, rememberUserId } from '@/lib/authApi';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import Link from 'next/link';

const passwordRules = [
  'At least 8 characters',
  'Uppercase and lowercase letters',
  'At least one number',
  'At least one special character',
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [step, setStep] = useState<'login' | 'mfa'>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Security note: credentials are sent to backend; tokens stay in httpOnly cookies.
      const data = await login(email, password);
      if (data?.mfaRequired) {
        setStep('mfa');
        return;
      }
      rememberUserId(data?.user?.id);
      router.push('/beers');
    } catch (err: any) {
      const status = err?.response?.status;
      const code = err?.response?.data?.code;
      if (status === 423) {
        setError('Account locked. Please wait 30 minutes before retrying.');
      } else if (status === 429) {
        setError('Too many attempts. Please try again later.');
      } else if (status === 403 && code === 'PASSWORD_EXPIRED') {
        setError('Your password has expired. Please reset it in settings.');
      } else {
        setError('Invalid credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMfa = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await verifyMfa(mfaCode);
      rememberUserId(data?.user?.id);
      router.push('/beers');
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 429) {
        setError('Too many MFA attempts. Please try again later.');
      } else {
        setError('Invalid MFA code.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream-50/60">
      <section className="container-page py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-black/10 bg-white p-8 shadow-soft">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.2em] text-ink-400">Secure access</p>
            <h1 className="mt-2 text-3xl font-semibold text-ink-900">
              {step === 'login' ? 'Sign in to BeersShop' : 'Verify MFA'}
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              {step === 'login'
                ? 'Use your account credentials to continue.'
                : 'Enter the 6-digit code from your authenticator app.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {step === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block text-sm font-medium text-ink-700">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm"
                />
              </label>

              <label className="block text-sm font-medium text-ink-700">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm"
                />
                <PasswordStrength password={password} />
              </label>

              <ul className="rounded-2xl bg-ink-50 px-4 py-3 text-xs text-ink-600">
                {passwordRules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>


              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <p className="text-center text-sm text-ink-500">
                New here? <Link href="/register" className="text-brand-600">Create an account</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleMfa} className="space-y-4">
              <label className="block text-sm font-medium text-ink-700">
                MFA code
                <input
                  type="text"
                  value={mfaCode}
                  onChange={(event) => setMfaCode(event.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
