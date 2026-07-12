import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import {
  BookingStatus,
  JobStatus,
  Prisma,
} from '@prisma/client';

import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  id?: string;
  bookingId?: string;
};

type RouteContext = {
  params: Promise<RouteParams>;
};

type UpdateBookingBody = {
  status?: unknown;
};

const allowedStatusTransitions: Partial<
  Record<BookingStatus, BookingStatus[]>
> = {
  [BookingStatus.ACCEPTED]: [BookingStatus.IN_PROGRESS],
  [BookingStatus.IN_PROGRESS]: [BookingStatus.COMPLETED],
};

function getBookingId(params: RouteParams) {
  return (params.id ?? params.bookingId ?? '').trim();
}

async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const email = session.user.email.trim().toLowerCase();

  return prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
    },
  });
}

const bookingInclude = {
  worker: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  },
  job: {
    include: {
      hirer: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  },
} satisfies Prisma.BookingInclude;

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
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
    const bookingId = getBookingId(params);

    if (!bookingId) {
      return NextResponse.json(
        {
          error: 'Booking ID is required.',
        },
        {
          status: 400,
        },
      );
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: bookingInclude,
    });

    if (!booking) {
      return NextResponse.json(
        {
          error: 'Booking not found.',
        },
        {
          status: 404,
        },
      );
    }

    const isWorker = booking.workerId === user.id;
    const isHirer = booking.job.hirerId === user.id;

    if (!isWorker && !isHirer) {
      return NextResponse.json(
        {
          error: 'You are not allowed to view this booking.',
        },
        {
          status: 403,
        },
      );
    }

    return NextResponse.json({
      booking,
      currentUserId: user.id,
    });
  } catch (error) {
    console.error('GET /api/bookings/[id] error:', error);

    return NextResponse.json(
      {
        error: 'Unable to load the booking.',
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
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
    const bookingId = getBookingId(params);

    if (!bookingId) {
      return NextResponse.json(
        {
          error: 'Booking ID is required.',
        },
        {
          status: 400,
        },
      );
    }

    let body: UpdateBookingBody;

    try {
      body = (await request.json()) as UpdateBookingBody;
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
      requestedStatus !== BookingStatus.IN_PROGRESS &&
      requestedStatus !== BookingStatus.COMPLETED
    ) {
      return NextResponse.json(
        {
          error: 'Status must be IN_PROGRESS or COMPLETED.',
        },
        {
          status: 400,
        },
      );
    }

    const nextStatus = requestedStatus as
      | BookingStatus.IN_PROGRESS
      | BookingStatus.COMPLETED;

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: bookingInclude,
    });

    if (!booking) {
      return NextResponse.json(
        {
          error: 'Booking not found.',
        },
        {
          status: 404,
        },
      );
    }

    const isWorker = booking.workerId === user.id;
    const isHirer = booking.job.hirerId === user.id;

    if (!isWorker && !isHirer) {
      return NextResponse.json(
        {
          error: 'You are not allowed to update this booking.',
        },
        {
          status: 403,
        },
      );
    }

    if (
      nextStatus === BookingStatus.IN_PROGRESS &&
      !isWorker
    ) {
      return NextResponse.json(
        {
          error: 'Only the hired worker can start this job.',
        },
        {
          status: 403,
        },
      );
    }

    if (
      nextStatus === BookingStatus.COMPLETED &&
      !isWorker &&
      !isHirer
    ) {
      return NextResponse.json(
        {
          error: 'Only the worker or hirer can complete this job.',
        },
        {
          status: 403,
        },
      );
    }

    const allowedNextStatuses =
      allowedStatusTransitions[booking.status] ?? [];

    if (!allowedNextStatuses.includes(nextStatus)) {
      return NextResponse.json(
        {
          error: `The booking cannot move from ${booking.status} to ${nextStatus}.`,
        },
        {
          status: 400,
        },
      );
    }

    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      const updateResult = await tx.booking.updateMany({
        where: {
          id: booking.id,
          status: booking.status,
        },
        data:
          nextStatus === BookingStatus.IN_PROGRESS
            ? {
                status: BookingStatus.IN_PROGRESS,
                startedAt: now,
              }
            : {
                status: BookingStatus.COMPLETED,
                completedAt: now,
              },
      });

      if (updateResult.count !== 1) {
        throw new Error(
          'The booking was updated by another request. Please refresh and try again.',
        );
      }

      await tx.job.update({
        where: {
          id: booking.jobId,
        },
        data: {
          status:
            nextStatus === BookingStatus.IN_PROGRESS
              ? JobStatus.IN_PROGRESS
              : JobStatus.COMPLETED,
        },
      });

      return tx.booking.findUnique({
        where: {
          id: booking.id,
        },
        include: bookingInclude,
      });
    });

    if (!result) {
      return NextResponse.json(
        {
          error: 'Unable to reload the updated booking.',
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      message:
        nextStatus === BookingStatus.IN_PROGRESS
          ? 'Job started successfully.'
          : 'Job completed successfully.',
      booking: result,
      currentUserId: user.id,
    });
  } catch (error) {
    console.error('PATCH /api/bookings/[id] error:', error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            error: 'The booking or related job no longer exists.',
          },
          {
            status: 404,
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

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to update the booking.',
      },
      {
        status: 500,
      },
    );
  }
}