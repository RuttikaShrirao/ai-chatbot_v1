'use client';

import React, { useRef, useEffect } from 'react';
import { ArrowUp, Square, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  onStop?: () => void;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSubmit,
  isLoading,
  onStop,
  placeholder = 'Ask Andro Buddy anything... (Enter to send, Shift+Enter for new line)',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus input on initial load
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-resize textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSubmit();
      }
    }
  };

  const isSendDisabled = !input.trim() || isLoading;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!isLoading && input.trim()) {
          onSubmit(e);
        }
      }}
      className="relative flex flex-col w-full max-w-4xl mx-auto rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-xl transition-all focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20"
    >
      <div className="flex items-end gap-2 px-4 py-3">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="flex-1 max-h-48 resize-none bg-transparent text-sm md:text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none leading-relaxed py-1"
        />

        {/* Action Button: Send or Stop */}
        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            title="Stop generating"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
          >
            <Square className="w-4 h-4 fill-current text-rose-400" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSendDisabled}
            title={isSendDisabled ? 'Type a message to send' : 'Send message (Enter)'}
            className={cn(
              'flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 shadow-sm shrink-0',
              isSendDisabled
                ? 'bg-zinc-800 text-zinc-600 opacity-60 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 cursor-pointer active:scale-95'
            )}
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between px-4 pb-2 pt-0 text-[11px] text-zinc-500 border-t border-zinc-800/40">
        <span className="flex items-center gap-1.5 hidden sm:inline-flex">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          Real-time stream with Vercel AI SDK
        </span>
        <span className="ml-auto">
          {input.length > 0 && `${input.length} chars • `}
          <span className="hidden sm:inline">Shift+Enter for new line</span>
        </span>
      </div>
    </form>
  );
};
