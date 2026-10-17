import { AVAILABLE_MODELS, DEFAULT_MODEL_ID } from '../constants';
import { AIModel } from '@/types/chat';

export function getModelById(id: string): AIModel {
  const found = AVAILABLE_MODELS.find((m) => m.id === id);
  if (found) return found;
  return AVAILABLE_MODELS.find((m) => m.id === DEFAULT_MODEL_ID) || AVAILABLE_MODELS[0];
}

export function hasProviderApiKey(provider: string): boolean {
  switch (provider) {
    case 'groq':
      return Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 0);
    case 'mock':
      return true;
    default:
      return false;
  }
}
