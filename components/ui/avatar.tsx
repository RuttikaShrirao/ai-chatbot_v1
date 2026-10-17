import React from 'react';
import { Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  role: 'user' | 'assistant' | 'system';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ role, className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (role === 'assistant') {
    return (
      <div
        className={cn(
          'relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20 shrink-0',
          sizeClasses[size],
          className
        )}
      >
        <Sparkles className={cn(iconSizes[size], 'animate-pulse')} />
        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-zinc-900" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl bg-gradient-to-tr from-zinc-700 to-zinc-600 text-zinc-100 shadow-sm ring-1 ring-white/10 shrink-0',
        sizeClasses[size],
        className
      )}
    >
      <User className={iconSizes[size]} />
    </div>
  );
};
