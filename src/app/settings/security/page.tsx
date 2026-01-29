// Security summary (student note): security settings manage MFA setup, recovery codes,
// and password changes through protected endpoints.
'use client';

import { useEffect, useState } from 'react';
import {
  fetchMe,
  setupMfa,
  verifyMfaSetup,
  disableMfa,
  changePassword,
} from '@/lib/authApi';
import { PasswordStrength } from '@/components/auth/PasswordStrength';

type UserSummary = {
  email: string;
  role: string;
  mfaEnabled: boolean;
  passwordExpiresAt?: string;
};

export default function SecuritySettingsPage() {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [mfaCode, setMfaCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchMe()
      .then((data) => setUser(data.user))
      .catch(() => setError('Unable to load profile.'));
  }, []);

  const handleSetupMfa = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await setupMfa();
      setQrCode(data.qrCodeDataUrl);
      setRecoveryCodes(data.recoveryCodes ?? []);
    } catch (err) {
      setError('Failed to start MFA setup.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMfaSetup = async () => {
    setError(null);
    setLoading(true);
    try {
      await verifyMfaSetup(mfaCode);
      const refreshed = await fetchMe();
      setUser(refreshed.user);
      setQrCode(null);
      setRecoveryCodes([]);
      setMfaCode('');
    } catch (err) {
      setError('Invalid MFA code.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    setError(null);
    setLoading(true);
    try {
      await disableMfa(disablePassword);
      const refreshed = await fetchMe();
      setUser(refreshed.user);
      setDisablePassword('');
    } catch (err) {
      setError('Unable to disable MFA.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setError(null);
    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError('Unable to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream-50/60">
      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-soft">
            <h1 className="text-3xl font-semibold text-ink-900">Security settings</h1>
            <p className="mt-2 text-sm text-ink-500">Manage MFA, password health, and recovery options.</p>

            {error && (
              <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            {user && (
              <div className="mt-6 grid gap-4 rounded-2xl bg-ink-50 px-4 py-4 text-sm text-ink-700">
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <p>
                  MFA status: {user.mfaEnabled ? 'Enabled' : 'Disabled'}
                </p>
                <p>
                  Password expires:{' '}
                  {user.passwordExpiresAt
                    ? new Date(user.passwordExpiresAt).toLocaleDateString()
                    : 'Not set'}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-soft">
            <h2 className="text-xl font-semibold text-ink-900">Multi-factor authentication</h2>
            <p className="mt-2 text-sm text-ink-500">
              Use a TOTP authenticator app to protect your account.
            </p>

            {!user?.mfaEnabled && (
              <div className="mt-4 space-y-4">
                <button
                  onClick={handleSetupMfa}
                  disabled={loading}
                  className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
                >
                  Start MFA setup
                </button>

                {qrCode && (
                  <div className="rounded-2xl border border-black/10 bg-ink-50 p-4">
                    <p className="text-sm text-ink-600">Scan this QR code with your authenticator app.</p>
                    <img src={qrCode} alt="MFA QR code" className="mt-3 h-48 w-48" />
                  </div>
                )}

                {recoveryCodes.length > 0 && (
                  <div className="rounded-2xl border border-black/10 bg-ink-50 p-4 text-sm text-ink-700">
                    <p className="font-semibold text-ink-900">Recovery codes</p>
                    <p className="mt-1 text-xs text-ink-500">
                      Save these securely. Each code can be used once.
                    </p>
                    <div className="mt-3 grid gap-2 text-xs">
                      {recoveryCodes.map((code) => (
                        <span key={code} className="rounded-xl bg-white px-3 py-2">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {qrCode && (
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      value={mfaCode}
                      onChange={(event) => setMfaCode(event.target.value)}
                      placeholder="Enter 6-digit code"
                      className="rounded-2xl border border-black/10 px-4 py-3 text-sm"
                    />
                    <button
                      onClick={handleVerifyMfaSetup}
                      disabled={loading}
                      className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
                    >
                      Verify and enable
                    </button>
                  </div>
                )}
              </div>
            )}

            {user?.mfaEnabled && (
              <div className="mt-4 flex flex-col gap-3">
                <input
                  type="password"
                  value={disablePassword}
                  onChange={(event) => setDisablePassword(event.target.value)}
                  placeholder="Confirm password to disable"
                  className="rounded-2xl border border-black/10 px-4 py-3 text-sm"
                />
                <button
                  onClick={handleDisableMfa}
                  disabled={loading}
                  className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                >
                  Disable MFA
                </button>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-soft">
            <h2 className="text-xl font-semibold text-ink-900">Password management</h2>
            <p className="mt-2 text-sm text-ink-500">
              Update your password regularly to stay secure.
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Current password"
                className="rounded-2xl border border-black/10 px-4 py-3 text-sm"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="New password"
                className="rounded-2xl border border-black/10 px-4 py-3 text-sm"
              />
              <PasswordStrength password={newPassword} />
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
              >
                Update password
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
