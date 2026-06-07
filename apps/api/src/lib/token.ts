import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: EXPIRES_IN });
};
