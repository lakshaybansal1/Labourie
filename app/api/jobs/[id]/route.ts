import { NextResponse } from 'next/server';

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

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
      include: {
        hirer: {
          select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
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

    return NextResponse.json({
      job,
    });
  } catch (error) {
    console.error('GET /api/jobs/[id] error:', error);

    return NextResponse.json(
      {
        error: 'Unable to load the job.',
      },
      {
        status: 500,
      },
    );
  }
}