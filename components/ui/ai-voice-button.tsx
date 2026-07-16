"use client";

import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AiVoiceButtonProps {
  isActive?: boolean;
  onToggle?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * AiVoiceButton - A simple microphone button
 * with static styling based on active state.
 */
export function AiVoiceButton({
  isActive: controlledActive,
  onToggle,
  size = 'lg',
  className,
}: AiVoiceButtonProps) {
  const [internalActive, setInternalActive] = useState(false);
  const isActive = controlledActive ?? internalActive;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalActive((prev) => !prev);
    }
  };

  const sizeMap = {
    sm: { outer: 12, inner: 8, icon: 5 },
    md: { outer: 16, inner: 11, icon: 6 },
    lg: { outer: 20, inner: 14, icon: 7 },
  };

  const s = sizeMap[size];

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <button
        onClick={handleToggle}
        className={cn(
          'relative flex items-center justify-center rounded-full transition-colors',
          isActive
            ? 'bg-crimson-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]'
            : 'bg-zinc-700 hover:bg-zinc-600'
        )}
        style={{ width: s.outer * 4, height: s.outer * 4 }}
        aria-label={isActive ? 'Deactivate microphone' : 'Activate microphone'}
      >
        {/* Inner circle */}
        <div
          className={cn(
            'relative z-10 flex items-center justify-center rounded-full',
            isActive ? 'bg-crimson-600' : 'bg-zinc-700'
          )}
          style={{ width: s.inner * 4, height: s.inner * 4 }}
        >
          {/* Icon */}
          {isActive ? (
            <Mic className="text-white" style={{ width: s.icon * 2, height: s.icon * 2 }} />
          ) : (
            <MicOff className="text-zinc-400" style={{ width: s.icon * 2, height: s.icon * 2 }} />
          )}
        </div>
      </button>
    </div>
  );
}

/**
 * AiStatusIndicator - A simple status indicator showing AI state
 */
export function AiStatusIndicator({
  isActive = false,
  className,
}: {
  isActive?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        className={cn(
          'inline-block h-2.5 w-2.5 rounded-full',
          isActive ? 'bg-crimson-500' : 'bg-zinc-600'
        )}
      />
      <span className={cn('text-xs', isActive ? 'text-crimson-400' : 'text-zinc-500')}>
        {isActive ? 'AI is listening...' : 'AI idle'}
      </span>
    </div>
  );
}
