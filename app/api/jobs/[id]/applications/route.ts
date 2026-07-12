import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';

import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
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

    const { id } = await context.params;
    const jobId = id.trim();

    if (!jobId) {
      return NextResponse.json(
        {
          error: 'Job ID is required.',
        },
        {
          status: 400,
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
      return NextResponse.json(
        {
          error: 'User account not found.',
        },
        {
          status: 404,
        },
      );
    }

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
      select: {
        id: true,
        title: true,
        status: true,
        hirerId: true,
        amount: true,
        budgetType: true,
      },
    });

    if (!job) {
      return NextResponse.json(
        {
          error: 'Job not found.',
        },
        {
          status: 404,
        },
      );
    }

    if (job.hirerId !== user.id) {
      return NextResponse.json(
        {
          error: 'You are not allowed to view these applications.',
        },
        {
          status: 403,
        },
      );
    }

    const applications = await prisma.application.findMany({
      where: {
        jobId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        worker: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            workerProfile: {
              select: {
                bio: true,
                skills: true,
                hourlyRate: true,
                serviceRadius: true,
                city: true,
                state: true,
                isAvailable: true,
                isVerified: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      job,
      applications,
    });
  } catch (error) {
    console.error(
      'GET /api/jobs/[id]/applications error:',
      error,
    );

    return NextResponse.json(
      {
        error: 'Unable to load applications.',
      },
      {
        status: 500,
      },
    );
  }
}