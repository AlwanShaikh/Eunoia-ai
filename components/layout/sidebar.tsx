'use client';

import { Compass, Heart, MoonStar, Settings, Sparkles, UserRound } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useProfile } from '@/components/layout/profile-provider';
import { usePathname } from 'next/navigation';

const items = [
  { label: 'Explore', href: '/', icon: Compass },
  { label: 'Conversations', href: '/chat', icon: Sparkles },
  { label: 'Mood', href: '/mood', icon: MoonStar },
  { label: 'Settings', href: '/settings', icon: Settings },
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

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.15 + i * 0.06, type: 'spring', stiffness: 100, damping: 16 },
  }),
};

function isActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export function Sidebar() {
  const { profile } = useProfile();
  const avatarGradient = getAvatarColor(profile.fullName || "Ava");
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="hidden h-screen w-72 flex-col justify-between glass-strong border-r border-white/[0.04] p-6 lg:flex"
    >
      {/* Logo area with crimson accent */}
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <motion.div variants={itemVariants} className="mb-10 flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-crimson-600/20 blur-md" />
            <div className="relative rounded-2xl bg-gradient-to-br from-crimson-500 to-crimson-700 p-2.5 text-white shadow-[0_16px_40px_rgba(220,20,60,0.3)]">
              <Heart className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">Eunoia</p>
            <p className="text-sm text-zinc-400/80">A calm AI companion</p>
          </div>
        </motion.div>

        <nav className="space-y-1.5">
          {items.map((item, i) => {
            const Icon = item.icon;
            const active = isActive(item.href, pathname);
            return (
              <motion.div
                key={item.label}
                custom={i}
                variants={navItemVariants}
                initial="hidden"
                animate="show"
              >
                <Link
                  href={item.href}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-2.5 text-sm transition-all duration-300 ${
                    active
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {/* Active / hover glass background */}
                  <div
                    className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                      active
                        ? 'bg-white/[0.07] crimson-border-glow'
                        : 'bg-transparent group-hover:bg-white/[0.04]'
                    }`}
                  />
                  {/* Active indicator line */}
                  {active && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-crimson-500 shadow-[0_0_8px_rgba(220,20,60,0.6)]"
                      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                    />
                  )}
                  <Icon className={`relative h-4 w-4 transition-colors duration-300 ${
                    active ? 'text-crimson-400' : 'group-hover:text-crimson-400/70'
                  }`} />
                  <span className="relative">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </motion.div>

      {/* Bottom section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="space-y-3"
      >
        {/* User profile card */}
        <Link href="/settings/profile">
          <motion.div
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-300 hover:border-crimson-600/20 hover:bg-white/[0.06]"
          >
            {/* Hover glow */}
            <div className="pointer-events-none absolute -inset-12 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="h-full w-full bg-gradient-to-r from-crimson-600/5 via-transparent to-transparent blur-2xl" />
            </div>
            <div className="relative flex items-center gap-3">
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white ${avatarGradient}`}>
                {profile.avatar ? (
                  <img src={profile.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                  generateInitials(profile.fullName)
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{profile.fullName}</p>
                <p className="truncate text-xs text-zinc-500">@{profile.username}</p>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Status message card */}
        <motion.div
          whileHover={{ y: -1 }}
          className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-300 hover:border-white/[0.1]"
        >
          <div className="pointer-events-none absolute -inset-12 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="h-full w-full bg-gradient-to-r from-crimson-600/3 via-transparent to-transparent blur-2xl" />
          </div>
          <div className="relative">
            <p className="text-sm font-medium text-white">{profile.statusMessage}</p>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              A thoughtful, non-clinical companion for your reflection and calm.
            </p>
          </div>
          {/* Subtle crimson accent dot */}
          <div className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-crimson-600/40 animate-pulse-crimson" />
        </motion.div>
      </motion.div>
    </motion.aside>
  );
}