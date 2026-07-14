"use client";

import { motion } from 'framer-motion';
import { Paperclip, SendHorizonal, Mic, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isDisabled?: boolean;
}

export function ChatInput({ value, onChange, onSend, isDisabled }: ChatInputProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="border-t border-white/10 bg-[#09090B]/70 px-4 py-4 sm:px-6">
      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-3 shadow-[0_16px_45px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <div className="flex items-end gap-2 sm:gap-3">
          <button aria-label="Attach file" className="hidden rounded-full border border-white/10 bg-white/[0.04] p-3 text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-white sm:inline-flex">
            <Paperclip className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <Input
              aria-label="Message input"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  onSend();
                }
              }}
              placeholder="Share what’s on your mind..."
              className="h-14 border-0 bg-transparent px-0 text-base text-white placeholder:text-zinc-500 focus:bg-transparent"
            />
          </div>
          <button aria-label="Voice input" className="rounded-full border border-white/10 bg-white/[0.04] p-3 text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-white">
            <Mic className="h-4 w-4" />
          </button>
          <Button onClick={onSend} disabled={isDisabled} className="h-12 rounded-full px-4">
            <SendHorizonal className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
