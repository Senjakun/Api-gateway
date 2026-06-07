import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { generateChatCompletion } from '../services/chatService';

export const chatRouter = Router();

chatRouter.use(authenticate);

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string().min(1),
    }),
  ).min(1),
  model: z.string().optional(),
});

chatRouter.post(
  '/completions',
  validate(chatSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { messages, model } = req.body;

      const result = await generateChatCompletion(userId, messages, { model });

      res.json({
        message: {
          role: 'assistant',
          content: result.text,
        },
        model: result.model,
        usage: {
          prompt_tokens: result.tokensIn,
          completion_tokens: result.tokensOut,
          total_tokens: result.tokensIn + result.tokensOut,
        },
        costUsd: result.costUsd,
      });
    } catch (err) {
      next(err);
    }
  },
);
