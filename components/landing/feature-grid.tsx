"use client";

import { motion } from 'framer-motion';
import { Compass, HeartHandshake, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  { title: 'Life Guidance', description: 'A calm place to reflect on pressure, routine, and the quiet questions that follow.', icon: Compass },
  { title: 'Relationship Support', description: 'Thoughtful support for connection, loneliness, and the conversations that matter most.', icon: HeartHandshake },
  { title: 'Emotional Growth', description: 'Gentle structure for self-awareness, healing, and steady personal development.', icon: Sparkles },
];

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="mb-10 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Features</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Designed for calm, not clutter.</h2>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.08 }} whileHover={{ y: -8, scale: 1.01 }}>
              <Card className="h-full border-white/10 bg-white/[0.04] p-1 shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
                <CardContent className="rounded-[20px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-sky-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
