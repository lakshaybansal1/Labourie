'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

type IconName =
  | 'search'
  | 'message'
  | 'payment'
  | 'star'
  | 'verified'
  | 'support'
  | 'arrow'
  | 'check';

type Feature = {
  title: string;
  description: string;
  icon: IconName;
};

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

const categories = [
  'Moving & Lifting',
  'Cleaning',
  'Yard & Snow',
  'Handyman',
  'Event Setup',
  'Deliveries',
];

const features: Feature[] = [
  {
    title: 'Quick Job Posting',
    description:
      'Create a job in minutes with your budget, schedule, location, and task requirements.',
    icon: 'search',
  },
  {
    title: 'In-app Messaging',
    description:
      'Discuss job details, schedules, and expectations directly with applicants.',
    icon: 'message',
  },
  {
    title: 'Secure Payments',
    description:
      'Payments can be securely managed after a worker is selected for the job.',
    icon: 'payment',
  },
  {
    title: 'Ratings & Reviews',
    description:
      'Build trust through feedback from completed jobs and previous customers.',
    icon: 'star',
  },
  {
    title: 'Worker Profiles',
    description:
      'Workers can display their skills, rates, service areas, and experience.',
    icon: 'verified',
  },
  {
    title: 'Safety & Support',
    description:
      'Get assistance with job issues, payment concerns, or account questions.',
    icon: 'support',
  },
];

function formatMoney(amountInCents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amountInCents % 100 === 0 ? 0 : 2,
  }).format(amountInCents / 100);
}

function formatSchedule(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Schedule unavailable';
  }

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function getLocation(job: Job) {
  const location = [job.city, job.state].filter(Boolean).join(', ');

  return location || job.address || 'Location available after acceptance';
}

