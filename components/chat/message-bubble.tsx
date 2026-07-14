"use client";

import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

function renderContent(content: string, isUser: boolean) {
  const lines = content.split('\n');

  return lines.map((line, index) => {
    if (line.startsWith('###')) {
      return <h3 key={`${line}-${index}`} className="mt-3 text-sm font-semibold text-white">{line.replace('###', '').trim()}</h3>;
    }
    if (line.startsWith('- ')) {
      return <li key={`${line}-${index}`} className="ml-4 mt-2 list-disc text-sm leading-7 text-zinc-300">{line.replace('- ', '')}</li>;
    }
    if (line.startsWith('> ')) {
      return <blockquote key={`${line}-${index}`} className="mt-2 border-l border-sky-400/30 pl-3 text-sm italic text-zinc-400">{line.replace('> ', '')}</blockquote>;
    }
    if (line.trim().length === 0) {
      return <div key={`${line}-${index}`} className="h-2" />;
    }
    return <p key={`${line}-${index}`} className={cn('text-sm leading-7', isUser ? 'text-white' : 'text-zinc-300')}>{line}</p>;
  });
}

export function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.25 }} className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex max-w-[88%] items-start gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full border', isUser ? 'border-[#6D5EF9]/30 bg-[#6D5EF9]/20 text-white' : 'border-sky-400/20 bg-sky-400/10 text-sky-300')}>
          {isUser ? 'Y' : <Bot className="h-4 w-4" />}
        </div>
        <div className={cn('rounded-[22px] px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.2)]', isUser ? 'bg-gradient-to-r from-[#6D5EF9] to-[#8B5CF6] text-white' : 'border border-white/10 bg-white/[0.06] text-zinc-200 backdrop-blur-xl')}>
          <div className="space-y-1">{renderContent(content, isUser)}</div>
          <p className={cn('mt-2 text-[11px]', isUser ? 'text-white/70' : 'text-zinc-500')}>{timestamp}</p>
        </div>
      </div>
    </motion.div>
  );
}
