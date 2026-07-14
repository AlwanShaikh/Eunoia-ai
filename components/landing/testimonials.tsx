"use client";

import { motion } from 'framer-motion';
import { Brain, Shield, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const benefits = [
  {
    title: 'Private & Secure',
    description: 'Your conversations stay completely confidential. No data sharing, no judgement — just a safe space to explore your thoughts.',
    icon: Shield,
  },
  {
    title: 'Available 24/7',
    description: 'Support whenever you need it. Late nights, early mornings, or anytime in between — your AI companion is always ready to listen.',
    icon: Clock,
  },
  {
    title: 'Thoughtful Guidance',
    description: 'Gentle, evidence-based conversations designed to help you reflect, gain clarity, and build emotional resilience over time.',
    icon: Brain,
  },
];

export function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="mb-10 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Benefits</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Built with your well-being in mind.</h2>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-3">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <motion.div key={benefit.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.08 }}>
              <Card className="h-full border-white/10 bg-white/[0.04] p-1 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                <CardContent className="rounded-[20px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-sky-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-8 text-zinc-300">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}