"use client";

import { motion } from 'framer-motion';
import { EyeOff, ShieldCheck, Sparkles, Waves } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const pillars = [
  { title: 'Private', description: 'Designed for calm, discretion, and personal space.', icon: EyeOff },
  { title: 'Thoughtful', description: 'Offers gentle language and reflective pacing.', icon: Sparkles },
  { title: 'Evidence-informed', description: 'Built around supportive, grounded communication practices.', icon: ShieldCheck },
  { title: 'Always available', description: 'A steady companion for moments of reflection any time.', icon: Waves },
];

export function WhyEunoia() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="mb-10 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Why Eunoia</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Quietly modern, deeply reassuring.</h2>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <motion.div key={pillar.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.06 }}>
              <Card className="h-full border-white/10 bg-white/[0.04] p-1 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                <CardContent className="rounded-[20px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sky-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">{pillar.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
