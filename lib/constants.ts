import { AIModel } from '@/types/chat';

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'groq/openai/gpt-oss-120b',
    name: 'GPT-OSS 120B (Groq)',
    provider: 'groq',
    providerName: 'Groq (Free)',
    description: 'Flagship 120B open-weights model running on Groq LPUs for ultra-fast, intelligent responses',
    badge: 'Free & Powerful',
    isDefault: true,
  },
  {
    id: 'groq/openai/gpt-oss-20b',
    name: 'GPT-OSS 20B (Groq)',
    provider: 'groq',
    providerName: 'Groq (Free)',
    description: 'Fast and lightweight 20B model on Groq for instant answers',
    badge: 'Free & Fastest',
  },
  {
    id: 'groq/qwen/qwen3.8-27b',
    name: 'Qwen 3.8 27B (Groq)',
    provider: 'groq',
    providerName: 'Groq (Free)',
    description: 'High-capability 27B multilingual model on Groq',
    badge: 'Free',
  },
  {
    id: 'mock/demo-assistant',
    name: 'Demo Assistant (Offline)',
    provider: 'mock',
    providerName: 'Local Simulator',
    description: 'Zero setup simulated streaming mode - works without any API keys!',
    badge: 'No Key Needed',
  },
];

export const DEFAULT_MODEL_ID = 'groq/openai/gpt-oss-120b';

export const STARTER_PROMPTS = [
  {
    title: 'Explain Quantum Computing',
    description: 'Simple, beginner-friendly analogies and key concepts',
    prompt: 'Explain quantum computing in simple terms with an everyday analogy.',
    category: 'Learning',
  },
  {
    title: 'Python Web Scraper',
    description: 'Complete script using BeautifulSoup and Requests',
    prompt: 'Write a clean Python script using BeautifulSoup and Requests to scrape news headlines safely.',
    category: 'Code',
  },
  {
    title: 'Next.js App vs Pages Router',
    description: 'Key architectural differences, pros & cons',
    prompt: 'Compare Next.js App Router and Pages Router with clear bullet points and migration tips.',
    category: 'Architecture',
  },
  {
    title: 'Draft a Professional Email',
    description: 'Requesting project review from a senior manager',
    prompt: 'Draft a polite, concise professional email requesting a code review and feedback on a new feature from a senior manager.',
    category: 'Writing',
  },
];

export const STORAGE_KEYS = {
  SESSIONS: 'nexus_ai_chat_sessions_v1',
  ACTIVE_SESSION_ID: 'nexus_ai_active_session_id',
  SELECTED_MODEL: 'nexus_ai_selected_model',
  SIDEBAR_OPEN: 'nexus_ai_sidebar_open',
} as const;

export const DEFAULT_SYSTEM_PROMPT = `You are Nexus AI, an exceptionally smart, friendly, and articulate full-stack AI assistant.
Respond with clarity, precision, and markdown formatting:
- Use code blocks with language identifiers when sharing code.
- Format structured answers using bullet points, numbered lists, and bold text.
- Be concise yet thorough, helpful, and welcoming.`;
