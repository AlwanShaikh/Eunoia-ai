"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, ShieldCheck, Eye, Trash2, Download, AlertTriangle } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const safetyItems = [
  {
    title: 'Data Encryption',
    icon: Lock,
    description: 'All your reflections and personal data are encrypted at rest and in transit using AES-256 and TLS 1.3.',
    status: 'Active',
  },
  {
    title: 'Privacy Controls',
    icon: Eye,
    description: 'You have full control over what data is shared. Review and adjust your privacy preferences at any time.',
    status: 'Configured',
  },
  {
    title: 'Session Management',
    icon: ShieldCheck,
    description: 'View and manage active sessions across devices. Revoke access instantly if needed.',
    status: 'No active sessions',
  },
  {
    title: 'Data Export',
    icon: Download,
    description: 'Download a complete copy of your reflections and personal data in a portable format.',
    status: 'Available',
  },
  {
    title: 'Data Deletion',
    icon: Trash2,
    description: 'Permanently delete your account and all associated data. This action cannot be undone.',
    status: 'Destructive',
  },
];

export default function SafetySettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <Navbar title="Safety Settings" />
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
                      <CardTitle>Safety & Security</CardTitle>
                      <CardDescription>Your data is protected with industry-standard security measures.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {safetyItems.map((item) => {
                    const Icon = item.icon;
                    const isDestructive = item.status === 'Destructive';
                    return (
                      <div
                        key={item.title}
                        className="flex items-start justify-between rounded-[20px] border border-white/10 bg-white/[0.04] p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`rounded-full border p-2 ${
                            isDestructive
                              ? 'border-red-500/30 bg-red-500/10 text-red-400'
                              : 'border-white/10 bg-white/5 text-sky-300'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{item.title}</p>
                            <p className="mt-1 text-sm leading-6 text-zinc-400">{item.description}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          isDestructive
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="border-amber-500/20 bg-amber-500/5">
                <CardContent className="flex items-start gap-3 p-6">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-400" />
                  <div>
                    <p className="font-medium text-amber-300">Non-clinical disclaimer</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      Eunoia is an AI wellness companion and does not provide medical advice, diagnosis, or treatment.
                      If you are in crisis or experiencing a mental health emergency, please contact a licensed
                      professional or call emergency services immediately.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}