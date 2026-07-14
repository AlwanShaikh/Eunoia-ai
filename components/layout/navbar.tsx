'use client';

import { Bell, Menu } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/components/layout/profile-provider';

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

export function Navbar({ title }: { title: string }) {
  const { profile } = useProfile();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-0 z-50 flex items-center justify-between border-b border-white/[0.04] glass-strong px-4 py-3 sm:px-6 lg:px-8"
    >
      <div>
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-xs font-medium tracking-widest uppercase text-zinc-500"
        >
          Eunoia
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-lg font-semibold text-white"
        >
          {title}
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex items-center gap-2"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="relative hidden overflow-hidden border border-white/[0.06] bg-white/[0.03] text-zinc-400 transition-all duration-300 hover:border-crimson-600/20 hover:bg-white/[0.06] hover:text-zinc-200 sm:inline-flex"
          >
            {/* Hover glow */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="h-full w-full bg-gradient-to-r from-crimson-600/5 via-transparent to-transparent blur-xl" />
            </div>
            <Bell className="mr-2 h-4 w-4" />
            <span className="relative">Updates</span>
          </Button>
        </motion.div>

        {/* User avatar mini */}
        <Link href="/settings/profile">
          <motion.div
            whileHover={{ scale: 1.1, rotate: -3 }}
            whileTap={{ scale: 0.9 }}
            className="relative cursor-pointer"
          >
            <div className="absolute -inset-0.5 rounded-full bg-crimson-600/20 opacity-0 blur-sm transition-opacity duration-300 hover:opacity-100" />
            <div
              className={`relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white shadow-[0_0_20px_rgba(220,20,60,0.15)] transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(220,20,60,0.3)] ${getAvatarColor(profile.fullName)}`}
            >
              {profile.avatar ? (
                <img src={profile.avatar} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                generateInitials(profile.fullName)
              )}
            </div>
          </motion.div>
        </Link>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(220, 20, 60, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          className="relative overflow-hidden rounded-full border border-white/[0.06] bg-white/[0.03] p-2.5 text-zinc-400 transition-colors duration-300 hover:border-crimson-600/20 hover:text-zinc-200 lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </motion.button>
      </motion.div>
    </motion.header>
  );
}