"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  Settings2,
  ChevronDown,
  User,
  MessageCircle,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemoryNode {
  id: string;
  label: string;
  detail: string;
  category: MemoryCategory;
  timestamp: string;
}

type MemoryCategory = 'preferences' | 'conversations' | 'knowledge';

interface MemoryCategoryConfig {
  id: MemoryCategory;
  label: string;
  icon: typeof Brain;
  color: string;
  gradient: string;
  borderColor: string;
}

const categories: MemoryCategoryConfig[] = [
  {
    id: 'preferences',
    label: 'User Preferences',
    icon: User,
    color: 'text-crimson-400',
    gradient: 'from-crimson-600/20 to-crimson-500/5',
    borderColor: 'border-crimson-600/30',
  },
  {
    id: 'conversations',
    label: 'Conversations',
    icon: MessageCircle,
    color: 'text-purple-400',
    gradient: 'from-purple-600/20 to-violet-500/5',
    borderColor: 'border-purple-600/30',
  },
  {
    id: 'knowledge',
    label: 'Knowledge',
    icon: Lightbulb,
    color: 'text-amber-400',
    gradient: 'from-amber-600/20 to-amber-500/5',
    borderColor: 'border-amber-600/30',
  },
];

const defaultMemoryNodes: MemoryNode[] = [
  {
    id: '1',
    label: 'Prefers evening sessions',
    detail: 'User consistently engages in reflective conversations during evening hours (8-11 PM)',
    category: 'preferences',
    timestamp: 'Updated 2 days ago',
  },
  {
    id: '2',
    label: 'Deep conversational style',
    detail: 'Responds well to thoughtful, metaphor-rich language and existential topics',
    category: 'preferences',
    timestamp: 'Updated 5 days ago',
  },
  {
    id: '3',
    label: 'Career transition discussion',
    detail: 'Explored feelings of uncertainty around career change and personal fulfillment',
    category: 'conversations',
    timestamp: '3 days ago',
  },
  {
    id: '4',
    label: 'Relationship reflection',
    detail: 'Processed complex emotions around a significant relationship shift',
    category: 'conversations',
    timestamp: '1 week ago',
  },
  {
    id: '5',
    label: 'Mindfulness techniques',
    detail: 'Showed interest in breathwork and body-scan meditation practices',
    category: 'knowledge',
    timestamp: 'Learned 4 days ago',
  },
  {
    id: '6',
    label: 'Stoic philosophy resonance',
    detail: 'Found meaningful connections with Stoic principles of acceptance and resilience',
    category: 'knowledge',
    timestamp: 'Learned 1 week ago',
  },
];

interface MemoryPanelProps {
  className?: string;
  initialNodes?: MemoryNode[];
}

/**
 * MemoryPanel - AI memory visualization with animated nodes.
 * Shows remembered preferences, conversations, and knowledge.
 * Features futuristic glass card design with category filtering.
 */
export function MemoryPanel({
  className,
  initialNodes = defaultMemoryNodes,
}: MemoryPanelProps) {
  const [activeCategory, setActiveCategory] = useState<MemoryCategory | 'all'>('all');
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  const filteredNodes =
    activeCategory === 'all'
      ? initialNodes
      : initialNodes.filter((n) => n.category === activeCategory);

  return (
    <div className={cn('w-full', className)}>
      <div className="glass-premium overflow-hidden rounded-[24px]">
        {/* Header */}
        <div className="border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-crimson-600/20 to-purple-600/20">
                <Brain className="h-4 w-4 text-crimson-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Memory</h3>
                <p className="text-[11px] text-zinc-500">
                  {memoryEnabled
                    ? `${filteredNodes.length} remembered ${filteredNodes.length === 1 ? 'insight' : 'insights'}`
                    : 'Memory is disabled'}
                </p>
              </div>
            </div>

            {/* Toggle */}
            <button
              onClick={() => setMemoryEnabled(!memoryEnabled)}
              className={cn(
                'relative h-5 w-9 rounded-full transition-colors duration-300',
                memoryEnabled ? 'bg-crimson-600' : 'bg-zinc-700'
              )}
              aria-label={memoryEnabled ? 'Disable memory' : 'Enable memory'}
            >
              <motion.span
                className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
                animate={{ x: memoryEnabled ? 16 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-1.5 border-b border-white/[0.06] px-4 py-3">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide transition-all duration-300',
              activeCategory === 'all'
                ? 'bg-white/10 text-white'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            )}
          >
            All
          </button>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide transition-all duration-300',
                  isActive
                    ? `${cat.color} bg-white/10`
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                )}
              >
                <Icon className="h-3 w-3" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Memory nodes */}
        <div className="max-h-[320px] space-y-1.5 overflow-y-auto px-4 py-3 scrollbar-thin">
          <AnimatePresence mode="wait">
            {memoryEnabled ? (
              filteredNodes.length > 0 ? (
                filteredNodes.map((node, i) => {
                  const cat = categories.find((c) => c.id === node.category)!;
                  const Icon = cat.icon;
                  const isExpanded = expandedNode === node.id;

                  return (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      layout
                    >
                      <button
                        onClick={() => setExpandedNode(isExpanded ? null : node.id)}
                        className={cn(
                          'w-full rounded-xl border px-3.5 py-2.5 text-left transition-all duration-200',
                          cat.borderColor,
                          cat.gradient,
                          isExpanded
                            ? 'bg-white/[0.06] shadow-[0_0_12px_rgba(220,20,60,0.06)]'
                            : 'hover:bg-white/[0.03]'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div
                              className={cn(
                                'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                                cat.color
                              )}
                            >
                              <Icon className="h-3 w-3" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {node.label}
                              </p>
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.p
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-1 text-xs leading-5 text-zinc-400 overflow-hidden"
                                  >
                                    {node.detail}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] text-zinc-600 whitespace-nowrap">
                              {node.timestamp}
                            </span>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-3 w-3 text-zinc-600" />
                            </motion.div>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                    <Sparkles className="h-5 w-5 text-zinc-500" />
                  </div>
                  <p className="text-sm text-zinc-500">No memories in this category yet</p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Memories will appear as you continue your conversations
                  </p>
                </motion.div>
              )
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                  <Settings2 className="h-5 w-5 text-zinc-500" />
                </div>
                <p className="text-sm text-zinc-500">Memory is disabled</p>
                <p className="mt-1 text-xs text-zinc-600">
                  Toggle memory on to start remembering insights
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.06] px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {categories.slice(0, 3).map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.id}
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-full border border-white/10',
                        cat.color
                      )}
                    >
                      <Icon className="h-2.5 w-2.5" />
                    </div>
                  );
                })}
              </div>
              <span className="text-[10px] text-zinc-600">
                {memoryEnabled
                  ? `${initialNodes.length} total insights`
                  : 'Memory paused'}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              <Settings2 className="h-3 w-3" />
              Manage
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}