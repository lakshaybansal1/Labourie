'use client';
import React, { useState } from 'react';
const categories = ["Moving & Lifting","Cleaning","Yard & Snow","Handyman","Event Setup","Deliveries"];
export default function PostPage() {
  const [form, setForm] = useState({ title: '', category: categories[0], budgetType: 'Fixed', amount: '', when: '', address: '' });
  const [note, setNote] = useState('');
  const update = (k: string, v: any) => setForm((s:any) => ({ ...s, [k]: v }));
  return (
    <main className="container py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Post a job</h1>
      <form onSubmit={(e)=>{ e.preventDefault(); alert('Job posted (demo)'); }} className="grid gap-3">
        <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">Job title</span><input className="w-full rounded-xl border px-3 py-2" value={form.title} onChange={e=>update('title', e.target.value)} placeholder="e.g. Help move 10 boxes" /></label>
        <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">Category</span><select className="w-full rounded-xl border px-3 py-2" value={form.category} onChange={e=>update('category', (e.target as any).value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">Budget type</span><select className="w-full rounded-xl border px-3 py-2" value={form.budgetType} onChange={e=>update('budgetType', (e.target as any).value)}><option>Fixed</option><option>Hourly</option></select></label>
          <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">{form.budgetType === 'Fixed' ? 'Amount ($)' : 'Hourly rate ($/hr)'}</span><input className="w-full rounded-xl border px-3 py-2" type="number" min="1" value={form.amount} onChange={e=>update('amount', (e.target as any).value)} /></label>
        </div>
        <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">When</span><input className="w-full rounded-xl border px-3 py-2" value={form.when} onChange={e=>update('when', e.target.value)} placeholder="Today 5–7 pm or Sat morning" /></label>
        <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">Address (approximate okay)</span><input className="w-full rounded-xl border px-3 py-2" value={form.address} onChange={e=>update('address', e.target.value)} placeholder="City / Area" /></label>
        <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">Notes (optional)</span><textarea className="w-full rounded-xl border px-3 py-2" rows={3} value={note} onChange={e=>setNote(e.target.value)} placeholder="Additional details..." /></label>
        <div className="flex justify-end gap-3 pt-2"><button className="btn-ghost" type="button">Cancel</button><button className="btn-primary" type="submit">Post job</button></div>
      </form>
    </main>
  );
}
