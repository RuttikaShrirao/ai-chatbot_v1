import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  createUIMessageStream,
  type UIMessage,
} from 'ai';
import { getLanguageModel } from '@/lib/ai/providers';
import { createMockStreamResponse } from '@/lib/ai/mock-stream';
import { DEFAULT_MODEL_ID, DEFAULT_SYSTEM_PROMPT } from '@/lib/constants';


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages = [], model: requestedModel = DEFAULT_MODEL_ID } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract the latest user prompt text
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    let latestPromptText = '';
    if (lastUserMessage) {
      if (typeof lastUserMessage.content === 'string') {
        latestPromptText = lastUserMessage.content;
      } else if (Array.isArray(lastUserMessage.parts)) {
        latestPromptText = lastUserMessage.parts
          .filter((p: { type: string; text?: string }) => p.type === 'text' && p.text)
          .map((p: { text: string }) => p.text)
          .join(' ');
      }
    }

    // Resolve the model provider
    const { model, isMock, error } = getLanguageModel(requestedModel);

    // If mock model was chosen, stream the simulated response
    if (isMock) {
      return createMockStreamResponse(latestPromptText || 'Hello');
    }

    // If there is a configuration error (e.g., missing API key)
    if (error || !model) {
      const errorMessage = error || 'Selected model could not be initialized.';
      const stream = createUIMessageStream({
        execute({ writer }) {
          const partId = 'error-notice-part';
          writer.write({ type: 'text-start', id: partId });
          writer.write({
            type: 'text-delta',
            id: partId,
            delta: `### ⚠️ Provider Configuration Notice\n\n${errorMessage}\n\n**Quick Solution:**\n1. Add your API key to \`.env.local\` in the project root:\n   \`\`\`bash\n   GROQ_API_KEY=gsk_...\n   # or OPENAI_API_KEY=sk-...\n   # or FIREWORKS_API_KEY=fw_...\n   \`\`\`\n2. Or select **Demo Assistant (Offline / Mock)** from the model dropdown at the top to test real-time streaming immediately!`,
          });
          writer.write({ type: 'text-end', id: partId });
          writer.write({ type: 'finish', finishReason: 'stop' });
        },
      });
      return createUIMessageStreamResponse({ stream });
    }

    // Normalize messages so each message has parts array
    const normalizedMessages: UIMessage[] = messages.map((msg: { id?: string; role?: string; content?: string; parts?: Array<{ type: string; text?: string }> }, idx: number) => ({
      id: msg.id || `msg-${idx}-${Date.now()}`,
      role: (msg.role || 'user') as 'user' | 'assistant' | 'system',
      parts: msg.parts && Array.isArray(msg.parts) && msg.parts.length > 0
        ? (msg.parts as UIMessage['parts'])
        : [{ type: 'text', text: msg.content || '' }],
    }));

    // Stream text using Vercel AI SDK
    const modelMessages = await convertToModelMessages(normalizedMessages);

    const result = streamText({
      model,
      system: DEFAULT_SYSTEM_PROMPT,
      messages: modelMessages,
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (err: unknown) {
    console.error('Error handling chat request:', err);
    const message = err instanceof Error ? err.message : 'Internal Server Error';

    // Stream the error cleanly so UI can display it
    const stream = createUIMessageStream({
      execute({ writer }) {
        const partId = 'err-msg-part';
        writer.write({ type: 'text-start', id: partId });
        writer.write({
          type: 'text-delta',
          id: partId,
          delta: `❌ **An error occurred while communicating with the AI provider:**\n\n\`${message}\`\n\nPlease check your API key, network connection, or switch to another provider or the Demo model.`,
        });
        writer.write({ type: 'text-end', id: partId });
        writer.write({ type: 'finish', finishReason: 'error' });
      },
    });

    return createUIMessageStreamResponse({ stream });
  }
}
