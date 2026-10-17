'use client';

import React from 'react';
import { ArrowDown } from 'lucide-react';
import { MessageItem } from './message-item';
import { TypingIndicator } from './typing-indicator';
import { ChatMessage } from '@/types/chat';

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  selectedModelName?: string;
  onCopyNotice?: (text: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  isAtBottom: boolean;
  scrollToBottom: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isStreaming,
  selectedModelName = 'AI',
  onCopyNotice,
  containerRef,
  bottomRef,
  isAtBottom,
  scrollToBottom,
}) => {
  // Check if assistant is generating but no tokens in last message yet
  const lastMessage = messages[messages.length - 1];
  const isWaitingForFirstToken =
    isStreaming &&
    (lastMessage?.role === 'user' ||
      (lastMessage?.role === 'assistant' &&
        (!lastMessage.content && (!lastMessage.parts || lastMessage.parts.length === 0))));

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-3 md:px-6 py-6 space-y-4 max-w-4xl w-full mx-auto custom-scrollbar relative"
    >
      {messages.map((msg, index) => {
        const isLast = index === messages.length - 1;
        const isCurrentStreaming = isStreaming && isLast && msg.role === 'assistant';

        return (
          <MessageItem
            key={msg.id || `msg-${index}`}
            message={msg}
            isStreaming={isCurrentStreaming}
            onCopyNotice={onCopyNotice}
          />
        );
      })}

      {/* Typing indicator when model is thinking / waiting for tokens */}
      {isWaitingForFirstToken && <TypingIndicator modelName={selectedModelName} />}

      {/* Invisible anchor for scrolling */}
      <div ref={bottomRef} className="h-4" />

      {/* Floating Scroll to Bottom button when scrolled up */}
      {!isAtBottom && (
        <button
          type="button"
          onClick={() => scrollToBottom()}
          className="fixed bottom-24 right-6 md:right-12 z-30 p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/25 transition-all duration-200 animate-in fade-in zoom-in-75 cursor-pointer active:scale-95"
          title="Scroll to latest message"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
