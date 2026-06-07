import { PlanType } from './enums';

export interface User {
  id: string;
  email: string;
  password: string;
  plan: PlanType;
  balance: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  userId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageLog {
  id: string;
  userId: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
  createdAt: Date;
}
