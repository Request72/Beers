// Security summary (student note): profile updates go through authenticated routes
// and sensitive fields are encrypted by the backend.
'use client';

import { useEffect, useState } from 'react';
import { fetchProfile, updateProfile } from '@/lib/authApi';

type Profile = {
  email: string;
  role: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  address?: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile()
      .then((data) => setProfile(data.profile))
      .catch(() => setError('Unable to load profile.'));
  }, []);

  const handleChange = (field: keyof Profile, value: string) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!profile) return;
    setError(null);
    setLoading(true);
    try {
      const { name, avatarUrl, bio, phone, address } = profile;
      const updated = await updateProfile({ name, avatarUrl, bio, phone, address });
      setProfile(updated.profile);
    } catch (err) {
      setError('Unable to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <main className="min-h-screen bg-cream-50/60">
        <section className="container-page py-16">
          <p className="text-ink-500">Loading profile...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream-50/60">
      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-soft">
            <h1 className="text-3xl font-semibold text-ink-900">Profile</h1>
            <p className="mt-2 text-sm text-ink-500">Personalize your details securely.</p>

            {error && (
              <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <div className="mt-6 grid gap-4">
              <label className="text-sm font-medium text-ink-700">
                Name
                <input
                  type="text"
                  value={profile.name || ''}
                  onChange={(event) => handleChange('name', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm"
                />
              </label>

              <label className="text-sm font-medium text-ink-700">
                Avatar URL
                <input
                  type="url"
                  value={profile.avatarUrl || ''}
                  onChange={(event) => handleChange('avatarUrl', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm"
                />
              </label>

              <label className="text-sm font-medium text-ink-700">
                Bio
                <textarea
                  value={profile.bio || ''}
                  onChange={(event) => handleChange('bio', event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm"
                />
              </label>

              <label className="text-sm font-medium text-ink-700">
                Phone
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={(event) => handleChange('phone', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm"
                />
              </label>

              <label className="text-sm font-medium text-ink-700">
                Address
                <input
                  type="text"
                  value={profile.address || ''}
                  onChange={(event) => handleChange('address', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm"
                />
              </label>
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="mt-6 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
