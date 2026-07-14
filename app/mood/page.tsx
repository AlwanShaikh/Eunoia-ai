"use client";

import { motion } from 'framer-motion';
import { Activity, BookOpen, HeartHandshake, Sparkles } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  { label: 'Calmness', value: '78%', change: '+12%' },
  { label: 'Reflection', value: '5.2 days', change: '+1' },
  { label: 'Support streak', value: '14 days', change: '+3' },
];

export default function MoodPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <Navbar title="Mood Dashboard" />
          <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
              <Card className="overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.26em] text-sky-300">Weekly mood</p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">Steady and grounded</h3>
                    </div>
                    <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">+8% this week</div>
                  </div>
                  <div className="mt-8 flex h-40 items-end gap-3 rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-4">
                    {[38, 56, 47, 64, 72, 68, 81].map((height, index) => (
                      <div key={height} className="flex-1 rounded-t-[16px] bg-gradient-to-t from-[#6D5EF9] via-[#8B5CF6] to-[#38BDF8]" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Daily reflection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm text-sky-300">
                      <Sparkles className="h-4 w-4" />
                      Gentle note
                    </div>
                    <p className="text-sm leading-7 text-zinc-300">You made space for stillness today. That matters more than you think.</p>
                  </div>
                  <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4 text-sm text-zinc-400">
                    <div className="flex items-center gap-2 text-white">
                      <HeartHandshake className="h-4 w-4 text-emerald-400" />
                      Connection check-in
                    </div>
                    <p className="mt-2">Your support network feels more present this week.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Progress</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-sm text-zinc-400">{stat.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                      <p className="mt-1 text-sm text-emerald-400">{stat.change}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Journal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-2 text-sm text-white">
                      <BookOpen className="h-4 w-4 text-[#8B5CF6]" />
                      3 new entries this week
                    </div>
                    <p className="mt-2 text-sm leading-7 text-zinc-400">Your recent notes reflect clearer intention and softer self-talk.</p>
                  </div>
                  <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-2 text-sm text-white">
                      <Activity className="h-4 w-4 text-sky-400" />
                      Motion and calm balance
                    </div>
                    <p className="mt-2 text-sm leading-7 text-zinc-400">Your patterns suggest a strong foundation for sustainable routine.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
