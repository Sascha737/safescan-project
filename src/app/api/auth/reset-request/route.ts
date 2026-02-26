
import { NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { findUserByEmail } from 'lib/user';
import crypto from 'crypto';
import { sendResetEmail } from 'lib/email';

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  const user = await findUserByEmail(email);
  if (user) {
    // Generate and save reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    });
    // Send reset email
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password/confirm?token=${token}`;
    await sendResetEmail(user.email, resetUrl);
  }
  // Always return ok (don't reveal if user exists)
  return NextResponse.json({ ok: true });
}
