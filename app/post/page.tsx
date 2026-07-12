'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

type Category = (typeof categories)[number];
type BudgetType = 'FIXED' | 'HOURLY';

type JobForm = {
  title: string;
  category: Category;
  budgetType: BudgetType;
  amount: string;
  scheduledAt: string;
  scheduleNote: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  description: string;
};

const initialForm: JobForm = {
  title: '',
  category: categories[0],
  budgetType: 'FIXED',
  amount: '',
  scheduledAt: '',
  scheduleNote: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  description: '',
};

export default function PostPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [form, setForm] = useState<JobForm>(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateForm = <K extends keyof JobForm>(
    key: K,
    value: JobForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setError('');
  };

  const validateForm = () => {
    const amount = Number(form.amount);

    if (!form.title.trim()) {
      return 'Please enter a job title.';
    }

    if (!form.description.trim()) {
      return 'Please enter a job description.';
    }

    if (!form.amount || Number.isNaN(amount) || amount <= 0) {
      return 'Please enter a valid budget amount.';
    }

    if (!form.scheduledAt) {
      return 'Please select a date and time.';
    }

    const scheduledDate = new Date(form.scheduledAt);

    if (Number.isNaN(scheduledDate.getTime())) {
      return 'Please select a valid date and time.';
    }

    if (scheduledDate.getTime() <= Date.now()) {
      return 'The scheduled date must be in the future.';
    }

    if (!form.address.trim()) {
      return 'Please enter an address or approximate location.';
    }

    return '';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (status === 'loading') {
      return;
    }

    if (!session?.user) {
      setError('You must sign in before posting a job.');
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category,
          description: form.description.trim(),
          budgetType: form.budgetType,
          amount: Math.round(Number(form.amount)),
          scheduledAt: new Date(form.scheduledAt).toISOString(),
          scheduleNote: form.scheduleNote.trim() || null,
          address: form.address.trim(),
          city: form.city.trim() || null,
          state: form.state.trim() || null,
          postalCode: form.postalCode.trim() || null,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || 'Unable to post the job.');
      }

      setForm(initialForm);
      router.push('/jobs');
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Something went wrong while posting the job.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
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
              Sign in to post a job
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              You need an account before you can create a job listing.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => signIn()}
                className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Sign in
              </button>

              <Link
                href="/"
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Back home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link
            href="/"
            className="mb-4 inline-flex text-sm font-medium text-gray-600 transition hover:text-black"
          >
            ← Back to LaborLink
          </Link>

          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
            LaborLink
          </p>

          <h1 className="text-3xl font-bold text-gray-900">Post a job</h1>

          <p className="mt-2 text-sm text-gray-600">
            Describe the work you need and connect with nearby workers.
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

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">
              Job title
            </span>

            <input
              required
              type="text"
              maxLength={100}
              value={form.title}
              onChange={(event) =>
                updateForm('title', event.target.value)
              }
              placeholder="e.g. Help move 10 boxes"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">
              Category
            </span>

            <select
              value={form.category}
              onChange={(event) =>
                updateForm('category', event.target.value as Category)
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-gray-700">
                Job description
              </span>

              <span className="text-xs text-gray-400">
                {form.description.length}/1000
              </span>
            </div>

            <textarea
              required
              rows={5}
              maxLength={1000}
              value={form.description}
              onChange={(event) =>
                updateForm('description', event.target.value)
              }
              placeholder="Describe the task, required tools, stairs, parking, or other details."
              className="w-full resize-none rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Budget type
              </span>

              <select
                value={form.budgetType}
                onChange={(event) =>
                  updateForm(
                    'budgetType',
                    event.target.value as BudgetType,
                  )
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              >
                <option value="FIXED">Fixed price</option>
                <option value="HOURLY">Hourly rate</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                {form.budgetType === 'FIXED'
                  ? 'Total budget'
                  : 'Hourly rate'}
              </span>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>

                <input
                  required
                  type="number"
                  min="1"
                  max="100000"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) =>
                    updateForm('amount', event.target.value)
                  }
                  placeholder={
                    form.budgetType === 'FIXED' ? '80.00' : '25.00'
                  }
                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-7 pr-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </div>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Date and time
              </span>

              <input
                required
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(event) =>
                  updateForm('scheduledAt', event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Schedule note
                <span className="ml-1 font-normal text-gray-400">
                  Optional
                </span>
              </span>

              <input
                type="text"
                maxLength={150}
                value={form.scheduleNote}
                onChange={(event) =>
                  updateForm('scheduleNote', event.target.value)
                }
                placeholder="e.g. Flexible by one hour"
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">
              Address or approximate location
            </span>

            <input
              required
              type="text"
              maxLength={200}
              value={form.address}
              onChange={(event) =>
                updateForm('address', event.target.value)
              }
              placeholder="e.g. Washington Avenue"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
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

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                ZIP code
              </span>

              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={form.postalCode}
                onChange={(event) =>
                  updateForm('postalCode', event.target.value)
                }
                placeholder="12222"
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Posting job...' : 'Post job'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}