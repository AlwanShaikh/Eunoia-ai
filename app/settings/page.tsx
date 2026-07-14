"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BellRing, Lock, MoonStar, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { useProfile } from '@/components/layout/profile-provider';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const settingsSections = [
  { title: 'Theme', icon: MoonStar, description: 'Aurora night, soft contrast, and premium focus.', route: '/settings/theme' },
  { title: 'Memory', icon: Sparkles, description: 'Manage how your reflections are remembered over time.', route: '/settings/memory' },
  { title: 'Privacy', icon: ShieldCheck, description: 'Control how securely you share personal context.', route: '/settings/privacy' },
  { title: 'Notifications', icon: BellRing, description: 'Choose the cadence of gentle nudges and check-ins.', route: '/settings/notifications' },
];

function generateInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    "from-[#6D5EF9] to-[#38BDF8]",
    "from-[#F472B6] to-[#EC4899]",
    "from-[#34D399] to-[#10B981]",
    "from-[#FBBF24] to-[#F59E0B]",
    "from-[#818CF8] to-[#6366F1]",
    "from-[#67E8F9] to-[#22D3EE]",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function SettingsPage() {
  const router = useRouter();
  const { profile } = useProfile();

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <Navbar title="Settings" />
          <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/settings/profile">
                    <div className="flex cursor-pointer items-center gap-4 rounded-[22px] border border-white/10 bg-white/[0.04] p-4 transition-colors hover:bg-white/[0.08]">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-lg font-semibold text-white ${getAvatarColor(profile.fullName)}`}>
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                        ) : (
                          generateInitials(profile.fullName)
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{profile.fullName}</p>
                        <p className="text-sm text-zinc-400">{profile.statusMessage}</p>
                      </div>
                    </div>
                  </Link>
                  <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-zinc-400">
                    <div className="flex items-center gap-2 text-white">
                      <UserRound className="h-4 w-4 text-sky-400" />
                      Calm profile
                    </div>
                    <p className="mt-2">{profile.bio}</p>
                  </div>
                  <Link href="/settings/profile">
                    <Button className="w-full">
                      Edit Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {settingsSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <div key={section.title} className="flex items-start justify-between rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full border border-white/10 bg-white/5 p-2 text-sky-300">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{section.title}</p>
                            <p className="mt-1 text-sm leading-6 text-zinc-400">{section.description}</p>
                          </div>
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => router.push(section.route)}>Edit</Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            <Card>
              <CardHeader>
                <CardTitle>Privacy & safety</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 rounded-[22px] border border-white/10 bg-white/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-white">Your reflections stay private by default</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">We keep the experience gentle, transparent, and non-clinical.</p>
                </div>
                <Button className="w-full sm:w-auto" onClick={() => router.push('/settings/safety')}>
                  <Lock className="mr-2 h-4 w-4" />
                  Review safety settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}