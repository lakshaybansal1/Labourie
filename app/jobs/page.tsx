'use client';

import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  'All',
  'Moving & Lifting',
  'Cleaning',
  'Yard & Snow',
  'Handyman',
  'Event Setup',
  'Deliveries',
] as const;

type Category = (typeof categories)[number];
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
  };
  _count: {
    applications: number;
  };
};

type JobsResponse = {
  jobs?: Job[];
  error?: string;
};

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatScheduledDate(dateValue: string) {
  const date = new Date(dateValue);

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

function formatPostedDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const difference = Date.now() - date.getTime();
  const minutes = Math.floor(difference / 60000);
  const hours = Math.floor(difference / 3600000);
  const days = Math.floor(difference / 86400000);

  if (minutes < 1) {
    return 'Posted just now';
  }

  if (minutes < 60) {
    return `Posted ${minutes} minute${minutes === 1 ? '' : 's'} ago`;
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
  }).format(date)}`;
}

function getLocation(job: Job) {
  const locationParts = [job.city, job.state].filter(Boolean);

  if (locationParts.length > 0) {
    return locationParts.join(', ');
  }

  return job.address;
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

function JobCard({
  job,
  signedIn,
  router,
}: {
  job: Job;
  signedIn: boolean;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {job.category}
            </span>

            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
              {job.status}
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-950">{job.title}</h2>

          <p className="mt-2 text-sm text-gray-500">
            {formatPostedDate(job.createdAt)}
          </p>
        </div>

        <div className="shrink-0 sm:text-right">
          <p className="text-2xl font-bold text-gray-950">
            {formatMoney(job.amount)}
          </p>

          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            {job.budgetType === 'HOURLY' ? 'Per hour' : 'Fixed price'}
          </p>
        </div>
      </div>

      <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-700">
        {job.description}
      </p>

      <div className="mt-5 grid gap-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-700 sm:grid-cols-2">
        <div className="flex items-start gap-2">
          <span aria-hidden="true" className="mt-0.5">
            📅
          </span>

          <div>
            <p className="font-medium text-gray-900">Schedule</p>
            <p className="mt-0.5 text-gray-600">
              {formatScheduledDate(job.scheduledAt)}
            </p>

            {job.scheduleNote && (
              <p className="mt-1 text-xs text-gray-500">
                {job.scheduleNote}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span aria-hidden="true" className="mt-0.5">
            📍
          </span>

          <div>
            <p className="font-medium text-gray-900">Location</p>
            <p className="mt-0.5 text-gray-600">{getLocation(job)}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {job.hirer.image ? (
            <img
              src={job.hirer.image}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
              {getInitials(job.hirer.name)}
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {job.hirer.name}
            </p>

            <p className="text-xs text-gray-500">
              {job._count.applications}{' '}
              {job._count.applications === 1
                ? 'application'
                : 'applications'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/jobs/${job.id}`}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:flex-none"
          >
            View details
          </Link>

          {signedIn ? (
  <button
    type="button"
    onClick={async () => {
      try {
        const response = await fetch("/api/applications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId: job.id,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          alert(result.error || "Unable to apply.");
          return;
        }

        alert("Application submitted successfully!");

        router.push("/worker");
        router.refresh();
      } catch (error) {
        console.error(error);
        alert("Something went wrong.");
      }
    }}
    className="inline-flex flex-1 items-center justify-center rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 sm:flex-none"
  >
    Apply
  </button>
          ) : (
            <button
              type="button"
              onClick={() => signIn()}
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 sm:flex-none"
            >
              Sign in to apply
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function JobsPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<Category>('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'newest' | 'soonest' | 'highest'>(
    'newest',
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJobs = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/jobs', {
        method: 'GET',
        cache: 'no-store',
      });

      const result = (await response.json()) as JobsResponse;

      if (!response.ok) {
        throw new Error(result.error || 'Unable to load jobs.');
      }

      setJobs(Array.isArray(result.jobs) ? result.jobs : []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Something went wrong while loading jobs.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = jobs.filter((job) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        job.category === selectedCategory;

      const searchableText = [
        job.title,
        job.description,
        job.category,
        job.address,
        job.city,
        job.state,
        job.hirer.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((first, second) => {
      if (sort === 'soonest') {
        return (
          new Date(first.scheduledAt).getTime() -
          new Date(second.scheduledAt).getTime()
        );
      }

      if (sort === 'highest') {
        return second.amount - first.amount;
      }

      return (
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime()
      );
    });
  }, [jobs, search, selectedCategory, sort]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSort('newest');
  };

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

          <nav className="ml-auto hidden items-center gap-5 text-sm font-medium text-gray-600 sm:flex">
            <Link href="/" className="transition hover:text-black">
              Home
            </Link>

            <Link href="/worker" className="transition hover:text-black">
              Worker profile
            </Link>
          </nav>

          <Link
            href="/post"
            className="ml-auto rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 sm:ml-0"
          >
            Post a job
          </Link>
        </div>
      </header>

      <section className="border-b border-gray-200 bg-white">
        <div className="container py-10 md:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Local opportunities
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
                Browse available jobs
              </h1>

              <p className="mt-3 max-w-2xl text-gray-600">
                Find flexible local work that matches your skills,
                availability, and preferred pay.
              </p>
            </div>

            <div className="rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-700">
              <span className="font-bold text-gray-950">
                {jobs.length}
              </span>{' '}
              open {jobs.length === 1 ? 'job' : 'jobs'}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-8 md:py-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <label className="block">
              <span className="sr-only">Search jobs</span>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title, category, location, or hirer..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </label>

            <label className="block">
              <span className="sr-only">Sort jobs</span>

              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value as
                      | 'newest'
                      | 'soonest'
                      | 'highest',
                  )
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              >
                <option value="newest">Newest first</option>
                <option value="soonest">Starting soonest</option>
                <option value="highest">Highest paying</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => {
              const selected = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                    selected
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5"
          >
            <p className="font-semibold text-red-800">
              Unable to load jobs
            </p>

            <p className="mt-1 text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={loadJobs}
              className="mt-4 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {loading && (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6"
              >
                <div className="h-5 w-28 rounded bg-gray-200" />
                <div className="mt-4 h-7 w-2/3 rounded bg-gray-200" />
                <div className="mt-3 h-4 w-full rounded bg-gray-100" />
                <div className="mt-2 h-4 w-5/6 rounded bg-gray-100" />
                <div className="mt-6 h-24 rounded-xl bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredJobs.length > 0 && (
          <>
            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Showing{' '}
                <span className="font-semibold text-gray-950">
                  {filteredJobs.length}
                </span>{' '}
                {filteredJobs.length === 1 ? 'job' : 'jobs'}
              </p>

              <button
                type="button"
                onClick={loadJobs}
                className="text-sm font-semibold text-gray-700 transition hover:text-black hover:underline"
              >
                Refresh jobs
              </button>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  signedIn={Boolean(session?.user)}
                  router={router}
                />
              ))}
            </div>
          </>
        )}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
              🔎
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-950">
              No jobs found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              Try changing your search or category. New jobs will appear
              here after they are posted.
            </p>

            {(search || selectedCategory !== 'All') && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Clear filters
              </button>
            )}

            {jobs.length === 0 && (
              <div className="mt-5">
                <Link
                  href="/post"
                  className="inline-flex rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Post the first job
                </Link>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}