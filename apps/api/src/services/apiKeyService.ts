import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma';

export const generateApiKey = async (userId: string, name: string) => {
  const key = `nusa-${uuidv4()}`;
  return prisma.apiKey.create({
    data: {
      key,
      name,
      userId,
    },
    select: { id: true, key: true, name: true, active: true, createdAt: true },
  });
};

export const listApiKeys = async (userId: string) => {
  return prisma.apiKey.findMany({
    where: { userId },
    select: { id: true, key: true, name: true, active: true, createdAt: true },
  });
};

export const deleteApiKey = async (userId: string, keyId: string) => {
  const key = await prisma.apiKey.findUnique({ where: { id: keyId } });
  if (!key || key.userId !== userId) {
    throw { status: 404, message: 'API key not found' };
  }
  await prisma.apiKey.delete({ where: { id: keyId } });
  return { id: keyId };
};