function Icon({
  name,
  className = 'h-5 w-5',
}: {
  name: IconName;
  className?: string;
}) {
  const commonProps = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (name) {
    case 'search':
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );

    case 'message':
      return (
        <svg {...commonProps}>
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      );

    case 'payment':
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18" />
          <path d="M7 15h3" />
        </svg>
      );

    case 'star':
      return (
        <svg {...commonProps}>
          <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
        </svg>
      );

    case 'verified':
      return (
        <svg {...commonProps}>
          <path d="M12 3 5 6v5c0 4.7 2.9 8.1 7 10 4.1-1.9 7-5.3 7-10V6z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case 'support':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 9a3.5 3.5 0 1 1 5.4 2.9c-1.2.8-1.9 1.3-1.9 2.6" />
          <path d="M12 18h.01" />
        </svg>
      );

    case 'arrow':
      return (
        <svg {...commonProps}>
          <path d="M5 12h14" />
          <path d="m14 7 5 5-5 5" />
        </svg>
      );

    case 'check':
      return (
        <svg {...commonProps}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    default:
      return null;
  }
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
      {children}
    </span>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
        {number}
      </div>

      <div>
        <h4 className="font-semibold text-gray-950">{title}</h4>
        <p className="mt-1 text-sm leading-6 text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default function Page() {
  const { data: session, status } = useSession();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState('');

  const userName =
    session?.user?.name?.split(' ')[0] || session?.user?.email || 'there';

  const loadJobs = async () => {
    setJobsLoading(true);
    setJobsError('');

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
    } catch (error) {
      setJobsError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while loading jobs.',
      );
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const recentJobs = useMemo(() => jobs.slice(0, 3), [jobs]);

  const averageJobValue = useMemo(() => {
    if (jobs.length === 0) {
      return 0;
    }

    const total = jobs.reduce((sum, job) => sum + job.amount, 0);

    return Math.round(total / jobs.length);
  }, [jobs]);

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
        <div className="container flex min-h-16 items-center gap-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-sm font-bold text-white shadow-sm">
              LL
            </div>

            <span className="text-lg font-bold tracking-tight">LaborLink</span>
          </Link>

          <nav className="ml-auto hidden items-center gap-6 text-sm font-medium text-gray-600 lg:flex">
            <a href="#how" className="transition-colors hover:text-black">
              How it works
            </a>

            <a href="#features" className="transition-colors hover:text-black">
              Features
            </a>

            <Link
              href="/jobs"
              className="transition-colors hover:text-black"
            >
              Browse jobs
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-4">
            {status !== 'loading' &&
              (session ? (
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="max-w-32 truncate text-sm text-gray-600">
                    Hi, {userName}
                  </span>

                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => signOut()}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-ghost hidden sm:inline-flex"
                  onClick={() => signIn()}
                >
                  Sign in
                </button>
              ))}

            <Link
              className="btn-ghost hidden md:inline-flex"
              href="/worker/dashboard"
            >
              Worker Dashboard
            </Link>

            <Link
              className="btn-ghost hidden md:inline-flex"
              href="/hirer"
            >
              Hirer Dashboard
            </Link>

            <Link
              className="btn-primary whitespace-nowrap"
              href="/post"
            >
              Post a job
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-gray-50 via-white to-white">
        <div
          aria-hidden="true"
          className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-gray-200/50 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-gray-100 blur-3xl"
        />

        <div className="container relative grid gap-12 py-16 md:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Local help when you need it
            </div>

            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              Hire reliable local labor in minutes
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Find trusted help for moving, cleaning, yard work, event setup,
              deliveries, and more. Post your task and connect with available
              workers nearby.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-3"
                href="/post"
              >
                Post a job
                <Icon name="arrow" className="h-4 w-4" />
              </Link>

              <Link
                className="btn-ghost inline-flex items-center justify-center px-5 py-3"
                href="/jobs"
              >
                Browse available jobs
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category}>{category}</Badge>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600">
              {[
                'No long-term commitment',
                'Worker profiles',
                'Secure job management',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-950 text-white">
                    <Icon name="check" className="h-3 w-3" />
                  </span>

                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-gray-200/60 to-transparent blur-2xl" />

            <div className="relative rounded-[1.75rem] border border-gray-200 bg-white p-5 shadow-xl shadow-gray-200/50 sm:p-7">
              <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Recently posted
                  </p>

                  <h2 className="mt-1 text-xl font-bold">Jobs near you</h2>
                </div>

                <Link
                  href="/jobs"
                  className="text-sm font-semibold text-gray-900 hover:underline"
                >
                  View all
                </Link>
              </div>

              {jobsLoading && (
                <div className="divide-y divide-gray-100">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="animate-pulse py-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="h-4 w-2/3 rounded bg-gray-200" />
                          <div className="mt-3 h-3 w-1/2 rounded bg-gray-100" />
                        </div>

                        <div className="h-7 w-20 rounded-full bg-gray-100" />
                      </div>

                      <div className="mt-4 h-3 w-1/3 rounded bg-gray-100" />
                    </div>
                  ))}
                </div>
              )}

              {!jobsLoading && jobsError && (
                <div className="py-10 text-center">
                  <p className="text-sm font-medium text-red-700">
                    Unable to load jobs
                  </p>

                  <p className="mt-2 text-xs text-gray-500">{jobsError}</p>

                  <button
                    type="button"
                    onClick={loadJobs}
                    className="mt-4 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!jobsLoading && !jobsError && recentJobs.length === 0 && (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                    <Icon name="search" />
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-950">
                    No jobs posted yet
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Be the first person to post a local job.
                  </p>

                  <Link
                    href="/post"
                    className="mt-4 inline-flex rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Post a job
                  </Link>
                </div>
              )}

              {!jobsLoading && !jobsError && recentJobs.length > 0 && (
                <div className="divide-y divide-gray-100">
                  {recentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="py-5 first:pt-5 last:pb-2"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-950">
                            {job.title}
                          </p>

                          <p className="mt-1 truncate text-sm text-gray-500">
                            {job.category} · {getLocation(job)}
                          </p>
                        </div>

                        <span className="whitespace-nowrap rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
                          {formatMoney(job.amount)}
                          {job.budgetType === 'HOURLY' ? '/hr' : ''}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-4">
                        <span className="truncate text-sm text-gray-600">
                          {formatSchedule(job.scheduledAt)}
                        </span>

                        <Link
                          href={`/jobs/${job.id}`}
                          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold hover:underline"
                        >
                          View job
                          <Icon name="arrow" className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                <div className="text-xl font-bold">
                  {jobsLoading ? '—' : jobs.length}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                  Open {jobs.length === 1 ? 'job' : 'jobs'}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                <div className="text-xl font-bold">
                  {jobsLoading
                    ? '—'
                    : averageJobValue > 0
                      ? formatMoney(averageJobValue)
                      : '$0'}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                  Average job
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                <div className="text-xl font-bold">{categories.length}</div>

                <div className="mt-1 text-xs text-gray-500">
                  Job categories
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="container scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Simple process
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            How LaborLink works
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            Whether you need help or want to earn money, LaborLink makes it
            simple to connect and get the job done.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
            <div className="mb-7">
              <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                For hirers
              </span>

              <h3 className="mt-4 text-2xl font-bold">Get reliable help fast</h3>
            </div>

            <div className="space-y-7">
              <Step
                number={1}
                title="Post your task"
                description="Add the task details, location, preferred time, and budget."
              />

              <Step
                number={2}
                title="Review applicants"
                description="Compare worker profiles, skills, availability, and rates."
              />

              <Step
                number={3}
                title="Choose a worker"
                description="Select the worker who best matches your job requirements."
              />

              <Step
                number={4}
                title="Complete the job"
                description="Confirm the work is completed and leave feedback."
              />
            </div>

            <Link
              href="/post"
              className="btn-primary mt-8 inline-flex items-center gap-2"
            >
              Post your first job
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                For workers
              </span>

              <h3 className="mt-4 text-2xl font-bold">
                Find flexible local work
              </h3>
            </div>

            <div className="space-y-7">
              <Step
                number={1}
                title="Create your profile"
                description="Add your skills, service area, hourly rate, and experience."
              />

              <Step
                number={2}
                title="Browse nearby jobs"
                description="Search for tasks that fit your schedule and abilities."
              />

              <Step
                number={3}
                title="Apply for work"
                description="Connect with hirers and submit an application."
              />

              <Step
                number={4}
                title="Build your reputation"
                description="Complete jobs and earn positive reviews from hirers."
              />
            </div>

            <Link
              href="/worker/dashboard"
              className="btn-ghost mt-8 inline-flex items-center gap-2"
            >
              Go to Worker Dashboard
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="scroll-mt-24 border-y border-gray-100 bg-gray-50"
      >
        <div className="container py-16 md:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Built for trust
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to work confidently
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Tools that make hiring, communication, profiles, and job
              management simple.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/60"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-900 transition-colors group-hover:bg-black group-hover:text-white">
                  <Icon name={feature.icon} />
                </div>

                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-black px-6 py-12 text-white sm:px-10 md:px-14 md:py-16">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/10"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-32 right-16 h-72 w-72 rounded-full border border-white/10"
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Ready to get started?
              </h2>

              <p className="mt-4 text-base leading-7 text-gray-300 md:text-lg">
                Post your first task or discover flexible work opportunities
                available near you.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-100"
                href="/post"
              >
                Post a job
              </Link>

              <Link
                className="inline-flex items-center justify-center rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                href="/jobs"
              >
                Browse jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200">
        <div className="container flex flex-col gap-5 py-10 text-sm text-gray-600 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-gray-950"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-xs font-bold text-white">
              LL
            </div>

            LaborLink
          </Link>

          <div className="flex flex-wrap gap-x-5 gap-y-2 sm:ml-auto">
            <Link href="/jobs" className="hover:text-black">
              Browse jobs
            </Link>

            <Link href="/worker/dashboard" className="hover:text-black">
              Worker Dashboard
            </Link>

            <Link href="/hirer" className="hover:text-black">
              Hirer Dashboard
            </Link>

            <Link href="/post" className="hover:text-black">
              Post a job
            </Link>
          </div>

          <p className="sm:border-l sm:border-gray-200 sm:pl-5">
            © {new Date().getFullYear()} LaborLink
          </p>
        </div>
      </footer>
    </main>
  );
}