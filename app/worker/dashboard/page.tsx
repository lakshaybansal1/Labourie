'use client';

import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

type ApplicationStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN';

type BookingStatus =
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'REFUNDED'
  | 'PAID'
  | 'CANCELED';

type WorkerProfile = {
  id: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  serviceRadius: number;
  city: string | null;
  state: string | null;
  isAvailable: boolean;
  isVerified: boolean;
  name: string;
  email: string;
  image: string | null;
};

type Application = {
  id: string;
  note: string | null;
  proposedAmount: number | null;
  status: ApplicationStatus;
  createdAt: string;
  job: {
    id: string;
    title: string;
    category: string;
    description: string;
    budgetType: 'FIXED' | 'HOURLY';
    amount: number;
    scheduledAt: string;
    status: string;
    city: string | null;
    state: string | null;
    hirer: {
      id: string;
      name: string;
      image: string | null;
    };
    booking: {
      id: string;
      status: BookingStatus;
      agreedAmount: number;
    } | null;
  };
};

type Booking = {
  id: string;
  agreedAmount: number;
  status: BookingStatus;
  acceptedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  paidAt: string | null;
  job: {
    id: string;
    title: string;
    category: string;
    description: string;
    scheduledAt: string;
    city: string | null;
    state: string | null;
    hirer: {
      id: string;
      name: string;
      image: string | null;
    };
  };
};

type DashboardResponse = {
  profile?: WorkerProfile | null;
  applications?: Application[];
  bookings?: Booking[];
  error?: string;
};

