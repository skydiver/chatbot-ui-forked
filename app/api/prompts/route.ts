import { NextResponse } from 'next/server';

import Prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const prompts = await Prisma.storage.findFirst({
    where: {
      user: request.headers.get('x-user') as string,
      type: 'prompt',
    },
  });

  return NextResponse.json(prompts?.content || []);
}

export async function POST(request: Request) {
  const { prompts } = await request.json();

  await Prisma.storage.upsert({
    where: {
      user_type: {
        user: request.headers.get('x-user') as string,
        type: 'prompt',
      },
    },
    update: {
      content: prompts,
    },
    create: {
      user: request.headers.get('x-user') as string,
      type: 'prompt',
      content: prompts,
    },
  });

  return NextResponse.json({ status: 'ok' });
}
