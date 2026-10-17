import { ChatSession } from '@/types/chat';
import { STORAGE_KEYS, DEFAULT_MODEL_ID } from './constants';
import { generateId } from './utils';

export function createDefaultSession(title = 'New Conversation', modelId = DEFAULT_MODEL_ID): ChatSession {
  const now = Date.now();
  return {
    id: `session_${generateId()}`,
    title,
    messages: [],
    modelId,
    createdAt: now,
    updatedAt: now,
  };
}

export function loadSessionsFromStorage(): ChatSession[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to parse chat sessions from localStorage:', error);
  }
  return [];
}

export function saveSessionsToStorage(sessions: ChatSession[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save chat sessions to localStorage:', error);
  }
}

export function loadActiveSessionId(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
  } catch (error) {
    console.warn('Failed to load active session id from localStorage:', error);
    return null;
  }
}

export function saveActiveSessionId(id: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION_ID, id);
  } catch (error) {
    console.error('Failed to save active session id to localStorage:', error);
  }
}

export function loadSelectedModel(): string {
  if (typeof window === 'undefined') return DEFAULT_MODEL_ID;

  try {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL) || DEFAULT_MODEL_ID;
  } catch (error) {
    return DEFAULT_MODEL_ID;
  }
}

export function saveSelectedModel(modelId: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, modelId);
  } catch (error) {
    console.error('Failed to save selected model to localStorage:', error);
  }
}
