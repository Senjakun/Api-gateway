import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest, requirePlan } from '../middleware/auth';
import { generateApiKey, listApiKeys, deleteApiKey } from '../services/apiKeyService';
import { z } from 'zod';
import { validate } from '../middleware/validate';

export const adminRouter = Router();

adminRouter.use(authenticate);

adminRouter.get('/keys', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const keys = await listApiKeys(req.userId!);
    res.json(keys);
  } catch (err) {
    next(err);
  }
});

const createKeySchema = z.object({
  name: z.string().min(1),
});

adminRouter.post(
  '/keys',
  validate(createKeySchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const key = await generateApiKey(req.userId!, req.body.name);
      res.status(201).json(key);
    } catch (err) {
      next(err);
    }
  },
);

adminRouter.delete(
  '/keys/:keyId',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await deleteApiKey(req.userId!, req.params.keyId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);
