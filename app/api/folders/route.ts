import { NextResponse } from 'next/server';

import Prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const folders = await Prisma.storage.findFirst({
    where: {
      user: request.headers.get('x-user') as string,
      type: 'folder',
    },
  });

  return NextResponse.json(folders?.content || []);
}

export async function POST(request: Request) {
  const { folders } = await request.json();

  await Prisma.storage.upsert({
    where: {
      user_type: {
        user: request.headers.get('x-user') as string,
        type: 'folder',
      },
    },
    update: {
      content: folders,
    },
    create: {
      user: request.headers.get('x-user') as string,
      type: 'folder',
      content: folders,
    },
  });

  return NextResponse.json({ status: 'ok' });
}
