import React from 'react';
import { Avatar } from '@/components/ui/avatar';

interface TypingIndicatorProps {
  modelName?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ modelName = 'AI' }) => {
  return (
    <div className="flex items-start gap-4 py-4 px-4 md:px-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/40 animate-in fade-in duration-300">
      <Avatar role="assistant" size="md" />

      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-300">{modelName}</span>
          <span className="text-[11px] text-zinc-500">generating response...</span>
        </div>

        <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-zinc-800/60 w-fit">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
        </div>
      </div>
    </div>
  );
};
