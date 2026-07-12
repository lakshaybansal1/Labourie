'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';

type BookingStatus =
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'REFUNDED'
  | 'PAID'
  | 'CANCELED';

type Booking = {
  id: string;
  agreedAmount: number;
  status: BookingStatus;
  acceptedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  paidAt: string | null;
  createdAt: string;
  worker: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  job: {
    id: string;
    hirerId: string;
    title: string;
    category: string;
    description: string;
    budgetType: 'FIXED' | 'HOURLY';
    amount: number;
    scheduledAt: string;
    scheduleNote: string | null;
    address: string;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    status: string;
    hirer: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
  };
};

type BookingResponse = {
  booking?: Booking;
  currentUserId?: string;
  error?: string;
};

function formatMoney(amountInCents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amountInCents % 100 === 0 ? 0 : 2,
  }).format(amountInCents / 100);
}

function formatDate(value: string | null) {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
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

function getLocation(booking: Booking) {
  return [
    booking.job.address,
    booking.job.city,
    booking.job.state,
    booking.job.postalCode,
  ]
    .filter(Boolean)
    .join(', ');
}

function statusClasses(status: BookingStatus) {
  if (
    status === 'ACCEPTED' ||
    status === 'IN_PROGRESS' ||
    status === 'COMPLETED' ||
    status === 'PAID'
  ) {
    return 'bg-green-50 text-green-700';
  }

  if (
    status === 'CANCELED' ||
    status === 'DISPUTED' ||
    status === 'REFUNDED'
  ) {
    return 'bg-red-50 text-red-700';
  }

  return 'bg-gray-100 text-gray-700';
}

export default function BookingDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const bookingId =
    typeof params.id === 'string' ? params.id.trim() : '';

  const loadBooking = useCallback(async () => {
    if (!bookingId) {
      setError('Invalid booking ID.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'GET',
        cache: 'no-store',
      });

      const result = (await response.json()) as BookingResponse;

      if (!response.ok) {
        throw new Error(result.error || 'Unable to load booking.');
      }

      if (!result.booking) {
        throw new Error('Booking not found.');
      }

      setBooking(result.booking);
      setCurrentUserId(result.currentUserId ?? '');
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Something went wrong while loading the booking.',
      );
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      loadBooking();
    }

    if (sessionStatus === 'unauthenticated') {
      setLoading(false);
    }
  }, [loadBooking, sessionStatus]);

  const updateStatus = async (
    status: 'IN_PROGRESS' | 'COMPLETED',
  ) => {
    if (!booking) {
      return;
    }

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
        }),
      });

      const result = (await response.json()) as BookingResponse;

      if (!response.ok) {
        throw new Error(
          result.error || 'Unable to update booking.',
        );
      }

      if (result.booking) {
        setBooking(result.booking);
      } else {
        await loadBooking();
      }

      setSuccess(
        status === 'IN_PROGRESS'
          ? 'Job started successfully.'
          : 'Job marked as completed.',
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Something went wrong while updating the booking.',
      );
    } finally {
      setUpdating(false);
    }
  };

  if (sessionStatus === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="h-5 w-28 rounded bg-gray-200" />
            <div className="mt-5 h-10 w-2/3 rounded bg-gray-200" />
            <div className="mt-8 h-32 rounded-xl bg-gray-100" />
          </div>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-950">
            Sign in to view this booking
          </h1>

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

  if (error && !booking) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-950">
            Unable to load booking
          </h1>

          <p className="mt-2 text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  if (!booking) {
    return null;
  }

  const isWorker = currentUserId === booking.worker.id;
  const isHirer = currentUserId === booking.job.hirer.id;

  const canStart =
    isWorker && booking.status === 'ACCEPTED';

  const canComplete =
    (isWorker || isHirer) &&
    booking.status === 'IN_PROGRESS';

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
            href={isWorker ? '/worker/dashboard' : '/hirer'}
            className="ml-auto text-sm font-semibold text-gray-600 hover:text-black"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <section className="container py-8 md:py-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 text-sm font-semibold text-gray-600 hover:text-black"
        >
          ← Back
        </button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  {booking.job.category}
                </span>

                <h1 className="mt-4 text-3xl font-bold text-gray-950">
                  {booking.job.title}
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Scheduled {formatDate(booking.job.scheduledAt)}
                </p>
              </div>

              <span
                className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                  booking.status,
                )}`}
              >
                {booking.status}
              </span>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-8">
              <h2 className="text-xl font-bold text-gray-950">
                Job description
              </h2>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                {booking.job.description}
              </p>
            </div>

            <div className="mt-8 grid gap-4 border-t border-gray-100 pt-8 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900">
                  Date and time
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  {formatDate(booking.job.scheduledAt)}
                </p>

                {booking.job.scheduleNote && (
                  <p className="mt-2 text-xs text-gray-500">
                    {booking.job.scheduleNote}
                  </p>
                )}
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900">
                  Location
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  {getLocation(booking)}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Accepted
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  {formatDate(booking.acceptedAt)}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Started
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  {formatDate(booking.startedAt)}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Completed
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  {formatDate(booking.completedAt)}
                </p>
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Agreed amount
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-950">
                {formatMoney(booking.agreedAmount)}
              </p>

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                  {success}
                </div>
              )}

              {canStart && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => updateStatus('IN_PROGRESS')}
                  className="mt-6 w-full rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                >
                  {updating ? 'Starting...' : 'Start job'}
                </button>
              )}

              {canComplete && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => updateStatus('COMPLETED')}
                  className="mt-6 w-full rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                >
                  {updating ? 'Completing...' : 'Complete job'}
                </button>
              )}

              {booking.status === 'COMPLETED' && (
                <Link
                  href={`/reviews/new/${booking.id}`}
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
                >
                  Leave a review
                </Link>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">
                Worker
              </p>

              <div className="mt-4 flex items-center gap-3">
                {booking.worker.image ? (
                  <img
                    src={booking.worker.image}
                    alt={booking.worker.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                    {getInitials(booking.worker.name)}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-gray-950">
                    {booking.worker.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Worker
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">
                Hirer
              </p>

              <div className="mt-4 flex items-center gap-3">
                {booking.job.hirer.image ? (
                  <img
                    src={booking.job.hirer.image}
                    alt={booking.job.hirer.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                    {getInitials(booking.job.hirer.name)}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-gray-950">
                    {booking.job.hirer.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Hirer
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}