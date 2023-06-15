import { NextResponse } from 'next/server';

import Prisma from '@/lib/prisma';

export async function GET() {
  const prompts = await Prisma.storage.findFirst({
    where: {
      type: 'prompt',
    },
  });

  return NextResponse.json(prompts?.content || []);
}

export async function POST(request: Request) {
  const { prompts } = await request.json();

  await Prisma.storage.upsert({
    where: {
      type: 'prompt',
    },
    update: {
      content: prompts,
    },
    create: {
      type: 'prompt',
      content: prompts,
    },
  });

  return NextResponse.json({ status: 'ok' });
}
