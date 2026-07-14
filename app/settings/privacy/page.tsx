"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Eye, Fingerprint, Globe } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const privacyOptions = [
  {
    title: 'Data Sharing',
    icon: Globe,
    description: 'Control what anonymous data is shared to improve your experience.',
    status: 'Minimal',
  },
  {
    title: 'Session Privacy',
    icon: Eye,
    description: 'Choose whether sessions are recorded or remain ephemeral.',
    status: 'Ephemeral',
  },
  {
    title: 'Authentication',
    icon: Fingerprint,
    description: 'Manage your sign-in methods and security preferences.',
    status: 'Configured',
  },
  {
    title: 'Data Controls',
    icon: ShieldCheck,
    description: 'Review and manage your stored personal information.',
    status: 'Available',
  },
];

export default function PrivacySettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <Navbar title="Privacy Settings" />
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
                      <ShieldCheck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>Privacy Controls</CardTitle>
                      <CardDescription>Manage your privacy preferences and how your data is used.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {privacyOptions.map((option) => {
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
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
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
