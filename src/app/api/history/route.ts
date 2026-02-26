import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from 'lib/prisma';

// Returns scan history for the logged-in user
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let userId: string | undefined = undefined;
  if (session.user.id) {
    userId = session.user.id as string;
  } else if (session.user.email) {
    // Fallback to lookup by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });
    if (user) userId = user.id;
  }

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Get all scans for this user
  const scans = await prisma.scan.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      url: true,
      result: true,
      createdAt: true,
      notes: true,
    },
  });

  return NextResponse.json({ scans });
}
