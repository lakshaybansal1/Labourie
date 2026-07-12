import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

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
        applications: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            job: {
              include: {
                hirer: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
                booking: {
                  select: {
                    id: true,
                    status: true,
                    agreedAmount: true,
                    acceptedAt: true,
                    startedAt: true,
                    completedAt: true,
                    paidAt: true,
                  },
                },
              },
            },
          },
        },
        bookings: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            job: {
              include: {
                hirer: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        currentUserId: null,
        profile: null,
        applications: [],
        bookings: [],
      });
    }

    return NextResponse.json({
      currentUserId: user.id,

      profile: user.workerProfile
        ? {
            ...user.workerProfile,
            name: user.name,
            email: user.email,
            image: user.image,
          }
        : null,

      applications: user.applications,

      bookings: user.bookings,
    });
  } catch (error) {
    console.error('GET /api/worker/dashboard error:', error);

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === 'development' &&
          error instanceof Error
            ? error.message
            : 'Unable to load worker dashboard.',
      },
      {
        status: 500,
      },
    );
  }
}