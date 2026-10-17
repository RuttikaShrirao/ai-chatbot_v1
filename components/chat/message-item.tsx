'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Sparkles } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { CodeBlock } from './code-block';
import { ChatMessage } from '@/types/chat';
import { copyTextToClipboard, extractMessageContent, formatTimestamp, cn } from '@/lib/utils';

interface MessageItemProps {
  message: ChatMessage;
  onCopyNotice?: (text: string) => void;
  isStreaming?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onCopyNotice,
  isStreaming = false,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const textContent = extractMessageContent(message);

  const handleCopy = async () => {
    if (!textContent) return;
    const success = await copyTextToClipboard(textContent);
    if (success) {
      setCopied(true);
      onCopyNotice?.('Message copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={cn(
        'group flex gap-3.5 md:gap-5 p-4 md:p-5 rounded-2xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isUser
          ? 'bg-zinc-800/40 border border-zinc-700/30 ml-auto max-w-3xl'
          : 'bg-zinc-900/50 border border-zinc-800/50 w-full'
      )}
    >
      <Avatar role={message.role} size="md" className="mt-0.5" />

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* Author Header */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-tight text-zinc-200">
              {isUser ? 'You' : 'Andro Buddy AI'}
            </span>
            {message.createdAt && (
              <span className="text-[11px] text-zinc-500">
                {formatTimestamp(message.createdAt)}
              </span>
            )}
            {!isUser && isStreaming && (
              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-400 font-medium animate-pulse">
                <Sparkles className="w-2.5 h-2.5" /> streaming
              </span>
            )}
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            type="button"
            title="Copy message"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Message Content */}
        <div className="markdown-content text-sm md:text-[15px] leading-relaxed text-zinc-200 break-words selection:bg-indigo-600/30">
          {isUser ? (
            <p className="whitespace-pre-wrap">{textContent}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'>) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children || '').replace(/\n$/, '');
                  const isInline = !match && !codeString.includes('\n');

                  if (isInline) {
                    return (
                      <code
                        className="px-1.5 py-0.5 rounded-md bg-zinc-800/90 text-indigo-300 font-mono text-[0.88em] border border-zinc-700/50"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  return (
                    <CodeBlock
                      language={match ? match[1] : 'text'}
                      value={codeString}
                    />
                  );
                },
                p({ children }) {
                  return <p className="mb-3 last:mb-0">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>;
                },
                li({ children }) {
                  return <li className="pl-1 leading-relaxed">{children}</li>;
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-4 border-indigo-500/60 pl-4 py-1 my-3 bg-indigo-950/20 rounded-r-lg text-zinc-300 italic">
                      {children}
                    </blockquote>
                  );
                },
                h1({ children }) {
                  return <h1 className="text-xl font-bold text-white mt-4 mb-2">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-lg font-bold text-white mt-3 mb-2">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-base font-semibold text-white mt-3 mb-1.5">{children}</h3>;
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-4 rounded-xl border border-zinc-800 bg-zinc-950/50">
                      <table className="min-w-full divide-y divide-zinc-800 text-left text-xs md:text-sm">
                        {children}
                      </table>
                    </div>
                  );
                },
                thead({ children }) {
                  return <thead className="bg-zinc-900/80 text-zinc-300 font-semibold">{children}</thead>;
                },
                th({ children }) {
                  return <th className="px-3.5 py-2.5 font-semibold text-zinc-200">{children}</th>;
                },
                td({ children }) {
                  return <td className="px-3.5 py-2 border-t border-zinc-800/60 text-zinc-300">{children}</td>;
                },
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors font-medium"
                    >
                      {children}
                    </a>
                  );
                },
              }}
            >
              {textContent}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};
