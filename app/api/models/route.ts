import { NextResponse } from 'next/server';
import { AVAILABLE_MODELS } from '@/lib/constants';
import { hasProviderApiKey } from '@/lib/ai/models';

export async function GET() {
  const modelsWithStatus = AVAILABLE_MODELS.map((model) => ({
    ...model,
    hasApiKey: hasProviderApiKey(model.provider),
  }));

  return NextResponse.json({
    models: modelsWithStatus,
    activeKeys: {
      groq: hasProviderApiKey('groq'),
    },
  });
}
