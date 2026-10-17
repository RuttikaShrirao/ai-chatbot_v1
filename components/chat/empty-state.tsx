'use client';

import React from 'react';
import { Sparkles, ArrowUpRight, Zap, Code, BookOpen, Mail } from 'lucide-react';
import { STARTER_PROMPTS } from '@/lib/constants';

interface EmptyStateProps {
  onSelectPrompt: (promptText: string) => void;
  selectedModelName?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onSelectPrompt,
  selectedModelName = 'AI',
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Code':
        return <Code className="w-4 h-4 text-emerald-400" />;
      case 'Learning':
        return <BookOpen className="w-4 h-4 text-sky-400" />;
      case 'Writing':
        return <Mail className="w-4 h-4 text-pink-400" />;
      default:
        return <Zap className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-4 text-center animate-in fade-in zoom-in-95 duration-300">
      {/* Bot Icon with glowing halo */}
      <div className="relative mb-6">
        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-40 blur-xl animate-pulse" />
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 text-indigo-400 shadow-2xl">
          <Sparkles className="w-8 h-8" />
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
        What can I help you build or explore?
      </h2>
      <p className="text-sm md:text-base text-zinc-400 max-w-md mb-8">
        Connected to <span className="text-indigo-400 font-medium">{selectedModelName}</span>. Ask any question, draft content, or select a starter prompt below.
      </p>

      {/* Starter Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {STARTER_PROMPTS.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelectPrompt(item.prompt)}
            className="group relative flex flex-col justify-between p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700/80 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                  {getCategoryIcon(item.category)}
                  {item.category}
                </span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2">
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
