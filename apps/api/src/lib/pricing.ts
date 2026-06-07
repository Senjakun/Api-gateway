interface ModelPricing {
  inputPrice: number;  // USD per 1K tokens
  outputPrice: number; // USD per 1K tokens
}

const DEFAULT_PRICING: ModelPricing = {
  inputPrice: 0.001,
  outputPrice: 0.002,
};

export const MARKUP_MULTIPLIER = 1.4;

const MODEL_PRICE_MAP: Record<string, ModelPricing> = {
  'deepseek-v4-pro': {
    inputPrice: 0.001,
    outputPrice: 0.002,
  },
  'deepseek-4-flash': {
    inputPrice: 0.00015,
    outputPrice: 0.0006,
  },
  'gpt-4o': {
    inputPrice: 0.005,
    outputPrice: 0.015,
  },
  'gpt-4o-mini': {
    inputPrice: 0.00015,
    outputPrice: 0.0006,
  },
};

export const getModelPricing = (model: string): ModelPricing => {
  return MODEL_PRICE_MAP[model] || DEFAULT_PRICING;
};
