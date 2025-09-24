# LaborLink — Full Next.js Starter

A production-lean starter for a local labor marketplace with **Next.js 14, Tailwind, NextAuth (Credentials demo), Prisma (Postgres), and Stripe**.

## Quick Start
```bash
npm install
cp .env.example .env
# Fill DATABASE_URL, NEXTAUTH_SECRET, and Stripe keys
npx prisma generate
npm run dev
```

## Features
- Landing + Jobs + Post Job + Worker Profile pages
- **Auth** (NextAuth credentials demo; switch to Email/OAuth later)
- **Prisma schema** for Users/Jobs/Applications/Bookings/Reviews
- **Stripe** PaymentIntent API route (hold then capture later)
- Tailwind styling + simple components

## Next Steps
- Add real sign-in (Email or OAuth) and a Prisma Adapter for NextAuth
- Implement job creation & listing against the DB
- Connect PaymentIntent creation on Accept, capture on Complete
- Deploy to Vercel + Supabase/Neon (Postgres)
