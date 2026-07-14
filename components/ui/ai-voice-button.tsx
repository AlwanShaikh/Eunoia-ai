"use client";

import { motion, AnimatePresence } from 'framer-motion';
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
 * AiVoiceButton - A glowing futuristic microphone button
 * with breathing/pulse animation when active.
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
      <motion.button
        onClick={handleToggle}
        className={cn(
          'relative flex items-center justify-center rounded-full transition-colors',
          isActive
            ? 'bg-crimson-600/20 shadow-[0_0_30px_rgba(220,38,38,0.3)]'
            : 'bg-white/5 hover:bg-white/10'
        )}
        style={{ width: s.outer * 4, height: s.outer * 4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isActive ? 'Deactivate microphone' : 'Activate microphone'}
      >
        {/* Outer glow rings */}
        <AnimatePresence>
          {isActive && (
            <>
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-crimson-500/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
                exit={{ opacity: 0, scale: 1.3 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.span
                className="absolute inset-0 rounded-full border border-crimson-400/20"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1] }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              />
              <motion.span
                className="absolute inset-0 rounded-full bg-crimson-500/10"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.4, 1] }}
                exit={{ opacity: 0, scale: 1.6 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Inner circle */}
        <motion.div
          className={cn(
            'relative z-10 flex items-center justify-center rounded-full',
            isActive ? 'bg-crimson-600' : 'bg-zinc-700'
          )}
          style={{ width: s.inner * 4, height: s.inner * 4 }}
          animate={
            isActive
              ? {
                  boxShadow: [
                    '0 0 20px rgba(220,38,38,0.4)',
                    '0 0 40px rgba(220,38,38,0.6)',
                    '0 0 20px rgba(220,38,38,0.4)',
                  ],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Breathing pulse */}
          <motion.div
            className="absolute inset-0 rounded-full bg-crimson-500/20"
            animate={
              isActive
                ? {
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }
                : { scale: 1, opacity: 0 }
            }
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Icon */}
          {isActive ? (
            <Mic className="relative z-10 text-white" style={{ width: s.icon * 2, height: s.icon * 2 }} />
          ) : (
            <MicOff className="relative z-10 text-zinc-400" style={{ width: s.icon * 2, height: s.icon * 2 }} />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}

/**
 * AiStatusIndicator - A small pulsing dot indicating AI is active/thinking
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
      <motion.span
        className={cn(
          'inline-block h-2.5 w-2.5 rounded-full',
          isActive ? 'bg-crimson-500' : 'bg-zinc-600'
        )}
        animate={
          isActive
            ? {
                scale: [1, 1.4, 1],
                opacity: [0.7, 1, 0.7],
                boxShadow: [
                  '0 0 4px rgba(220,38,38,0.4)',
                  '0 0 12px rgba(220,38,38,0.8)',
                  '0 0 4px rgba(220,38,38,0.4)',
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className={cn('text-xs', isActive ? 'text-crimson-400' : 'text-zinc-500')}>
        {isActive ? 'AI is listening...' : 'AI idle'}
      </span>
    </div>
  );
}