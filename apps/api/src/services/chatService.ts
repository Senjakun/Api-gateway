import axios from 'axios';
import { getKeyRotator } from '../lib/keyRotator';
import { getModelPricing, MARKUP_MULTIPLIER } from '../lib/pricing';
import { deductBalance, recordUsage, checkBalance } from './usageService';

const API_BASE = process.env.UPSTREAM_API_BASE || 'https://inference.do-ai.run/v1';

interface ChatCompletionPayload {
  model: string;
  messages: Array<{ role: string; content: string }>;
  max_tokens?: number;
  temperature?: number;
}

interface ChatChoice {
  message: {
    content: string;
    role: string;
  };
  finish_reason: string;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const computeCost = (
  model: string,
  promptTokens: number,
  completionTokens: number,
): number => {
  const pricing = getModelPricing(model);
  const baseCost =
    (promptTokens / 1000) * pricing.inputPrice +
    (completionTokens / 1000) * pricing.outputPrice;
  return baseCost * MARKUP_MULTIPLIER;
};

export const generateChatCompletion = async (
  userId: string,
  messages: Array<{ role: string; content: string }>,
  options?: { model?: string },
) => {
  const hasBalance = await checkBalance(userId);
  if (!hasBalance) {
    throw { status: 429, message: 'Insufficient balance. Please top up.' };
  }

  const model = options?.model || 'deepseek-v4-pro';
  const payload: ChatCompletionPayload = {
    model,
    messages,
    max_tokens: 2048,
    temperature: 0.7,
  };

  const rotator = getKeyRotator();
  const upstreamKey = rotator.getNextKey();

  try {
    const response = await axios.post<ChatCompletionResponse>(
      `${API_BASE}/chat/completions`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${upstreamKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      },
    );

    rotator.recordSuccess(upstreamKey);

    const completion = response.data;
    const choice = completion.choices[0];
    if (!choice) {
      throw new Error('No completion choice returned');
    }

    const tokensIn = completion.usage.prompt_tokens;
    const tokensOut = completion.usage.completion_tokens;
    const costUsd = computeCost(model, tokensIn, tokensOut);

    await deductBalance(userId, costUsd);
    await recordUsage(
      userId,
      completion.model,
      tokensIn,
      tokensOut,
      costUsd,
    );

    return {
      text: choice.message.content,
      model: completion.model,
      tokensIn,
      tokensOut,
      costUsd,
    };
  } catch (error: any) {
    rotator.recordError(upstreamKey);
    if (error.response) {
      const status = error.response.status;
      throw {
        status: status >= 500 ? 502 : status,
        message: `Upstream error: ${error.response.statusText}`,
      };
    }
    throw { status: 502, message: 'Failed to reach upstream AI service' };
  }
};

export const generateChatCompletionLight = async (
  userId: string,
  messages: Array<{ role: string; content: string }>,
) => {
  return generateChatCompletion(userId, messages, { model: 'deepseek-4-flash' });
};
