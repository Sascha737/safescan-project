import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

// User type matches Prisma User model
export type User = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

// Create a new user with hashed password
export async function createUser(email: string, password: string): Promise<User> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('User already exists');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });
  return user as User;
}

// Find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  return user as User | null;
}
