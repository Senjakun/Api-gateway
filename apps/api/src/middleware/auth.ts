import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  plan?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid authorization format. Expected: Bearer <token>' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, plan: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.userId = user.id;
    req.plan = user.plan;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requirePlan = (...plans: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.plan || !plans.includes(req.plan)) {
      return res.status(403).json({ error: 'Insufficient plan permissions' });
    }
    next();
  };
};
