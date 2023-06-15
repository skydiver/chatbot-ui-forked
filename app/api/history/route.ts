import { NextResponse } from 'next/server';

import Prisma from '@/lib/prisma';

export async function GET() {
  const conversations = await Prisma.storage.findFirst({
    where: {
      type: 'history',
    },
  });

  return NextResponse.json(conversations?.content || []);
}

export async function POST(request: Request) {
  const { conversations } = await request.json();

  await Prisma.storage.upsert({
    where: {
      type: 'history',
    },
    update: {
      content: conversations,
    },
    create: {
      type: 'history',
      content: conversations,
    },
  });

  return NextResponse.json({ status: 'ok' });
}

export async function DELETE() {
  await Prisma.storage.delete({
    where: {
      type: 'history',
    },
  });

  return NextResponse.json({ status: 'ok' });
}
