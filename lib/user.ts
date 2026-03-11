import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

// User type matches Prisma User model
export type User = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  displayName?: string | null;
  profilePicture?: string | null;
  bio?: string | null;
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

// Find user by email, including profile fields
export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      createdAt: true,
      displayName: true,
      profilePicture: true,
      bio: true,
    },
  });
  return user as User | null;
}
