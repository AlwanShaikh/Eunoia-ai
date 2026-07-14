"use client";

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, User } from 'lucide-react';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  index?: number;
}

/**
 * ChatBubble - Animated message component with markdown rendering.
 * User messages slide in from the right.
 * AI messages fade in with upward motion.
 */
export function ChatBubble({ role, content, timestamp, index = 0 }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={
        isUser
          ? { opacity: 0, x: 40, scale: 0.95 }
          : { opacity: 0, y: 16, scale: 0.97 }
      }
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 last:mb-0`}
    >
      <div
        className={`flex max-w-[88%] items-start gap-2.5 ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 + 0.1 }}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
            isUser
              ? 'border-crimson-600/30 bg-gradient-to-br from-crimson-600/20 to-crimson-500/10 text-crimson-300'
              : 'border-purple-500/30 bg-gradient-to-br from-purple-600/20 to-violet-500/10 text-purple-300'
          }`}
        >
          {isUser ? (
            <User className="h-3.5 w-3.5" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
        </motion.div>

        {/* Message content */}
        <div className="flex flex-col gap-1">
          <motion.div
            className={`rounded-[20px] px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.25)] ${
              isUser
                ? 'bg-gradient-to-r from-crimson-600 to-purple-600 text-white'
                : 'border border-white/[0.06] bg-white/[0.04] text-zinc-200 backdrop-blur-sm'
            }`}
          >
            {isUser ? (
              <p className="text-sm leading-6">{content}</p>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none leading-6">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    strong: ({ children }) => (
                      <span className="font-semibold text-crimson-300">{children}</span>
                    ),
                    em: ({ children }) => (
                      <span className="italic text-purple-300">{children}</span>
                    ),
                    code: ({ children }) => (
                      <code className="rounded-md bg-white/5 px-1.5 py-0.5 text-xs text-purple-200 font-mono">
                        {children}
                      </code>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-1 space-y-1 list-disc list-inside text-zinc-300">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="my-1 space-y-1 list-decimal list-inside text-zinc-300">
                        {children}
                      </ol>
                    ),
                    p: ({ children }) => (
                      <p className="mb-1 last:mb-0 leading-6">{children}</p>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-crimson-500/40 pl-3 my-2 text-zinc-400 italic">
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-crimson-400 underline decoration-crimson-500/30 hover:decoration-crimson-400/60 transition-colors"
                      >
                        {children}
                      </a>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold text-white mb-2 mt-3">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base font-bold text-white mb-1.5 mt-2.5">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-semibold text-white/90 mb-1 mt-2">{children}</h3>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </motion.div>

          {/* Timestamp */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.2 }}
            className={`text-[10px] tracking-wider px-1 ${
              isUser ? 'text-right text-zinc-500' : 'text-left text-zinc-600'
            }`}
          >
            {timestamp}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}