// Security summary (student note): registration enforces strong passwords and sends data
// to the backend where hashing and validation happen.
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/authApi';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import Link from 'next/link';

const passwordRules = [
  'At least 8 characters',
  'Uppercase and lowercase letters',
  'At least one number',
  'At least one special character',
];

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Security note: password rules enforced server-side before storing hash.
      await register(email, password);
      router.push('/login');
    } catch (err: any) {
      setError('Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream-50/60">
      <section className="container-page py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-black/10 bg-white p-8 shadow-soft">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.2em] text-ink-400">Create account</p>
            <h1 className="mt-2 text-3xl font-semibold text-ink-900">Join BeersShop</h1>
            <p className="mt-2 text-sm text-ink-500">Secure registration with MFA support.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
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
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="text-center text-sm text-ink-500">
              Already have an account? <Link href="/login" className="text-brand-600">Sign in</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
