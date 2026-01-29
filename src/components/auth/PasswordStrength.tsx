'use client';

import { clsx } from 'clsx';

function evaluatePassword(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score += 1;
  return score;
}

export function PasswordStrength({ password }: { password: string }) {
  const score = evaluatePassword(password);
  const labels = ['Too weak', 'Weak', 'Okay', 'Strong', 'Very strong'];
  const label = password.length === 0 ? 'Enter a password' : labels[Math.max(0, score - 1)];

  return (
    <div className="mt-2">
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <span
            key={index}
            className={clsx(
              'h-1 flex-1 rounded-full bg-ink-200',
              score > index && 'bg-brand-500'
            )}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-ink-500">{label}</p>
    </div>
  );
}
