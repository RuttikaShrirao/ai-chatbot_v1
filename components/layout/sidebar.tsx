'use client';

import React from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  X,
  Sparkles,
  Bot,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { ChatSession } from '@/types/chat';
import { cn, formatTimestamp } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onClearAllSessions: () => void;
  activeModelName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearAllSessions,
  activeModelName = 'AI',
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-50 flex flex-col w-72 md:w-80 bg-zinc-950 border-r border-zinc-800/80 transition-all duration-300 ease-in-out shrink-0',
          isOpen ? 'translate-x-0' : '-translate-x-full md:-ml-80'
        )}
      >
        {/* Header with New Chat & Close */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800/80">
          <button
            type="button"
            onClick={onNewChat}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-white font-medium text-xs md:text-sm border border-zinc-800 transition-all shadow-sm cursor-pointer hover:border-zinc-700"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>New Conversation</span>
          </button>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={onClose}
            className="ml-2 p-2 rounded-xl text-zinc-400 hover:text-white md:hidden hover:bg-zinc-850 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          <div className="px-2 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
            <span>Conversations</span>
            <span className="text-zinc-600">{sessions.length}</span>
          </div>

          {sessions.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-zinc-500">
              <Bot className="w-8 h-8 mx-auto mb-2 text-zinc-700" />
              <p>No saved conversations yet.</p>
              <p className="text-[11px] text-zinc-600 mt-1">
                Your chats will persist here automatically!
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const messageCount = session.messages.length;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={cn(
                    'group relative flex items-center justify-between p-2.5 rounded-xl text-xs md:text-sm transition-all cursor-pointer select-none',
                    isActive
                      ? 'bg-zinc-900 text-white font-medium border border-zinc-700/60 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare
                      className={cn(
                        'w-4 h-4 shrink-0',
                        isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-400'
                      )}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{session.title || 'Untitled Chat'}</span>
                      <span className="text-[10px] text-zinc-500">
                        {messageCount} msg{messageCount === 1 ? '' : 's'} • {formatTimestamp(session.updatedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Delete Session Button */}
                  <button
                    type="button"
                    onClick={(e) => onDeleteSession(session.id, e)}
                    title="Delete conversation"
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 transition-all cursor-pointer ml-1 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Info & Clear All */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60 space-y-2">
          {sessions.length > 0 && (
            <button
              type="button"
              onClick={onClearAllSessions}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All History</span>
            </button>
          )}

          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/60 text-[11px] text-zinc-400">
            <div className="flex items-center gap-1.5 text-zinc-200 font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Local Session Persistence</span>
            </div>
            <p className="text-zinc-500 leading-tight">
              All messages remain saved in your browser&apos;s localStorage across page refreshes.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
