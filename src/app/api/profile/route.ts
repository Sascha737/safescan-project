import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from 'lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { displayName, profilePicture, bio } = await request.json();
  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        displayName,
        profilePicture,
        bio,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to update profile', details: e.message || String(e) }, { status: 500 });
  }
}
