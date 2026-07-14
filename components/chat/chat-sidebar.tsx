"use client";

import { motion } from 'framer-motion';
import { Home, MessageSquarePlus, MoonStar, Search, Settings, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ConversationSummary {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  active?: boolean;
}

interface ChatSidebarProps {
  conversations: ConversationSummary[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
}

export function ChatSidebar({ conversations, searchQuery, onSearchChange, onNewConversation, onSelectConversation }: ChatSidebarProps) {
  return (
    <aside className="hidden h-screen w-[320px] flex-col border-r border-white/10 bg-[#09090B]/90 px-4 py-4 lg:flex">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">Eunoia</p>
          <h2 className="text-lg font-semibold text-white">Conversations</h2>
        </div>
        <Button onClick={onNewConversation} size="sm" className="rounded-full px-3">
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          New
        </Button>
      </div>

      <label className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-400">
        <Search className="h-4 w-4" />
        <Input
          aria-label="Search conversations"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search"
          className="h-8 border-0 bg-transparent px-0 text-sm focus:bg-transparent"
        />
      </label>

      <div className="mt-5 flex-1 space-y-2 overflow-y-auto">
        {conversations.map((conversation) => (
          <motion.button
            key={conversation.id}
            whileHover={{ y: -1, scale: 1.01 }}
            onClick={() => onSelectConversation(conversation.id)}
            className={`w-full rounded-[18px] border px-3 py-3 text-left transition-all ${conversation.active ? 'border-sky-400/20 bg-sky-400/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'}`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium text-white">{conversation.title}</p>
              <span className="text-[11px] text-zinc-500">{conversation.updatedAt}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-400">{conversation.preview}</p>
          </motion.button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <Link href="/mood" className="flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white">
          <MoonStar className="h-4 w-4" />
          Mood Dashboard
        </Link>
        <Link href="/settings" className="flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <Link href="/" className="flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white">
          <Home className="h-4 w-4" />
          Home
        </Link>
      </div>
    </aside>
  );
}
