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
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        jobs: [],
      });
    }

    const jobs = await prisma.job.findMany({
      where: {
        hirerId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        booking: {
          include: {
            worker: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    return NextResponse.json({
      jobs,
    });
  } catch (error) {
    console.error('GET /api/hirer/jobs error:', error);

    return NextResponse.json(
      {
        error: 'Unable to load your jobs.',
      },
      {
        status: 500,
      },
    );
  }
}