function formatMoney(amountInCents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amountInCents % 100 === 0 ? 0 : 2,
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

function getLocation(city: string | null, state: string | null) {
  return [city, state].filter(Boolean).join(', ') || 'Location not provided';
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
  if (
    status === 'ACCEPTED' ||
    status === 'IN_PROGRESS' ||
    status === 'COMPLETED' ||
    status === 'PAID'
  ) {
    return 'bg-green-50 text-green-700';
  }

  if (status === 'PENDING') {
    return 'bg-yellow-50 text-yellow-700';
  }

  if (
    status === 'REJECTED' ||
    status === 'CANCELED' ||
    status === 'WITHDRAWN'
  ) {
    return 'bg-red-50 text-red-700';
  }

  return 'bg-gray-100 text-gray-700';
}

export default function WorkerDashboardPage() {
  const { data: session, status: sessionStatus } = useSession();

  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/worker/dashboard', {
        method: 'GET',
        cache: 'no-store',
      });

      const result = (await response.json()) as DashboardResponse;

      if (!response.ok) {
        throw new Error(
          result.error || 'Unable to load worker dashboard.',
        );
      }

      setProfile(result.profile ?? null);
      setApplications(
        Array.isArray(result.applications) ? result.applications : [],
      );
      setBookings(Array.isArray(result.bookings) ? result.bookings : []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Something went wrong while loading your dashboard.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      loadDashboard();
    }

    if (sessionStatus === 'unauthenticated') {
      setLoading(false);
    }
  }, [loadDashboard, sessionStatus]);

  const pendingApplications = useMemo(
    () =>
      applications.filter(
        (application) => application.status === 'PENDING',
      ),
    [applications],
  );

  const activeBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.status === 'ACCEPTED' ||
          booking.status === 'IN_PROGRESS',
      ),
    [bookings],
  );

  const completedBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.status === 'COMPLETED' ||
          booking.status === 'PAID',
      ),
    [bookings],
  );

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
            Sign in to view your worker dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Track your applications, bookings, and completed jobs.
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
            href="/worker"
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Edit profile
          </Link>
        </div>
      </header>

      <section className="container py-8 md:py-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Worker dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
              Your work activity
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Manage your profile, applications, and active jobs.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-600">
              Loading your dashboard...
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Pending applications
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-950">
                  {pendingApplications.length}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Active jobs</p>
                <p className="mt-2 text-3xl font-bold text-gray-950">
                  {activeBookings.length}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Completed jobs</p>
                <p className="mt-2 text-3xl font-bold text-gray-950">
                  {completedBookings.length}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
              <aside>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-950">
                    Worker profile
                  </h2>

                  {profile ? (
                    <>
                      <div className="mt-5 flex items-center gap-3">
                        {profile.image ? (
                          <img
                            src={profile.image}
                            alt={profile.name}
                            className="h-14 w-14 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                            {getInitials(profile.name)}
                          </div>
                        )}

                        <div>
                          <p className="font-bold text-gray-950">
                            {profile.name}
                          </p>

                          <p className="mt-0.5 text-sm text-gray-500">
                            {formatMoney(profile.hourlyRate)}/hr
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 space-y-4 text-sm">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Location
                          </p>
                          <p className="mt-1 text-gray-600">
                            {getLocation(profile.city, profile.state)}
                          </p>
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            Service radius
                          </p>
                          <p className="mt-1 text-gray-600">
                            {profile.serviceRadius} miles
                          </p>
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            Skills
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {profile.skills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            About
                          </p>
                          <p className="mt-1 leading-6 text-gray-600">
                            {profile.bio}
                          </p>
                        </div>
                      </div>

                      <Link
                        href="/worker"
                        className="mt-6 flex w-full items-center justify-center rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        Edit worker profile
                      </Link>
                    </>
                  ) : (
                    <div className="mt-5 rounded-xl bg-gray-50 p-5 text-center">
                      <p className="text-sm text-gray-600">
                        You have not created a worker profile yet.
                      </p>

                      <Link
                        href="/worker"
                        className="mt-4 inline-flex rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white"
                      >
                        Create profile
                      </Link>
                    </div>
                  )}
                </div>
              </aside>

              <div className="space-y-6">
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-gray-950">
                      Your applications
                    </h2>

                    <Link
                      href="/jobs"
                      className="text-sm font-semibold text-gray-600 hover:text-black hover:underline"
                    >
                      Find more jobs
                    </Link>
                  </div>

                  {applications.length === 0 ? (
                    <div className="mt-5 rounded-xl bg-gray-50 p-8 text-center">
                      <p className="text-sm text-gray-600">
                        You have not applied to any jobs yet.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-4">
                      {applications.map((application) => (
                        <article
                          key={application.id}
                          className="rounded-2xl border border-gray-200 p-5"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <Link
                                href={`/jobs/${application.job.id}`}
                                className="text-lg font-bold text-gray-950 hover:underline"
                              >
                                {application.job.title}
                              </Link>

                              <p className="mt-1 text-sm text-gray-500">
                                {application.job.category} ·{' '}
                                {getLocation(
                                  application.job.city,
                                  application.job.state,
                                )}
                              </p>

                              <p className="mt-2 text-sm text-gray-600">
                                Scheduled{' '}
                                {formatDate(application.job.scheduledAt)}
                              </p>
                            </div>

                            <span
                              className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                                application.status,
                              )}`}
                            >
                              {application.status}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                            <span>
                              Job budget:{' '}
                              <strong className="text-gray-950">
                                {formatMoney(application.job.amount)}
                                {application.job.budgetType === 'HOURLY'
                                  ? '/hr'
                                  : ''}
                              </strong>
                            </span>

                            <span>
                              Hirer:{' '}
                              <strong className="text-gray-950">
                                {application.job.hirer.name}
                              </strong>
                            </span>

                            <span>
                              Applied {formatDate(application.createdAt)}
                            </span>
                          </div>

                          {application.note && (
                            <div className="mt-4 rounded-xl bg-gray-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Your note
                              </p>
                              <p className="mt-2 text-sm leading-6 text-gray-700">
                                {application.note}
                              </p>
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  )}
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-950">
                    Active bookings
                  </h2>

                  {activeBookings.length === 0 ? (
                    <div className="mt-5 rounded-xl bg-gray-50 p-8 text-center">
                      <p className="text-sm text-gray-600">
                        You do not have any active bookings.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-4">
                      {activeBookings.map((booking) => (
                        <article
                          key={booking.id}
                          className="rounded-2xl border border-gray-200 p-5"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="text-lg font-bold text-gray-950">
                                {booking.job.title}
                              </h3>

                              <p className="mt-1 text-sm text-gray-500">
                                {booking.job.category} ·{' '}
                                {getLocation(
                                  booking.job.city,
                                  booking.job.state,
                                )}
                              </p>

                              <p className="mt-2 text-sm text-gray-600">
                                Scheduled {formatDate(booking.job.scheduledAt)}
                              </p>

                              <p className="mt-2 text-sm text-gray-600">
                                Hirer:{' '}
                                <span className="font-semibold text-gray-950">
                                  {booking.job.hirer.name}
                                </span>
                              </p>
                            </div>

                            <div className="sm:text-right">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                                  booking.status,
                                )}`}
                              >
                                {booking.status}
                              </span>

                              <p className="mt-3 text-lg font-bold text-gray-950">
                                {formatMoney(booking.agreedAmount)}
                              </p>

                              <Link
                                href={`/bookings/${booking.id}`}
                                className="mt-4 inline-flex rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                              >
                                Open booking
                              </Link>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-950">
                    Completed jobs
                  </h2>

                  {completedBookings.length === 0 ? (
                    <div className="mt-5 rounded-xl bg-gray-50 p-8 text-center">
                      <p className="text-sm text-gray-600">
                        Completed jobs will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-4">
                      {completedBookings.map((booking) => (
                        <article
                          key={booking.id}
                          className="rounded-2xl border border-gray-200 p-5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-bold text-gray-950">
                                {booking.job.title}
                              </h3>

                              <p className="mt-1 text-sm text-gray-500">
                                {booking.job.hirer.name}
                              </p>
                            </div>

                            <div className="text-right">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                                  booking.status,
                                )}`}
                              >
                                {booking.status}
                              </span>

                              <p className="mt-3 font-bold text-gray-950">
                                {formatMoney(booking.agreedAmount)}
                              </p>

                              <Link
                                href={`/bookings/${booking.id}`}
                                className="mt-4 inline-flex rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                              >
                                View booking
                              </Link>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}