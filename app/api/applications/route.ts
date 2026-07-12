import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import {
  AppStatus,
  JobStatus,
  Prisma,
  Role,
} from '@prisma/client';

import { authOptions } from '../../../lib/auth-options';
import { prisma } from '../../../lib/prisma';

type CreateApplicationBody = {
  jobId?: unknown;
  note?: unknown;
  proposedAmount?: unknown;
};

function optionalString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue || null;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: 'You must be signed in to apply for a job.',
        },
        {
          status: 401,
        },
      );
    }

    let body: CreateApplicationBody;

    try {
      body = (await request.json()) as CreateApplicationBody;
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

    const jobId =
      typeof body.jobId === 'string' ? body.jobId.trim() : '';

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

    let proposedAmount: number | null = null;

    if (
      body.proposedAmount !== undefined &&
      body.proposedAmount !== null &&
      body.proposedAmount !== ''
    ) {
      const parsedAmount = Number(body.proposedAmount);

      if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
        return NextResponse.json(
          {
            error: 'Proposed amount must be a positive integer.',
          },
          {
            status: 400,
          },
        );
      }

      proposedAmount = parsedAmount;
    }

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
      select: {
        id: true,
        hirerId: true,
        status: true,
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

    if (job.status !== JobStatus.OPEN) {
      return NextResponse.json(
        {
          error: 'This job is no longer accepting applications.',
        },
        {
          status: 400,
        },
      );
    }

    const email = session.user.email.trim().toLowerCase();
    const name =
      session.user.name?.trim() || email.split('@')[0];

    const worker = await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        name,
        ...(session.user.image
          ? { image: session.user.image }
          : {}),
      },
      create: {
        email,
        name,
        role: Role.WORKER,
        image: session.user.image ?? null,
      },
    });

    if (job.hirerId === worker.id) {
      return NextResponse.json(
        {
          error: 'You cannot apply to your own job.',
        },
        {
          status: 400,
        },
      );
    }

    const application = await prisma.application.create({
      data: {
        jobId: job.id,
        workerId: worker.id,
        note: optionalString(body.note),
        proposedAmount,
        status: AppStatus.PENDING,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
          },
        },
        worker: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Application submitted successfully.',
        application,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        {
          error: 'You have already applied to this job.',
        },
        {
          status: 409,
        },
      );
    }

    console.error('POST /api/applications error:', error);

    return NextResponse.json(
      {
        error: 'Unable to submit the application.',
      },
      {
        status: 500,
      },
    );
  }
}