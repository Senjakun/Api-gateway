import { prisma } from '../lib/prisma';

const PLAN_BALANCE_LIMITS: Record<string, number> = {
  FREE: 0,
  LITE: 10,
  PRO: 50,
  UNLIMITED: 999_999,
};

const PLAN_ALLOWED: Record<string, number> = {
  FREE: 0,
  LITE: 10,
  PRO: 50,
  UNLIMITED: 999_999,
};

export const checkBalance = async (userId: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, balance: true },
  });
  if (!user) return false;

  const limit = PLAN_BALANCE_LIMITS[user.plan] ?? 0;
  return user.balance > limit ? true : false;
};

export const deductBalance = async (
  userId: string,
  costUsd: number,
) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      balance: { increment: -costUsd },
      totalSpent: { increment: costUsd },
    },
  });
};

export const recordUsage = async (
  userId: string,
  model: string,
  tokensIn: number,
  tokensOut: number,
  costUsd: number,
) => {
  await prisma.$transaction([
    prisma.usageLog.create({
      data: { userId, model, tokensIn, tokensOut, costUsd },
    }),
  ]);
};
