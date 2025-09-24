'use client';
import React, { useState } from 'react';
const categories = ["Moving & Lifting","Cleaning","Yard & Snow","Handyman","Event Setup","Deliveries"];
export default function WorkerPage() {
  const [form, setForm] = useState({ name: '', rate: '25', radius: '5', skills: ['Moving & Lifting'] });
  const toggleSkill = (s: string) => setForm(f => ({ ...f, skills: f.skills.includes(s) ? f.skills.filter(x=>x!==s) : [...f.skills, s] }));
  return (
    <main className="container py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Create worker profile</h1>
      <form onSubmit={(e)=>{ e.preventDefault(); alert('Profile created (demo)'); }} className="grid gap-3">
        <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">Your name</span><input className="w-full rounded-xl border px-3 py-2" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="e.g. Lakshay" /></label>
        <div><div className="mb-1 text-sm font-medium text-gray-700">Skills</div><div className="flex flex-wrap gap-2">{categories.map(c => (<button key={c} type="button" onClick={()=>toggleSkill(c)} className={`rounded-full border px-3 py-1 text-sm ${form.skills.includes(c) ? 'bg-black text-white' : ''}`}>{c}</button>))}</div></div>
        <div className="grid grid-cols-2 gap-3"><label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">Hourly rate ($/hr)</span><input className="w-full rounded-xl border px-3 py-2" type="number" min="10" value={form.rate} onChange={e=>setForm({...form, rate: e.target.value})} /></label><label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">Service radius (miles)</span><input className="w-full rounded-xl border px-3 py-2" type="number" min="1" value={form.radius} onChange={e=>setForm({...form, radius: e.target.value})} /></label></div>
        <div className="flex justify-end gap-3 pt-2"><button className="btn-ghost" type="button">Cancel</button><button className="btn-primary" type="submit">Create profile</button></div>
      </form>
    </main>
  )
}
