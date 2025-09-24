import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 400 });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
    const pi = await stripe.paymentIntents.create({
      amount: Number(amount || 1000),
      currency: 'usd',
      capture_method: 'manual', // place a hold; capture when job completes
      automatic_payment_methods: { enabled: true },
    });
    return NextResponse.json({ client_secret: pi.client_secret });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
