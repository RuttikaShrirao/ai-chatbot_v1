'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { MessageList } from '@/components/chat/message-list';
import { ChatInput } from '@/components/chat/chat-input';
import { EmptyState } from '@/components/chat/empty-state';
import { Toast } from '@/components/ui/toast';
import { useChatSession } from '@/hooks/use-chat-session';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';

export const ChatContainer: React.FC = () => {
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeKeys, setActiveKeys] = useState<{ [key: string]: boolean }>({});

  const {
    sessions,
    activeSessionId,
    selectedModel,
    selectedModelId,
    messages,
    isStreaming,
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
  } = useChatSession();

  const { containerRef, bottomRef, isAtBottom, scrollToBottom } = useScrollToBottom();

  // Check which API keys are configured on the server
  useEffect(() => {
    fetch('/api/models')
      .then((res) => res.json())
      .then((data) => {
        if (data.activeKeys) {
          setActiveKeys(data.activeKeys);
        }
      })
      .catch((err) => console.warn('Could not fetch active models status:', err));
  }, []);

  // Auto-scroll when new messages arrive or while streaming
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom(false);
    }
  }, [messages, isStreaming, isAtBottom, scrollToBottom]);

  // Handle submitting user message
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isStreaming) return;

    sendMessage({ text: text.trim() });
    setInput('');
    // Ensure smooth scroll to bottom on submission
    setTimeout(() => scrollToBottom(true), 50);
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar for session / conversation history */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onClearAllSessions={handleClearAllSessions}
        activeModelName={selectedModel.name}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Header */}
        <Header
          selectedModelId={selectedModelId}
          onSelectModel={handleSelectModel}
          activeKeys={activeKeys}
          onNewChat={handleNewChat}
          onClearMessages={handleClearCurrentMessages}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          hasMessages={messages.length > 0}
        />

        {/* Message Area or Empty State */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {messages.length === 0 ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center p-4">
              <EmptyState
                onSelectPrompt={(promptText) => {
                  setInput(promptText);
                  handleSendMessage(promptText);
                }}
                selectedModelName={selectedModel.name}
              />
            </div>
          ) : (
            <MessageList
              messages={messages}
              isStreaming={isStreaming}
              selectedModelName={selectedModel.name}
              onCopyNotice={(msg) =>
                setToastMessage({
                  id: String(Date.now()),
                  message: msg,
                  type: 'success',
                })
              }
              containerRef={containerRef}
              bottomRef={bottomRef}
              isAtBottom={isAtBottom}
              scrollToBottom={scrollToBottom}
            />
          )}

          {/* Sticky Input Bar at the Bottom */}
          <div className="p-3 md:p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent shrink-0">
            <ChatInput
              input={input}
              setInput={setInput}
              onSubmit={() => handleSendMessage()}
              isLoading={isStreaming}
              onStop={stop}
              placeholder={`Ask ${selectedModel.name}... (Enter to send)`}
            />
          </div>
        </main>

        {/* Toast Notification Container */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50">
            <Toast
              id={toastMessage.id}
              type={toastMessage.type || 'success'}
              message={toastMessage.message}
              onClose={() => setToastMessage(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
