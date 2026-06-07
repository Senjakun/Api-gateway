import axios from 'axios';
import { getApiKey, getApiUrl } from './config';

export interface ModelInfo {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

let cachedModels: ModelInfo[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function fetchAvailableModels(): Promise<ModelInfo[]> {
  const now = Date.now();
  if (cachedModels && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedModels;
  }

  const baseUrl = getApiUrl();
  const apiKey = getApiKey();

  const response = await axios.get<{ data: ModelInfo[] }>(`${baseUrl}/models`, {
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    timeout: 10000,
  });

  const models = response.data?.data ?? [];
  cachedModels = models;
  cacheTimestamp = now;
  return models;
}

export async function callChatCompletion(
  messages: Array<{ role: string; content: string }>,
  model?: string,
): Promise<{
  content: string;
  model: string;
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}> {
  const baseUrl = getApiUrl();
  const apiKey = getApiKey();

  const resp = await axios.post(
    `${baseUrl}/chat/completions`,
    { messages, model },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    },
  );

  const data = resp.data;
  return {
    content: data.message?.content ?? '',
    model: data.model ?? '',
    usage: data.usage ?? {},
  };
}

export async function callApi<T>(
  method: 'GET' | 'POST' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  const baseUrl = getApiUrl();
  const apiKey = getApiKey();

  const options: any = {
    method,
    url: `${baseUrl}${path}`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  };

  if (body !== undefined) {
    options.data = body;
  }

  const resp = await axios(options);
  return resp.data as T;
}
