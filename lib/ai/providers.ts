import { createGroq } from '@ai-sdk/groq';
import { LanguageModel } from 'ai';
import { getModelById, hasProviderApiKey } from './models';

export function getLanguageModel(modelId: string): {
  model: LanguageModel | null;
  isMock: boolean;
  error?: string;
} {
  const modelInfo = getModelById(modelId);

  // If offline/demo simulator mode is chosen
  if (modelInfo.provider === 'mock') {
    return { model: null, isMock: true };
  }

  // Check Groq API key
  if (!hasProviderApiKey(modelInfo.provider)) {
    return {
      model: null,
      isMock: false,
      error: `Missing free Groq API key. Please add your free GROQ_API_KEY in .env.local (obtain free key at https://console.groq.com/keys with zero credit card required), or switch to Demo Assistant.`,
    };
  }

  try {
    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });
    const modelName = modelInfo.id.replace('groq/', '');
    return {
      model: groq(modelName) as unknown as LanguageModel,
      isMock: false,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      model: null,
      isMock: false,
      error: `Failed to initialize Groq model: ${message}`,
    };
  }
}
