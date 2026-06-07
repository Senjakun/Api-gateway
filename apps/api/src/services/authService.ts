import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { generateToken } from '../lib/token';

export const registerUser = async (email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw { status: 409, message: 'Email already registered' };
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed },
    select: { id: true, email: true, plan: true, balance: true, totalSpent: true },
  });

  const token = generateToken(user.id);
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const token = generateToken(user.id);
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
};
