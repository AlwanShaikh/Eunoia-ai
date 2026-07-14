"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MoonStar, Sun, Sparkles } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const themeOptions = [
  {
    title: 'Aurora Night',
    icon: MoonStar,
    description: 'Deep indigo and violet tones for a calm, restful experience.',
    active: true,
  },
  {
    title: 'Soft Contrast',
    icon: Sun,
    description: 'Balanced light and shadow for comfortable daytime use.',
    active: false,
  },
  {
    title: 'Premium Focus',
    icon: Sparkles,
    description: 'Minimal distractions with refined, elegant surfaces.',
    active: false,
  },
];

export default function ThemeSettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <Navbar title="Theme Settings" />
          <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <button
                onClick={() => router.back()}
                className="mb-2 flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Settings
              </button>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full border border-white/10 bg-gradient-to-br from-[#6D5EF9] to-[#38BDF8] p-2.5">
                      <MoonStar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>Theme Preferences</CardTitle>
                      <CardDescription>Choose the visual style that feels most comfortable for you.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <div
                        key={option.title}
                        className="flex items-start justify-between rounded-[20px] border border-white/10 bg-white/[0.04] p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="rounded-full border border-white/10 bg-white/5 p-2 text-sky-300">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{option.title}</p>
                            <p className="mt-1 text-sm leading-6 text-zinc-400">{option.description}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          option.active
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-white/5 text-zinc-500'
                        }`}>
                          {option.active ? 'Active' : 'Available'}
                        </span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
