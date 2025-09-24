'use client';
import React, { useMemo, useState } from 'react';
const categories = ["Moving & Lifting","Cleaning","Yard & Snow","Handyman","Event Setup","Deliveries"];
const sampleJobs = [
  { id: 1, title: "Move 10 boxes", category: "Moving & Lifting", pay: 80, type: "Fixed", distance: 2.1, when: "Today 5–7 pm" },
  { id: 2, title: "Studio cleaning", category: "Cleaning", pay: 25, type: "Hourly", distance: 1.3, when: "Sat morning" },
  { id: 3, title: "Assemble IKEA desk", category: "Handyman", pay: 60, type: "Fixed", distance: 3.4, when: "Sun afternoon" },
];
export default function JobsPage() {
  const [filter, setFilter] = useState('');
  const jobs = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return sampleJobs;
    return sampleJobs.filter(j => j.title.toLowerCase().includes(f) || j.category.toLowerCase().includes(f));
  }, [filter]);
  return (
    <main className="container py-10">
      <h1 className="text-2xl font-bold mb-4">Browse jobs</h1>
      <div className="mb-4 flex items-center gap-3">
        <input value={filter} onChange={(e)=>setFilter(e.target.value)} placeholder="Search: moving, cleaning, assemble..." className="w-full rounded-xl border px-3 py-2" />
        <select className="rounded-xl border px-3 py-2">
          <option>All</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {jobs.map(j => (
          <div key={j.id} className="card">
            <div className="text-sm text-gray-500 mb-1">{j.category}</div>
            <div className="font-semibold mb-2">{j.title}</div>
            <div className="text-sm text-gray-700 mb-3">{j.when} • {j.distance} mi</div>
            <div className="mb-3"><span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-gray-700">{j.type === 'Fixed' ? ('$'+j.pay+' Fixed') : ('$'+j.pay+'/hr')}</span></div>
            <button className="btn-primary">Apply (demo)</button>
          </div>
        ))}
      </div>
    </main>
  )
}
