"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const links = [
  { label: 'Home', href: '#' },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
  { label: 'Privacy', href: '#privacy' },
];

export function NavBar() {
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 60], [0, 16]);
  const background = useTransform(scrollY, [0, 60], ['rgba(9,9,11,0)', 'rgba(9,9,11,0.7)']);

  return (
    <motion.header style={{ backdropFilter: `blur(${blur}px)`, backgroundColor: background }} className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-white/8 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <Link href="#" aria-label="Eunoia home" className="flex items-center gap-3 text-sm font-medium text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#6D5EF9] to-[#38BDF8] text-white shadow-[0_14px_36px_rgba(109,94,249,0.35)]">
            <Heart className="h-4 w-4" />
          </span>
          <span className="tracking-[0.24em]">EUNOIA</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/chat" aria-label="Get started">
          <Button size="sm" className="rounded-full px-4">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </motion.header>
  );
}
