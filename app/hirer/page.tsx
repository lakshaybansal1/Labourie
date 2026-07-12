'use client';

import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';

type AppStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN';

type JobStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELED'
  | 'DISPUTED';

type WorkerProfile = {
  bio: string;
  skills: string[];
  hourlyRate: number;
  serviceRadius: number;
  city: string | null;
  state: string | null;
  isAvailable: boolean;
  isVerified: boolean;
};

type Application = {
  id: string;
  note: string | null;
  proposedAmount: number | null;
  status: AppStatus;
  createdAt: string;
  worker: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    workerProfile: WorkerProfile | null;
  };
};

type HirerJob = {
  id: string;
  title: string;
  category: string;
  description: string;
  budgetType: 'FIXED' | 'HOURLY';
  amount: number;
  scheduledAt: string;
  status: JobStatus;
  createdAt: string;
  _count: {
    applications: number;
  };
  booking: {
    id: string;
    status: string;
    agreedAmount: number;
    worker: {
      id: string;
      name: string;
      image: string | null;
    };
  } | null;
};

type HirerJobsResponse = {
  jobs?: HirerJob[];
  error?: string;
};

type ApplicationsResponse = {
  applications?: Application[];
  error?: string;
};

function formatMoney(amountInCents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountInCents / 100);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'LL'
  );
}

function statusClasses(status: string) {
  if (status === 'OPEN' || status === 'ACCEPTED') {
    return 'bg-green-50 text-green-700';
  }

  if (status === 'PENDING') {
    return 'bg-yellow-50 text-yellow-700';
  }

  if (status === 'REJECTED' || status === 'CANCELED') {
    return 'bg-red-50 text-red-700';
  }

  return 'bg-gray-100 text-gray-700';
}

