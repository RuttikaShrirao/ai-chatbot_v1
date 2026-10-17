'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  id: string;
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose: (id: string) => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type = 'success',
  message,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-indigo-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30 bg-zinc-900/95 text-zinc-100',
    error: 'border-red-500/30 bg-zinc-900/95 text-zinc-100',
    info: 'border-indigo-500/30 bg-zinc-900/95 text-zinc-100',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shadow-xl backdrop-blur-md text-sm animate-in fade-in slide-in-from-bottom-3 duration-200',
        borders[type]
      )}
    >
      {icons[type]}
      <span className="font-medium text-xs md:text-sm">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="ml-2 text-zinc-400 hover:text-white transition-colors cursor-pointer p-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
