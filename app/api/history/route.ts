import { NextResponse } from 'next/server';

import Prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const conversations = await Prisma.storage.findFirst({
    where: {
      user: request.headers.get('x-user') as string,
      type: 'history',
    },
  });

  return NextResponse.json(conversations?.content || []);
}

export async function POST(request: Request) {
  const { conversations } = await request.json();

  await Prisma.storage.upsert({
    where: {
      user_type: {
        user: request.headers.get('x-user') as string,
        type: 'history',
      },
    },
    update: {
      content: conversations,
    },
    create: {
      user: request.headers.get('x-user') as string,
      type: 'history',
      content: conversations,
    },
  });

  return NextResponse.json({ status: 'ok' });
}

export async function DELETE(request: Request) {
  await Prisma.storage.delete({
    where: {
      user_type: {
        user: request.headers.get('x-user') as string,
        type: 'history',
      },
    },
  });

  return NextResponse.json({ status: 'ok' });
}