export default function HirerPage() {
  const { data: session, status: sessionStatus } = useSession();

  const [jobs, setJobs] = useState<HirerJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    null,
  );
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApplications, setLoadingApplications] =
    useState(false);
  const [updatingApplicationId, setUpdatingApplicationId] =
    useState<string | null>(null);
  const [error, setError] = useState('');
  const [applicationError, setApplicationError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedJob =
    jobs.find((job) => job.id === selectedJobId) ?? null;

  const loadJobs = useCallback(async () => {
    setLoadingJobs(true);
    setError('');

    try {
      const response = await fetch('/api/hirer/jobs', {
        cache: 'no-store',
      });

      const result = (await response.json()) as HirerJobsResponse;

      if (!response.ok) {
        throw new Error(result.error || 'Unable to load your jobs.');
      }

      const loadedJobs = Array.isArray(result.jobs)
        ? result.jobs
        : [];

      setJobs(loadedJobs);

      setSelectedJobId((current) => {
        if (
          current &&
          loadedJobs.some((job) => job.id === current)
        ) {
          return current;
        }

        return loadedJobs[0]?.id ?? null;
      });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Something went wrong while loading your jobs.',
      );
    } finally {
      setLoadingJobs(false);
    }
  }, []);

  const loadApplications = useCallback(async (jobId: string) => {
    setLoadingApplications(true);
    setApplicationError('');
    setSuccess('');

    try {
      const response = await fetch(
        `/api/jobs/${jobId}/applications`,
        {
          cache: 'no-store',
        },
      );

      const result =
        (await response.json()) as ApplicationsResponse;

      if (!response.ok) {
        throw new Error(
          result.error || 'Unable to load applications.',
        );
      }

      setApplications(
        Array.isArray(result.applications)
          ? result.applications
          : [],
      );
    } catch (loadError) {
      setApplicationError(
        loadError instanceof Error
          ? loadError.message
          : 'Something went wrong while loading applications.',
      );
    } finally {
      setLoadingApplications(false);
    }
  }, []);

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      loadJobs();
    }

    if (sessionStatus === 'unauthenticated') {
      setLoadingJobs(false);
    }
  }, [loadJobs, sessionStatus]);

  useEffect(() => {
    if (selectedJobId) {
      loadApplications(selectedJobId);
    } else {
      setApplications([]);
    }
  }, [loadApplications, selectedJobId]);

  const updateApplication = async (
    applicationId: string,
    status: 'ACCEPTED' | 'REJECTED',
  ) => {
    setUpdatingApplicationId(applicationId);
    setApplicationError('');
    setSuccess('');

    try {
      const response = await fetch(
        `/api/applications/${applicationId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status,
          }),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error || 'Unable to update the application.',
        );
      }

      setSuccess(
        status === 'ACCEPTED'
          ? 'Worker hired successfully.'
          : 'Application rejected.',
      );

      if (selectedJobId) {
        await Promise.all([
          loadApplications(selectedJobId),
          loadJobs(),
        ]);
      }
    } catch (updateError) {
      setApplicationError(
        updateError instanceof Error
          ? updateError.message
          : 'Something went wrong.',
      );
    } finally {
      setUpdatingApplicationId(null);
    }
  };

  if (sessionStatus === 'loading') {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <p className="text-center text-sm text-gray-600">
          Loading your account...
        </p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-950">
            Sign in to manage your jobs
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            View applicants and hire workers from your dashboard.
          </p>

          <button
            type="button"
            onClick={() => signIn()}
            className="mt-6 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white"
          >
            Sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="container flex min-h-16 items-center gap-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
              LL
            </div>

            <span className="text-lg font-bold">LaborLink</span>
          </Link>

          <Link
            href="/jobs"
            className="ml-auto text-sm font-semibold text-gray-600 hover:text-black"
          >
            Browse jobs
          </Link>

          <Link
            href="/post"
            className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white"
          >
            Post a job
          </Link>
        </div>
      </header>

      <section className="container py-8 md:py-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Hirer dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-950">
            Manage your jobs
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Review applications and select the best worker.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loadingJobs ? (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8">
            <p className="text-sm text-gray-600">
              Loading your jobs...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <h2 className="text-xl font-bold text-gray-950">
              You have not posted any jobs
            </h2>

            <Link
              href="/post"
              className="mt-5 inline-flex rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white"
            >
              Post your first job
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="space-y-3">
              {jobs.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => setSelectedJobId(job.id)}
                  className={`w-full rounded-2xl border p-5 text-left transition ${
                    selectedJobId === job.id
                      ? 'border-black bg-white shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-bold text-gray-950">
                      {job.title}
                    </h2>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses(
                        job.status,
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    {formatMoney(job.amount)}
                    {job.budgetType === 'HOURLY' ? '/hr' : ''}
                  </p>

                  <p className="mt-3 text-xs text-gray-500">
                    {job._count.applications}{' '}
                    {job._count.applications === 1
                      ? 'application'
                      : 'applications'}
                  </p>

                  {job.booking && (
                    <p className="mt-3 text-sm font-medium text-green-700">
                      Hired: {job.booking.worker.name}
                    </p>
                  )}
                </button>
              ))}
            </aside>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              {selectedJob && (
                <>
                  <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-950">
                        {selectedJob.title}
                      </h2>

                      <p className="mt-2 text-sm text-gray-600">
                        Scheduled {formatDate(selectedJob.scheduledAt)}
                      </p>
                    </div>

                    <Link
                      href={`/jobs/${selectedJob.id}`}
                      className="rounded-xl border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      View job
                    </Link>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-gray-950">
                      Applicants
                    </h3>

                    {applicationError && (
                      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {applicationError}
                      </div>
                    )}

                    {success && (
                      <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        {success}
                      </div>
                    )}

                    {loadingApplications ? (
                      <p className="mt-6 text-sm text-gray-600">
                        Loading applications...
                      </p>
                    ) : applications.length === 0 ? (
                      <div className="mt-6 rounded-xl bg-gray-50 p-8 text-center">
                        <p className="text-sm text-gray-600">
                          No workers have applied yet.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-5 space-y-4">
                        {applications.map((application) => {
                          const profile =
                            application.worker.workerProfile;

                          const busy =
                            updatingApplicationId ===
                            application.id;

                          return (
                            <article
                              key={application.id}
                              className="rounded-2xl border border-gray-200 p-5"
                            >
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex items-center gap-3">
                                  {application.worker.image ? (
                                    <img
                                      src={application.worker.image}
                                      alt={application.worker.name}
                                      className="h-12 w-12 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                                      {getInitials(
                                        application.worker.name,
                                      )}
                                    </div>
                                  )}

                                  <div>
                                    <p className="font-bold text-gray-950">
                                      {application.worker.name}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                      Applied{' '}
                                      {formatDate(
                                        application.createdAt,
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <span
                                  className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                                    application.status,
                                  )}`}
                                >
                                  {application.status}
                                </span>
                              </div>

                              {profile && (
                                <div className="mt-5 grid gap-3 rounded-xl bg-gray-50 p-4 text-sm sm:grid-cols-2">
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      Hourly rate
                                    </p>
                                    <p className="mt-1 text-gray-600">
                                      {formatMoney(
                                        profile.hourlyRate,
                                      )}
                                      /hr
                                    </p>
                                  </div>

                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      Location
                                    </p>
                                    <p className="mt-1 text-gray-600">
                                      {[profile.city, profile.state]
                                        .filter(Boolean)
                                        .join(', ') ||
                                        'Not provided'}
                                    </p>
                                  </div>

                                  <div className="sm:col-span-2">
                                    <p className="font-semibold text-gray-900">
                                      Skills
                                    </p>
                                    <p className="mt-1 text-gray-600">
                                      {profile.skills.join(', ')}
                                    </p>
                                  </div>

                                  <div className="sm:col-span-2">
                                    <p className="font-semibold text-gray-900">
                                      About
                                    </p>
                                    <p className="mt-1 leading-6 text-gray-600">
                                      {profile.bio}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {application.note && (
                                <div className="mt-4">
                                  <p className="text-sm font-semibold text-gray-900">
                                    Application note
                                  </p>
                                  <p className="mt-1 text-sm leading-6 text-gray-600">
                                    {application.note}
                                  </p>
                                </div>
                              )}

                              {application.proposedAmount && (
                                <p className="mt-4 text-sm text-gray-700">
                                  Proposed amount:{' '}
                                  <span className="font-bold">
                                    {formatMoney(
                                      application.proposedAmount,
                                    )}
                                  </span>
                                </p>
                              )}

                              {application.status === 'PENDING' && (
                                <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() =>
                                      updateApplication(
                                        application.id,
                                        'REJECTED',
                                      )
                                    }
                                    className="rounded-xl border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                                  >
                                    Reject
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      busy ||
                                      selectedJob.status !== 'OPEN'
                                    }
                                    onClick={() =>
                                      updateApplication(
                                        application.id,
                                        'ACCEPTED',
                                      )
                                    }
                                    className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                                  >
                                    {busy
                                      ? 'Updating...'
                                      : 'Accept and hire'}
                                  </button>
                                </div>
                              )}
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}