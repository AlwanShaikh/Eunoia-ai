"use client";

import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  label?: string;
}

/**
 * TypingIndicator - Three glowing dots with pulse animation.
 * Styled with crimson/purple theme to match HAZE AI.
 */
export function TypingIndicator({ label = 'HAZE is thinking' }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="mb-3 flex justify-start"
    >
      <div className="flex items-center gap-3 rounded-[20px] border border-white/[0.06] bg-white/[0.04] px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-sm">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background:
                  dot === 1
                    ? 'linear-gradient(135deg, #DC143C, #8B5CF6)'
                    : dot === 0
                    ? 'linear-gradient(135deg, #DC143C, #e34d71)'
                    : 'linear-gradient(135deg, #8B5CF6, #a78bfa)',
              }}
              animate={{
                y: [0, -6, 0],
                opacity: [0.5, 1, 0.5],
                scale: [0.9, 1.15, 0.9],
                boxShadow: [
                  '0 0 4px rgba(220,20,60,0.2)',
                  '0 0 12px rgba(220,20,60,0.5)',
                  '0 0 4px rgba(220,20,60,0.2)',
                ],
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: dot * 0.2,
              }}
            />
          ))}
        </div>
        <motion.span
          className="text-xs font-medium tracking-wide text-zinc-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {label}
          <motion.span
            className="inline-block"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            ...
          </motion.span>
        </motion.span>
      </div>
    </motion.div>
  );
}