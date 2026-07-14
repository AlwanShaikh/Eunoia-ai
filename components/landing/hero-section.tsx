"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0">
        <motion.div animate={{ y: [0, -24, 0], x: [0, 20, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-[-8%] top-[-12%] h-72 w-72 rounded-full bg-[#6D5EF9]/30 blur-3xl" />
        <motion.div animate={{ y: [0, 30, 0], x: [0, -18, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} className="absolute right-[-10%] top-[10%] h-80 w-80 rounded-full bg-[#38BDF8]/25 blur-3xl" />
        <motion.div animate={{ y: [0, -18, 0], x: [0, 10, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-[-12%] left-[20%] h-72 w-72 rounded-full bg-[#8B5CF6]/25 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.06),transparent_18%)]" />

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm text-zinc-300 shadow-[0_12px_35px_rgba(0,0,0,0.2)] backdrop-blur-xl">
          <Sparkles className="h-4 w-4 text-sky-300" />
          Beautiful Thinking.
        </div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
          How are you feeling today?
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
          Eunoia helps people navigate emotions, relationships, stress, and personal growth through thoughtful, calm conversations.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/chat" aria-label="Start conversation">
            <Button size="lg" className="rounded-full px-6">
              Start Conversation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features" aria-label="Learn more about Eunoia">
            <Button variant="secondary" size="lg" className="rounded-full px-6">
              Learn More
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
