'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Zap, Sparkles, KeyRound } from 'lucide-react';
import { AVAILABLE_MODELS } from '@/lib/constants';
import { AIModel } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ModelDropdownProps {
  selectedModelId: string;
  onSelectModel: (model: AIModel) => void;
  activeKeys?: { [provider: string]: boolean };
}

export const ModelDropdown: React.FC<ModelDropdownProps> = ({
  selectedModelId,
  onSelectModel,
  activeKeys = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedModel =
    AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getProviderIcon = (provider: string) => {
    if (provider === 'groq') {
      return <Zap className="w-4 h-4 text-orange-400" />;
    }
    return <Sparkles className="w-4 h-4 text-indigo-400" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 text-zinc-100 transition-all text-sm font-medium shadow-sm backdrop-blur-md cursor-pointer"
        aria-expanded={isOpen}
      >
        {getProviderIcon(selectedModel.provider)}
        <span className="font-medium tracking-tight text-zinc-100">{selectedModel.name}</span>
        {selectedModel.badge && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
            {selectedModel.badge}
          </span>
        )}
        <ChevronDown
          className={cn(
            'w-4 h-4 text-zinc-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 md:w-96 rounded-2xl bg-zinc-900/95 border border-zinc-800/90 shadow-2xl backdrop-blur-xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Select Free AI Model
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              100% Free with Groq LPUs or Offline Demo Simulator
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1 py-1 pr-1 custom-scrollbar">
            {AVAILABLE_MODELS.map((model) => {
              const isSelected = model.id === selectedModel.id;
              const hasKey =
                model.provider === 'mock' ? true : Boolean(activeKeys[model.provider]);

              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    onSelectModel(model);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group cursor-pointer',
                    isSelected
                      ? 'bg-indigo-600/15 border border-indigo-500/30'
                      : 'hover:bg-zinc-800/70 border border-transparent'
                  )}
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-zinc-800/80 text-zinc-300 group-hover:text-white">
                    {getProviderIcon(model.provider)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-zinc-100 group-hover:text-white">
                        {model.name}
                      </span>
                      {model.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
                          {model.badge}
                        </span>
                      )}
                      {!hasKey && model.provider !== 'mock' && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          <KeyRound className="w-2.5 h-2.5" /> Key Needed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">
                      {model.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="p-1 rounded-full bg-indigo-500 text-white mt-1 shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
