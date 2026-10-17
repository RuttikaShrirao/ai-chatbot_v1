'use client';

import React from 'react';
import { PanelLeft, Plus, Sparkles, Trash2, History } from 'lucide-react';
import { ModelDropdown } from '@/components/ui/dropdown';
import { AIModel } from '@/types/chat';

interface HeaderProps {
  selectedModelId: string;
  onSelectModel: (model: AIModel) => void;
  activeKeys?: { [provider: string]: boolean };
  onNewChat: () => void;
  onClearMessages: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  hasMessages: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedModelId,
  onSelectModel,
  activeKeys,
  onNewChat,
  onClearMessages,
  isSidebarOpen,
  onToggleSidebar,
  hasMessages,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-3 md:px-6 h-16 bg-zinc-950/80 border-b border-zinc-800/80 backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-3">
        {/* Toggle Sidebar Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Collapse conversation history' : 'Open conversation history'}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-850/80 transition-colors cursor-pointer border border-transparent hover:border-zinc-800"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              Andro Buddy AI
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v1.0
              </span>
            </span>
          </div>
        </div>

        {/* Model Selector Dropdown */}
        <div className="ml-1 md:ml-3">
          <ModelDropdown
            selectedModelId={selectedModelId}
            onSelectModel={onSelectModel}
            activeKeys={activeKeys}
          />
        </div>
      </div>

      {/* Right Actions: New Chat & Clear */}
      <div className="flex items-center gap-2">
        {hasMessages && (
          <button
            type="button"
            onClick={onClearMessages}
            title="Clear current messages"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Clear Chat</span>
          </button>
        )}

        <button
          type="button"
          onClick={onNewChat}
          title="Start fresh conversation"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/25 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline font-semibold">New Chat</span>
        </button>
      </div>
    </header>
  );
};
