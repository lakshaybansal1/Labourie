'use client';
import Link from 'next/link';
import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-gray-700">{children}</span>;
}

const categories = ["Moving & Lifting","Cleaning","Yard & Snow","Handyman","Event Setup","Deliveries"];

export default function Page() {
  const { data: session } = useSession();

  return (
    <main>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b">
        <div className="container py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-black" />
            <span className="font-bold">LaborLink</span>
          </div>
          <nav className="ml-auto hidden md:flex items-center gap-6 text-sm text-gray-700">
            <a href="#how" className="hover:underline">How it works</a>
            <a href="#features" className="hover:underline">Features</a>
            <Link href="/jobs" className="hover:underline">Browse jobs</Link>
          </nav>
          <div className="ml-auto md:ml-4 flex items-center gap-3">
            {session ? (
              <>
                <span className="text-sm text-gray-600">Hi, {session.user?.name}</span>
                <button className="btn-ghost" onClick={()=>signOut()}>Sign out</button>
              </>
            ) : (
              <button className="btn-ghost" onClick={()=>signIn()}>Sign in</button>
            )}
            <Link className="btn-ghost" href="/worker">Find gigs</Link>
            <Link className="btn-primary" href="/post">Post a job</Link>
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="container py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">Hire reliable local labor in minutes</h1>
            <p className="text-gray-700 text-lg mb-6">
              Find trusted help for your tasks — moving, cleaning, yard work, event setup, deliveries, and more.
              Secure payments. Verified workers. Same‑day availability.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="btn-primary" href="/post">Post a job</Link>
              <Link className="btn-ghost" href="/worker">I want to find gigs</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {categories.map(c => <Badge key={c}>{c}</Badge>)}
            </div>
          </div>
          <div className="p-4">
            <div className="card">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><div className="text-3xl font-bold">4.8★</div><div className="text-sm text-gray-600">Avg. rating</div></div>
                <div><div className="text-3xl font-bold">{'< 5 min'}</div><div className="text-sm text-gray-600">Time to first apply</div></div>
                <div><div className="text-3xl font-bold">$80</div><div className="text-sm text-gray-600">Avg. job value</div></div>
              </div>
              <div className="mt-4 text-sm text-gray-600">Payments held securely until completion. Two‑way reviews on every job.</div>
            </div>
          </div>
        </div>
      </div>

      <section id="how" className="container py-14">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">How it works</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">Simple, transparent, and fast for both hirers and workers.</p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="font-semibold text-lg mb-2">For Hirers</h3>
            <ol className="space-y-2 text-gray-700 list-decimal pl-5">
              <li>Post a job in minutes with budget & time window</li>
              <li>Review applicants with profiles & ratings</li>
              <li>Accept best match — payment hold created</li>
              <li>Job completed — approve and review</li>
            </ol>
          </div>
          <div className="card">
            <h3 className="font-semibold text-lg mb-2">For Workers</h3>
            <ol className="space-y-2 text-gray-700 list-decimal pl-5">
              <li>Create a verified profile & set your skills</li>
              <li>Browse nearby jobs that match your schedule</li>
              <li>Apply, complete the work, and get paid fast</li>
              <li>Build your reputation with reviews</li>
            </ol>
          </div>
        </div>
      </section>

      <section id="features" className="container py-14">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Features</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">Everything you need to hire confidently and work safely.</p>
        <div className="grid md:grid-cols-3 gap-5">
          {['Quick Job Posting & Smart Search','In‑app Messaging','Secure Payments','Ratings & Reviews','ID Verification','Safety & Support']
            .map(title => (
              <div key={title} className="card hover:shadow-sm transition-shadow">
                <div className="text-base font-semibold mb-1">{title}</div>
                <div className="text-sm text-gray-700">Placeholder description for {title.toLowerCase()}.</div>
              </div>
          ))}
        </div>
      </section>

      <section className="container py-14">
        <div className="card flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold mb-2">Ready to get started?</div>
            <div className="text-gray-600">Post your first job or find your next gig in minutes.</div>
          </div>
          <div className="flex gap-3">
            <Link className="btn-primary" href="/post">Post a job</Link>
            <Link className="btn-ghost" href="/jobs">Browse jobs</Link>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="container py-10 text-sm text-gray-600 flex items-center gap-4">
          <div className="font-semibold">LaborLink</div>
          <div className="ml-auto">© {new Date().getFullYear()} LaborLink. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
