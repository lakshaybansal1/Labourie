import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { BudgetType, JobStatus, UserRole } from '@prisma/client';

import { authOptions } from '../../../lib/auth-options';
import { prisma } from '../../../lib/prisma';

const allowedCategories = [
  'Moving & Lifting',
  'Cleaning',
  'Yard & Snow',
  'Handyman',
  'Event Setup',
  'Deliveries',
] as const;

const allowedBudgetTypes = [
  BudgetType.FIXED,
  BudgetType.HOURLY,
] as const;

type CreateJobBody = {
  title?: unknown;
  category?: unknown;
  description?: unknown;
  budgetType?: unknown;
  amount?: unknown;
  scheduledAt?: unknown;
  scheduleNote?: unknown;
  address?: unknown;
  city?: unknown;
  state?: unknown;
  postalCode?: unknown;
};

function optionalString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue || null;
}

function isAllowedCategory(
  category: string,
): category is (typeof allowedCategories)[number] {
  return allowedCategories.some(
    (allowedCategory) => allowedCategory === category,
  );
}

function isAllowedBudgetType(
  budgetType: string,
): budgetType is BudgetType {
  return allowedBudgetTypes.some(
    (allowedBudgetType) => allowedBudgetType === budgetType,
  );
}

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        status: JobStatus.OPEN,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        hirer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('GET /api/jobs error:', error);

    return NextResponse.json(
      {
        error: 'Unable to load jobs.',
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
          error: 'You must be signed in to post a job.',
        },
        {
          status: 401,
        },
      );
    }

    let body: CreateJobBody;

    try {
      body = (await request.json()) as CreateJobBody;
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

    const title =
      typeof body.title === 'string' ? body.title.trim() : '';

    const category =
      typeof body.category === 'string' ? body.category.trim() : '';

    const description =
      typeof body.description === 'string'
        ? body.description.trim()
        : '';

    const budgetType =
      typeof body.budgetType === 'string'
        ? body.budgetType.trim().toUpperCase()
        : '';

    const address =
      typeof body.address === 'string' ? body.address.trim() : '';

    const amount =
      typeof body.amount === 'number' ||
      typeof body.amount === 'string'
        ? Number(body.amount)
        : Number.NaN;

    const scheduledAtValue =
      typeof body.scheduledAt === 'string'
        ? body.scheduledAt.trim()
        : '';

    const scheduledAt = new Date(scheduledAtValue);

    if (!title) {
      return NextResponse.json(
        {
          error: 'Job title is required.',
        },
        {
          status: 400,
        },
      );
    }

    if (title.length > 100) {
      return NextResponse.json(
        {
          error: 'Job title must be 100 characters or fewer.',
        },
        {
          status: 400,
        },
      );
    }

    if (!isAllowedCategory(category)) {
      return NextResponse.json(
        {
          error: 'Please select a valid category.',
        },
        {
          status: 400,
        },
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          error: 'Job description is required.',
        },
        {
          status: 400,
        },
      );
    }

    if (description.length > 1000) {
      return NextResponse.json(
        {
          error: 'Job description must be 1,000 characters or fewer.',
        },
        {
          status: 400,
        },
      );
    }

    if (!isAllowedBudgetType(budgetType)) {
      return NextResponse.json(
        {
          error: 'Please select a valid budget type.',
        },
        {
          status: 400,
        },
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          error: 'Please enter a valid budget amount.',
        },
        {
          status: 400,
        },
      );
    }

    if (!scheduledAtValue || Number.isNaN(scheduledAt.getTime())) {
      return NextResponse.json(
        {
          error: 'Please enter a valid job date and time.',
        },
        {
          status: 400,
        },
      );
    }

    if (scheduledAt.getTime() <= Date.now()) {
      return NextResponse.json(
        {
          error: 'The scheduled date must be in the future.',
        },
        {
          status: 400,
        },
      );
    }

    if (!address) {
      return NextResponse.json(
        {
          error: 'Job address is required.',
        },
        {
          status: 400,
        },
      );
    }

    if (address.length > 200) {
      return NextResponse.json(
        {
          error: 'Job address must be 200 characters or fewer.',
        },
        {
          status: 400,
        },
      );
    }

    const email = session.user.email.trim().toLowerCase();
    const name =
      session.user.name?.trim() || email.split('@')[0];

    const hirer = await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        name,
        role: UserRole.HIRER,
        ...(session.user.image
          ? { image: session.user.image }
          : {}),
      },
      create: {
        email,
        name,
        role: UserRole.HIRER,
        image: session.user.image ?? null,
      },
    });

    const job = await prisma.job.create({
      data: {
        hirerId: hirer.id,
        title,
        category,
        description,
        budgetType,
        amount,
        scheduledAt,
        scheduleNote: optionalString(body.scheduleNote),
        address,
        city: optionalString(body.city),
        state: optionalString(body.state),
        postalCode: optionalString(body.postalCode),
        status: JobStatus.OPEN,
      },
      include: {
        hirer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Job posted successfully.',
        job,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error('POST /api/jobs error:', error);

    return NextResponse.json(
      {
        error: 'Unable to post the job.',
      },
      {
        status: 500,
      },
    );
  }
}