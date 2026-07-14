"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, BellRing, MessageCircle, Heart, Clock } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const notificationOptions = [
  {
    title: 'Daily Check-ins',
    icon: BellRing,
    description: 'Receive a gentle nudge to reflect at a time that works for you.',
    status: 'Enabled',
  },
  {
    title: 'Insight Alerts',
    icon: Heart,
    description: 'Get notified when meaningful patterns or themes are detected.',
    status: 'Enabled',
  },
  {
    title: 'Reminders',
    icon: Clock,
    description: 'Set custom reminders for regular reflection sessions.',
    status: 'Disabled',
  },
  {
    title: 'Message Preferences',
    icon: MessageCircle,
    description: 'Choose the tone and frequency of Eunoia responses.',
    status: 'Calm',
  },
];

export default function NotificationsSettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <Navbar title="Notification Settings" />
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
                      <BellRing className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Choose the cadence of gentle nudges and check-ins that feel right for you.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {notificationOptions.map((option) => {
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
                          option.status === 'Disabled'
                            ? 'bg-white/5 text-zinc-500'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {option.status}
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
