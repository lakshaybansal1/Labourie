import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Role } from '@prisma/client';

import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

const allowedSkills = [
  'Moving & Lifting',
  'Cleaning',
  'Yard & Snow',
  'Handyman',
  'Event Setup',
  'Deliveries',
] as const;

type WorkerProfileBody = {
  name?: unknown;
  bio?: unknown;
  hourlyRate?: unknown;
  serviceRadius?: unknown;
  city?: unknown;
  state?: unknown;
  skills?: unknown;
};

function optionalString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();

  return trimmed || null;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: 'You must be signed in.',
        },
        {
          status: 401,
        },
      );
    }

    const email = session.user.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        workerProfile: true,
      },
    });

    if (!user?.workerProfile) {
      return NextResponse.json(
        {
          profile: null,
        },
        {
          status: 200,
        },
      );
    }

    return NextResponse.json({
      profile: {
        ...user.workerProfile,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error('GET /api/workers error:', error);

    return NextResponse.json(
      {
        error: 'Unable to load worker profile.',
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: 'You must be signed in to save a worker profile.',
        },
        {
          status: 401,
        },
      );
    }

    let body: WorkerProfileBody;

    try {
      body = (await request.json()) as WorkerProfileBody;
    } catch {
      return NextResponse.json(
        {
          error: 'Invalid request body.',
        },
        {
          status: 400,
        },
      );
    }

    const name =
      typeof body.name === 'string' ? body.name.trim() : '';

    const bio =
      typeof body.bio === 'string' ? body.bio.trim() : '';

    const hourlyRate =
      typeof body.hourlyRate === 'number' ||
      typeof body.hourlyRate === 'string'
        ? Number(body.hourlyRate)
        : Number.NaN;

    const serviceRadius =
      typeof body.serviceRadius === 'number' ||
      typeof body.serviceRadius === 'string'
        ? Number(body.serviceRadius)
        : Number.NaN;

    const skills = Array.isArray(body.skills)
      ? [
          ...new Set(
            body.skills.filter(
              (skill): skill is string =>
                typeof skill === 'string' &&
                allowedSkills.includes(
                  skill as (typeof allowedSkills)[number],
                ),
            ),
          ),
        ]
      : [];

    if (!name) {
      return NextResponse.json(
        {
          error: 'Name is required.',
        },
        {
          status: 400,
        },
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          error: 'Name must be 100 characters or fewer.',
        },
        {
          status: 400,
        },
      );
    }

    if (!bio) {
      return NextResponse.json(
        {
          error: 'Bio is required.',
        },
        {
          status: 400,
        },
      );
    }

    if (bio.length > 500) {
      return NextResponse.json(
        {
          error: 'Bio must be 500 characters or fewer.',
        },
        {
          status: 400,
        },
      );
    }

    if (
      !Number.isInteger(hourlyRate) ||
      hourlyRate < 1000 ||
      hourlyRate > 50000
    ) {
      return NextResponse.json(
        {
          error: 'Hourly rate must be between $10 and $500.',
        },
        {
          status: 400,
        },
      );
    }

    if (
      !Number.isInteger(serviceRadius) ||
      serviceRadius < 1 ||
      serviceRadius > 100
    ) {
      return NextResponse.json(
        {
          error: 'Service radius must be between 1 and 100 miles.',
        },
        {
          status: 400,
        },
      );
    }

    if (skills.length === 0) {
      return NextResponse.json(
        {
          error: 'Select at least one valid skill.',
        },
        {
          status: 400,
        },
      );
    }

    const email = session.user.email.trim().toLowerCase();

    const user = await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        name,
        ...(session.user.image
          ? {
              image: session.user.image,
            }
          : {}),
      },
      create: {
        email,
        name,
        role: Role.WORKER,
        image: session.user.image ?? null,
      },
    });

    const profile = await prisma.workerProfile.upsert({
      where: {
        userId: user.id,
      },
      update: {
        bio,
        skills,
        hourlyRate,
        serviceRadius,
        city: optionalString(body.city),
        state: optionalString(body.state),
        isAvailable: true,
      },
      create: {
        userId: user.id,
        bio,
        skills,
        hourlyRate,
        serviceRadius,
        city: optionalString(body.city),
        state: optionalString(body.state),
        isAvailable: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Worker profile saved successfully.',
        profile: {
          ...profile,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error('POST /api/workers error:', error);

    return NextResponse.json(
      {
        error: 'Unable to save your worker profile.',
      },
      {
        status: 500,
      },
    );
  }
}