import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import {
  AppStatus,
  BookingStatus,
  JobStatus,
  Prisma,
} from '@prisma/client';

import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  id?: string;
  applicationId?: string;
};

type RouteContext = {
  params: Promise<RouteParams>;
};

type UpdateApplicationBody = {
  status?: unknown;
};

export async function PATCH(
  request: Request,
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

    const params = await context.params;

const applicationId = (
  params.id ??
  params.applicationId ??
  ''
).trim();

    if (!applicationId) {
      return NextResponse.json(
        {
          error: 'Application ID is required.',
        },
        {
          status: 400,
        },
      );
    }

    let body: UpdateApplicationBody;

    try {
      body = (await request.json()) as UpdateApplicationBody;
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

    const requestedStatus =
      typeof body.status === 'string'
        ? body.status.trim().toUpperCase()
        : '';

    if (
      requestedStatus !== AppStatus.ACCEPTED &&
      requestedStatus !== AppStatus.REJECTED
    ) {
      return NextResponse.json(
        {
          error: 'Status must be ACCEPTED or REJECTED.',
        },
        {
          status: 400,
        },
      );
    }

    const email = session.user.email.trim().toLowerCase();

    const hirer = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (!hirer) {
      return NextResponse.json(
        {
          error: 'Your user account was not found.',
        },
        {
          status: 404,
        },
      );
    }

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        job: {
          include: {
            booking: true,
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

    if (!application) {
      return NextResponse.json(
        {
          error: 'Application not found.',
        },
        {
          status: 404,
        },
      );
    }

    if (application.job.hirerId !== hirer.id) {
      return NextResponse.json(
        {
          error: 'You can only manage applications for your own jobs.',
        },
        {
          status: 403,
        },
      );
    }

    if (application.status !== AppStatus.PENDING) {
      return NextResponse.json(
        {
          error: `This application is already ${application.status.toLowerCase()}.`,
        },
        {
          status: 400,
        },
      );
    }

    if (requestedStatus === AppStatus.REJECTED) {
      const updatedApplication =
        await prisma.application.update({
          where: {
            id: application.id,
          },
          data: {
            status: AppStatus.REJECTED,
          },
          include: {
            worker: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });

      return NextResponse.json({
        message: 'Application rejected successfully.',
        application: updatedApplication,
      });
    }

    if (application.job.status !== JobStatus.OPEN) {
      return NextResponse.json(
        {
          error: 'This job is no longer open.',
        },
        {
          status: 400,
        },
      );
    }

    if (application.job.booking) {
      return NextResponse.json(
        {
          error: 'This job already has a booking.',
        },
        {
          status: 409,
        },
      );
    }

    const agreedAmount =
      application.proposedAmount ?? application.job.amount;

    const result = await prisma.$transaction(async (tx) => {
      /*
       * Update the job first using updateMany.
       * This prevents two applications from being accepted
       * for the same job at nearly the same time.
       */
      const jobUpdate = await tx.job.updateMany({
        where: {
          id: application.jobId,
          hirerId: hirer.id,
          status: JobStatus.OPEN,
          booking: null,
        },
        data: {
          status: JobStatus.ACCEPTED,
        },
      });

      if (jobUpdate.count !== 1) {
        throw new Error(
          'The job is no longer available or a worker has already been hired.',
        );
      }

      const acceptedApplication =
        await tx.application.update({
          where: {
            id: application.id,
          },
          data: {
            status: AppStatus.ACCEPTED,
          },
          include: {
            worker: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });

      await tx.application.updateMany({
        where: {
          jobId: application.jobId,
          id: {
            not: application.id,
          },
          status: AppStatus.PENDING,
        },
        data: {
          status: AppStatus.REJECTED,
        },
      });

      const booking = await tx.booking.create({
        data: {
          jobId: application.jobId,
          workerId: application.workerId,
          agreedAmount,
          status: BookingStatus.ACCEPTED,
        },
        include: {
          worker: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
      });

      return {
        application: acceptedApplication,
        booking,
      };
    });

    return NextResponse.json({
      message: 'Worker hired successfully.',
      ...result,
    });
  } catch (error) {
    console.error(
      'PATCH /api/applications/[id] error:',
      error,
    );

    if (
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          {
            error: 'A worker has already been hired for this job.',
          },
          {
            status: 409,
          },
        );
      }

      if (error.code === 'P2003') {
        return NextResponse.json(
          {
            error:
              'The related job, worker, or application record no longer exists.',
          },
          {
            status: 409,
          },
        );
      }

      return NextResponse.json(
        {
          error: `Database error: ${error.code}`,
        },
        {
          status: 500,
        },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        error: 'Unable to update the application.',
      },
      {
        status: 500,
      },
    );
  }
}