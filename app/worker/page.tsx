'use client';

import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import React, { FormEvent, useState } from 'react';

const categories = [
  'Moving & Lifting',
  'Cleaning',
  'Yard & Snow',
  'Handyman',
  'Event Setup',
  'Deliveries',
] as const;

type WorkerForm = {
  name: string;
  bio: string;
  hourlyRate: string;
  serviceRadius: string;
  city: string;
  state: string;
  skills: string[];
};

const initialForm: WorkerForm = {
  name: '',
  bio: '',
  hourlyRate: '25',
  serviceRadius: '5',
  city: '',
  state: '',
  skills: ['Moving & Lifting'],
};

export default function WorkerPage() {
  const { data: session, status } = useSession();

  const [form, setForm] = useState<WorkerForm>(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateForm = <K extends keyof WorkerForm>(
    key: K,
    value: WorkerForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setError('');
    setSuccess('');
  };

  const toggleSkill = (skill: string) => {
    setForm((current) => ({
      ...current,
      skills: current.skills.includes(skill)
        ? current.skills.filter((item) => item !== skill)
        : [...current.skills, skill],
    }));

    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!session?.user) {
      setError('You must sign in before creating a worker profile.');
      return;
    }

    const hourlyRate = Number(form.hourlyRate);
    const serviceRadius = Number(form.serviceRadius);

    if (!form.name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!form.bio.trim()) {
      setError('Please add a short description about yourself.');
      return;
    }

    if (
      !form.hourlyRate ||
      Number.isNaN(hourlyRate) ||
      hourlyRate < 10
    ) {
      setError('Please enter an hourly rate of at least $10.');
      return;
    }

    if (
      !form.serviceRadius ||
      Number.isNaN(serviceRadius) ||
      serviceRadius < 1
    ) {
      setError('Please enter a valid service radius.');
      return;
    }

    if (form.skills.length === 0) {
      setError('Please select at least one skill.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/workers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          bio: form.bio.trim(),
          hourlyRate: Math.round(hourlyRate),
          serviceRadius: Math.round(serviceRadius),
          city: form.city.trim() || null,
          state: form.state.trim() || null,
          skills: form.skills,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error || 'Unable to save your worker profile.',
        );
      }

      setSuccess('Your worker profile has been saved successfully.');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Something went wrong while saving your profile.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-600">Loading your account...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-black font-bold text-white">
              LL
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Sign in to create a worker profile
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Create a profile to show your skills and apply for local jobs.
            </p>

            <button
              type="button"
              onClick={() => signIn()}
              className="mt-6 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Sign in
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href="/"
            className="mb-4 inline-flex text-sm font-medium text-gray-600 transition hover:text-black"
          >
            ← Back to LaborLink
          </Link>

          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Worker profile
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            Create your worker profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Tell hirers about your skills, location, and preferred hourly rate.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">
              Full name
            </span>

            <input
              required
              type="text"
              maxLength={100}
              value={form.name}
              onChange={(event) =>
                updateForm('name', event.target.value)
              }
              placeholder="e.g. Lakshay Bansal"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </label>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-gray-700">
                Skills
              </span>

              <span className="text-xs text-gray-500">
                {form.skills.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const selected = form.skills.includes(category);

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleSkill(category)}
                    className={`rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                      selected
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {selected ? '✓ ' : ''}
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Hourly rate
              </span>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>

                <input
                  required
                  type="number"
                  min="10"
                  max="500"
                  step="0.01"
                  value={form.hourlyRate}
                  onChange={(event) =>
                    updateForm('hourlyRate', event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-7 pr-14 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  /hr
                </span>
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Service radius
              </span>

              <div className="relative">
                <input
                  required
                  type="number"
                  min="1"
                  max="100"
                  value={form.serviceRadius}
                  onChange={(event) =>
                    updateForm('serviceRadius', event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 pr-16 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  miles
                </span>
              </div>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                City
              </span>

              <input
                type="text"
                maxLength={100}
                value={form.city}
                onChange={(event) =>
                  updateForm('city', event.target.value)
                }
                placeholder="Albany"
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                State
              </span>

              <input
                type="text"
                maxLength={50}
                value={form.state}
                onChange={(event) =>
                  updateForm('state', event.target.value)
                }
                placeholder="NY"
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </label>
          </div>

          <label className="block">
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-gray-700">
                About you
              </span>

              <span className="text-xs text-gray-400">
                {form.bio.length}/500
              </span>
            </div>

            <textarea
              required
              rows={5}
              maxLength={500}
              value={form.bio}
              onChange={(event) =>
                updateForm('bio', event.target.value)
              }
              placeholder="Describe your experience, work style, and why hirers should choose you."
              className="w-full resize-none rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <Link
              href="/jobs"
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Saving profile...' : 'Save worker profile'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}