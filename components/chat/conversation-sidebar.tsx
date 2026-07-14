"use client";

import { motion } from 'framer-motion';
import { MessageSquarePlus, Search, Settings2, Sparkles, SunMoon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ConversationItem {
  id: string;
  title: string;
  preview: string;
  time: string;
  active?: boolean;
}

interface ConversationSidebarProps {
  items: ConversationItem[];
  onNewChat: () => void;
  onSelect: (id: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function ConversationSidebar({ items, onNewChat, onSelect, searchValue, onSearchChange }: ConversationSidebarProps) {
  return (
    <aside className="hidden h-screen w-[320px] flex-col border-r border-white/10 bg-[#09090B]/95 px-4 py-4 lg:flex">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm tracking-[0.26em] text-zinc-500">EUNOIA</p>
          <h2 className="text-lg font-semibold text-white">Conversations</h2>
        </div>
        <Button onClick={onNewChat} size="sm" className="rounded-full px-3">
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          New
        </Button>
      </div>

      <label className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-400">
        <Search className="h-4 w-4" />
        <Input
          aria-label="Search conversations"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search"
          className="h-8 border-0 bg-transparent px-0 text-sm text-white placeholder:text-zinc-500 focus:bg-transparent"
        />
      </label>

      <div className="mt-5 flex-1 space-y-2 overflow-y-auto">
        {items.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ y: -1, scale: 1.01 }}
            onClick={() => onSelect(item.id)}
            className={`w-full rounded-[18px] border px-3 py-3 text-left transition-all ${item.active ? 'border-sky-400/20 bg-sky-400/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'}`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium text-white">{item.title}</p>
              <span className="text-[11px] text-zinc-500">{item.time}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-400">{item.preview}</p>
          </motion.button>
        ))}
      </div>

      <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
        <Link href="/mood" className="flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white">
          <Sparkles className="h-4 w-4" />
          Mood Dashboard
        </Link>
        <Link href="/settings" className="flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white">
          <Settings2 className="h-4 w-4" />
          Settings
        </Link>
        <button className="flex w-full items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] px-3 py-3 text-left text-sm text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white">
          <SunMoon className="h-4 w-4" />
          Theme
        </button>
      </div>
    </aside>
  );
}
