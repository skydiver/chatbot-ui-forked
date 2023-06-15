import { NextResponse } from 'next/server';

import Prisma from '@/lib/prisma';

export async function GET() {
  const folders = await Prisma.storage.findFirst({
    where: {
      type: 'folder',
    },
  });

  return NextResponse.json(folders?.content || []);
}

export async function POST(request: Request) {
  const { folders } = await request.json();

  await Prisma.storage.upsert({
    where: {
      type: 'folder',
    },
    update: {
      content: folders,
    },
    create: {
      type: 'folder',
      content: folders,
    },
  });

  return NextResponse.json({ status: 'ok' });
}
