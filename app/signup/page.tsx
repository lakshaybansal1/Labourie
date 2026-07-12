'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import React, { FormEvent, useState } from 'react';

type Role = 'WORKER' | 'HIRER';

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'WORKER' as Role,
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateForm = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (form.name.trim().length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          role: form.role,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || 'Unable to create your account.');
      }

      const signInResult = await signIn('credentials', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        redirect: false,
      });

      if (!signInResult || signInResult.error) {
        router.push('/signin');
        return;
      }

      router.push(form.role === 'WORKER' ? '/worker' : '/post');
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to create your account.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-lg">
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
            LL
          </div>

          <span className="text-xl font-bold">LaborLink</span>
        </Link>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-950">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Choose how you plan to use LaborLink.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 grid gap-5">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <div>
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Account type
              </span>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    role: 'WORKER' as const,
                    title: 'Worker',
                    description: 'Find local jobs and earn money.',
                  },
                  {
                    role: 'HIRER' as const,
                    title: 'Hirer',
                    description: 'Post jobs and hire local help.',
                  },
                ].map((option) => {
                  const selected = form.role === option.role;

                  return (
                    <button
                      key={option.role}
                      type="button"
                      onClick={() => updateForm('role', option.role)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        selected
                          ? 'border-black bg-gray-50 ring-2 ring-black/10'
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <p className="font-semibold text-gray-950">
                        {option.title}
                      </p>

                      <p className="mt-1 text-sm leading-5 text-gray-600">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Full name
              </span>

              <input
                required
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(event) => updateForm('name', event.target.value)}
                placeholder="Your full name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Email
              </span>

              <input
                required
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => updateForm('email', event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">
                  Password
                </span>

                <input
                  required
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={form.password}
                  onChange={(event) =>
                    updateForm('password', event.target.value)
                  }
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">
                  Confirm password
                </span>

                <input
                  required
                  type="password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={(event) =>
                    updateForm('confirmPassword', event.target.value)
                  }
                  placeholder="Repeat password"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/signin" className="font-semibold text-black hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}