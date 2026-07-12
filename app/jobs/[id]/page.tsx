'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

type BudgetType = 'FIXED' | 'HOURLY';

type Job = {
  id: string;
  title: string;
  category: string;
  description: string;
  budgetType: BudgetType;
  amount: number;
  scheduledAt: string;
  scheduleNote: string | null;
  address: string;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  status: string;
  createdAt: string;
  hirer: {
    id: string;
    name: string;
    image: string | null;
    createdAt: string;
  };
  _count: {
    applications: number;
  };
};

type JobResponse = {
  job?: Job;
  error?: string;
};

function formatMoney(amountInCents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amountInCents % 100 === 0 ? 0 : 2,
  }).format(amountInCents / 100);
}

function formatDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatPostedDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const difference = Date.now() - date.getTime();
  const minutes = Math.floor(difference / 60_000);
  const hours = Math.floor(difference / 3_600_000);
  const days = Math.floor(difference / 86_400_000);

  if (minutes < 1) {
    return 'Posted just now';
  }

  if (minutes < 60) {
    return `Posted ${minutes} minute${
      minutes === 1 ? '' : 's'
    } ago`;
  }

  if (hours < 24) {
    return `Posted ${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  if (days < 7) {
    return `Posted ${days} day${days === 1 ? '' : 's'} ago`;
  }

  return `Posted ${new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)}`;
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return initials || 'LL';
}

function getLocation(job: Job) {
  const parts = [
    job.address,
    job.city,
    job.state,
    job.postalCode,
  ].filter(Boolean);

  return parts.join(', ');
}

export default function JobDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [applyError, setApplyError] = useState('');
  const [success, setSuccess] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const jobId =
    typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    const loadJob = async () => {
      if (!jobId) {
        setPageError('Invalid job ID.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setPageError('');

      try {
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: 'GET',
          cache: 'no-store',
        });

        const result = (await response.json()) as JobResponse;

        if (!response.ok) {
          throw new Error(result.error || 'Unable to load the job.');
        }

        if (!result.job) {
          throw new Error('Job not found.');
        }

        setJob(result.job);
      } catch (error) {
        setPageError(
          error instanceof Error
            ? error.message
            : 'Something went wrong while loading the job.',
        );
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  const handleApply = async () => {
    setApplyError('');
    setSuccess('');

    if (sessionStatus === 'loading') {
      return;
    }

    if (!session?.user) {
      await signIn();
      return;
    }

    if (!job) {
      return;
    }

    setIsApplying(true);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: job.id,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error || 'Unable to submit your application.',
        );
      }

      setSuccess('Your application was submitted successfully.');

      setJob((current) =>
        current
          ? {
              ...current,
              _count: {
                applications:
                  current._count.applications + 1,
              },
            }
          : current,
      );
    } catch (error) {
      setApplyError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while applying.',
      );
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="h-5 w-32 rounded bg-gray-200" />
            <div className="mt-5 h-10 w-2/3 rounded bg-gray-200" />
            <div className="mt-4 h-5 w-40 rounded bg-gray-100" />
            <div className="mt-8 h-32 rounded-xl bg-gray-100" />
            <div className="mt-6 h-24 rounded-xl bg-gray-100" />
          </div>
        </div>
      </main>
    );
  }

  if (pageError || !job) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">
              ⚠️
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-950">
              Unable to load job
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              {pageError || 'The requested job could not be found.'}
            </p>

            <Link
              href="/jobs"
              className="mt-6 inline-flex rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Back to jobs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isOpen = job.status === 'OPEN';

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="container flex min-h-16 items-center gap-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
              LL
            </div>

            <span className="text-lg font-bold tracking-tight">
              LaborLink
            </span>
          </Link>

          <Link
            href="/jobs"
            className="ml-auto text-sm font-semibold text-gray-600 transition hover:text-black"
          >
            Browse jobs
          </Link>

          <Link
            href="/post"
            className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Post a job
          </Link>
        </div>
      </header>

      <section className="container py-8 md:py-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex text-sm font-semibold text-gray-600 transition hover:text-black"
        >
          ← Back
        </button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                {job.category}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isOpen
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {job.status}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              {job.title}
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              {formatPostedDate(job.createdAt)}
            </p>

            <div className="mt-8 border-t border-gray-100 pt-8">
              <h2 className="text-xl font-bold text-gray-950">
                Job description
              </h2>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                {job.description}
              </p>
            </div>

            <div className="mt-8 grid gap-4 border-t border-gray-100 pt-8 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-950">
                  📅 Date and time
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {formatDate(job.scheduledAt)}
                </p>

                {job.scheduleNote && (
                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    {job.scheduleNote}
                  </p>
                )}
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-950">
                  📍 Location
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {getLocation(job)}
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                {job.budgetType === 'HOURLY'
                  ? 'Hourly rate'
                  : 'Total budget'}
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-950">
                {formatMoney(job.amount)}
              </p>

              {job.budgetType === 'HOURLY' && (
                <p className="mt-1 text-sm text-gray-500">per hour</p>
              )}

              <p className="mt-5 text-sm text-gray-600">
                {job._count.applications}{' '}
                {job._count.applications === 1
                  ? 'person has'
                  : 'people have'}{' '}
                applied
              </p>

              {applyError && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {applyError}
                </div>
              )}

              {success && (
                <div
                  role="status"
                  className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                >
                  {success}
                </div>
              )}

              <button
                type="button"
                onClick={handleApply}
                disabled={
                  isApplying ||
                  sessionStatus === 'loading' ||
                  !isOpen ||
                  Boolean(success)
                }
                className="mt-6 w-full rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isApplying
                  ? 'Submitting...'
                  : success
                    ? 'Application submitted'
                    : !isOpen
                      ? 'Job is no longer open'
                      : session?.user
                        ? 'Apply for this job'
                        : 'Sign in to apply'}
              </button>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">
                Posted by
              </p>

              <div className="mt-4 flex items-center gap-3">
                {job.hirer.image ? (
                  <img
                    src={job.hirer.image}
                    alt={job.hirer.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                    {getInitials(job.hirer.name)}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-gray-950">
                    {job.hirer.name}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    LaborLink member
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/jobs"
              className="flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Browse more jobs
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}