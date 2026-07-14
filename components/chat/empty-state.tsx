"use client";

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

const suggestions = [
  'I feel anxious lately',
  'I need relationship advice',
  'Help me organize my thoughts',
  'I can\'t stop overthinking',
];

export function EmptyState({ onSelectPrompt }: EmptyStateProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-sky-400/20 bg-sky-400/10 text-sky-300">
        <Sparkles className="h-7 w-7" />
      </div>
      <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">How are you feeling today?</h2>
      <p className="mt-4 max-w-xl text-base leading-8 text-zinc-400">You can share what feels heavy, uncertain, or unresolved. Eunoia is here to help you reflect with care.</p>
      <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {suggestions.map((suggestion) => (
          <button key={suggestion} onClick={() => onSelectPrompt(suggestion)} className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-zinc-300 transition-all hover:-translate-y-0.5 hover:bg-white/[0.06] hover:text-white">
            {suggestion}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
