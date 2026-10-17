'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, UIMessage } from 'ai';
import { ChatSession, AIModel, ChatMessage } from '@/types/chat';
import {
  loadSessionsFromStorage,
  saveSessionsToStorage,
  loadActiveSessionId,
  saveActiveSessionId,
  loadSelectedModel,
  saveSelectedModel,
  createDefaultSession,
} from '@/lib/storage';
import { AVAILABLE_MODELS, DEFAULT_MODEL_ID } from '@/lib/constants';
import { extractMessageContent } from '@/lib/utils';

export function useChatSession() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_MODEL_ID);
  const [isHydrated, setIsHydrated] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ id: string; message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  // Ref to always provide the latest selected model to the transport without recreating it
  const selectedModelIdRef = useRef(selectedModelId);
  useEffect(() => {
    selectedModelIdRef.current = selectedModelId;
    if (isHydrated) {
      saveSelectedModel(selectedModelId);
    }
  }, [selectedModelId, isHydrated]);

  // Stable transport for useChat
  const transport = useMemo(
    () =>
      new DefaultChatTransport<UIMessage>({
        api: '/api/chat',
        prepareSendMessagesRequest: ({ messages, id }) => ({
          body: {
            messages,
            id,
            model: selectedModelIdRef.current,
          },
        }),
      }),
    []
  );

  // Vercel AI SDK useChat hook
  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    error,
  } = useChat({
    transport,
    onError: (err) => {
      console.error('Chat streaming error:', err);
      setToastMessage({
        id: String(Date.now()),
        message: err.message || 'Stream error occurred. Check provider settings.',
        type: 'error',
      });
    },
  });

  const isStreaming = status === 'streaming' || status === 'submitted';

  // 1. Initial hydration from localStorage
  useEffect(() => {
    const loadedSessions = loadSessionsFromStorage();
    const loadedActiveId = loadActiveSessionId();
    const loadedModel = loadSelectedModel();

    setSelectedModelId(loadedModel);

    if (loadedSessions.length > 0) {
      setSessions(loadedSessions);
      const active = loadedSessions.find((s) => s.id === loadedActiveId) || loadedSessions[0];
      setActiveSessionId(active.id);

      if (active.messages && active.messages.length > 0) {
        // Convert to UIMessage format for useChat
        const formatted = active.messages.map((m) => ({
          id: m.id,
          role: m.role,
          parts: m.parts && m.parts.length > 0 ? m.parts : [{ type: 'text' as const, text: m.content || '' }],
        })) as UIMessage[];
        setMessages(formatted);
      }
    } else {
      // First time initialization
      const initial = createDefaultSession('Welcome to Andro Buddy', loadedModel);
      setSessions([initial]);
      setActiveSessionId(initial.id);
      saveSessionsToStorage([initial]);
      saveActiveSessionId(initial.id);
    }

    setIsHydrated(true);
  }, [setMessages]);

  // 2. Synchronize current messages into active session in state & localStorage
  useEffect(() => {
    if (!isHydrated || !activeSessionId) return;

    setSessions((prevSessions) => {
      const sessionIndex = prevSessions.findIndex((s) => s.id === activeSessionId);
      if (sessionIndex === -1) return prevSessions;

      const currentSession = prevSessions[sessionIndex];

      // Convert UIMessage to our stored ChatMessage
      const convertedMessages: ChatMessage[] = messages.map((m) => {
        const text = extractMessageContent(m as unknown as ChatMessage);
        return {
          id: m.id,
          role: m.role as 'user' | 'assistant' | 'system',
          content: text,
          parts: [{ type: 'text', text }],
          createdAt: Date.now(),
        };
      });

      // Update title from first user message if still default title
      let updatedTitle = currentSession.title;
      if (
        (updatedTitle === 'New Conversation' || updatedTitle === 'Welcome to Andro Buddy') &&
        convertedMessages.length > 0
      ) {
        const firstUserMsg = convertedMessages.find((m) => m.role === 'user');
        if (firstUserMsg && firstUserMsg.content.trim()) {
          const trimmed = firstUserMsg.content.trim();
          updatedTitle = trimmed.length > 32 ? trimmed.substring(0, 32) + '...' : trimmed;
        }
      }

      const updatedSession: ChatSession = {
        ...currentSession,
        title: updatedTitle,
        messages: convertedMessages,
        modelId: selectedModelId,
        updatedAt: Date.now(),
      };

      const newSessions = [...prevSessions];
      newSessions[sessionIndex] = updatedSession;
      saveSessionsToStorage(newSessions);
      return newSessions;
    });
  }, [messages, activeSessionId, isHydrated, selectedModelId]);

  // Action: Start a New Chat
  const handleNewChat = useCallback(() => {
    if (isStreaming) {
      stop();
    }
    const newSession = createDefaultSession('New Conversation', selectedModelId);
    setSessions((prev) => {
      const updated = [newSession, ...prev];
      saveSessionsToStorage(updated);
      return updated;
    });
    setActiveSessionId(newSession.id);
    saveActiveSessionId(newSession.id);
    setMessages([]);
    setToastMessage({
      id: String(Date.now()),
      message: 'Started new conversation',
      type: 'success',
    });
  }, [isStreaming, stop, selectedModelId, setMessages]);

  // Action: Switch to a different session
  const handleSelectSession = useCallback(
    (sessionId: string) => {
      if (sessionId === activeSessionId) return;
      if (isStreaming) {
        stop();
      }

      const target = sessions.find((s) => s.id === sessionId);
      if (!target) return;

      setActiveSessionId(target.id);
      saveActiveSessionId(target.id);

      if (target.modelId) {
        setSelectedModelId(target.modelId);
      }

      const formatted = (target.messages || []).map((m) => ({
        id: m.id,
        role: m.role,
        parts: m.parts && m.parts.length > 0 ? m.parts : [{ type: 'text' as const, text: m.content || '' }],
      })) as UIMessage[];

      setMessages(formatted);
    },
    [activeSessionId, isStreaming, stop, sessions, setMessages]
  );

  // Action: Delete a session
  const handleDeleteSession = useCallback(
    (sessionId: string, e: React.MouseEvent) => {
      e.stopPropagation();

      const remaining = sessions.filter((s) => s.id !== sessionId);

      if (remaining.length === 0) {
        const fresh = createDefaultSession('New Conversation', selectedModelId);
        setSessions([fresh]);
        setActiveSessionId(fresh.id);
        saveSessionsToStorage([fresh]);
        saveActiveSessionId(fresh.id);
        setMessages([]);
      } else {
        setSessions(remaining);
        saveSessionsToStorage(remaining);

        if (activeSessionId === sessionId) {
          const nextActive = remaining[0];
          setActiveSessionId(nextActive.id);
          saveActiveSessionId(nextActive.id);
          const formatted = (nextActive.messages || []).map((m) => ({
            id: m.id,
            role: m.role,
            parts: m.parts && m.parts.length > 0 ? m.parts : [{ type: 'text' as const, text: m.content || '' }],
          })) as UIMessage[];
          setMessages(formatted);
        }
      }

      setToastMessage({
        id: String(Date.now()),
        message: 'Conversation deleted',
        type: 'info',
      });
    },
    [sessions, activeSessionId, selectedModelId, setMessages]
  );

  // Action: Clear messages for current session
  const handleClearCurrentMessages = useCallback(() => {
    if (isStreaming) {
      stop();
    }
    setMessages([]);
    setSessions((prev) => {
      const updated = prev.map((s) =>
        s.id === activeSessionId ? { ...s, messages: [], updatedAt: Date.now() } : s
      );
      saveSessionsToStorage(updated);
      return updated;
    });
    setToastMessage({
      id: String(Date.now()),
      message: 'Chat messages cleared',
      type: 'info',
    });
  }, [isStreaming, stop, setMessages, activeSessionId]);

  // Action: Clear all sessions
  const handleClearAllSessions = useCallback(() => {
    if (isStreaming) {
      stop();
    }
    const fresh = createDefaultSession('New Conversation', selectedModelId);
    setSessions([fresh]);
    setActiveSessionId(fresh.id);
    saveSessionsToStorage([fresh]);
    saveActiveSessionId(fresh.id);
    setMessages([]);
    setToastMessage({
      id: String(Date.now()),
      message: 'All conversations cleared',
      type: 'info',
    });
  }, [isStreaming, stop, selectedModelId, setMessages]);

  // Action: Select model
  const handleSelectModel = useCallback((model: AIModel) => {
    setSelectedModelId(model.id);
    setToastMessage({
      id: String(Date.now()),
      message: `Switched to ${model.name}`,
      type: 'success',
    });
  }, []);

  // Normalizing messages for the UI components
  const chatMessages: ChatMessage[] = useMemo(() => {
    return messages.map((m) => {
      const content = extractMessageContent(m as unknown as ChatMessage);
      return {
        id: m.id,
        role: m.role as 'user' | 'assistant' | 'system',
        content,
        parts: [{ type: 'text', text: content }],
        createdAt: Date.now(),
      };
    });
  }, [messages]);

  const selectedModel =
    AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];

  return {
    sessions,
    activeSessionId,
    selectedModel,
    selectedModelId,
    messages: chatMessages,
    isStreaming,
    status,
    error,
    isHydrated,
    toastMessage,
    setToastMessage,
    sendMessage,
    stop,
    handleNewChat,
    handleSelectSession,
    handleDeleteSession,
    handleClearCurrentMessages,
    handleClearAllSessions,
    handleSelectModel,
  };
}
