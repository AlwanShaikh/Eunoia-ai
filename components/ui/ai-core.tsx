"use client";

import { useEffect, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

type AiState = 'idle' | 'listening' | 'thinking' | 'responding';

interface AiCoreProps {
  state?: AiState;
  className?: string;
}

export function AiCore({ state = 'idle', className }: AiCoreProps) {
  const controls = useAnimationControls();

  // Ring configuration
  const rings = [
    { size: 180, speed: 18, opacity: 0.15, border: 'border-crimson-600/30' },
    { size: 150, speed: 14, opacity: 0.12, border: 'border-purple-500/20' },
    { size: 220, speed: 22, opacity: 0.10, border: 'border-crimson-500/20' },
    { size: 120, speed: 10, opacity: 0.08, border: 'border-violet-400/15' },
  ];

  const ringSpeeds = useRef<number[]>([18, 14, 22, 10]);

  useEffect(() => {
    switch (state) {
      case 'idle':
        controls.start({
          scale: [1, 1.04, 1],
          opacity: [0.6, 0.8, 0.6],
          transition: { duration: 4, ease: 'easeInOut', repeat: Infinity },
        });
        ringSpeeds.current = [18, 14, 22, 10];
        break;
      case 'listening':
        controls.start({
          scale: [1, 1.08, 1.04, 1.08, 1],
          opacity: [0.6, 0.85, 0.7, 0.85, 0.6],
          transition: { duration: 2.5, ease: 'easeInOut', repeat: Infinity },
        });
        ringSpeeds.current = [10, 8, 12, 6];
        break;
      case 'thinking':
        controls.start({
          scale: [1, 1.02, 0.98, 1.02, 1],
          opacity: [0.6, 0.75, 0.5, 0.75, 0.6],
          transition: { duration: 1.8, ease: 'easeInOut', repeat: Infinity },
        });
        ringSpeeds.current = [20, 16, 24, 14];
        break;
      case 'responding':
        controls.start({
          scale: [1, 1.12, 1.06, 1.12, 1],
          opacity: [0.7, 1, 0.8, 1, 0.7],
          transition: { duration: 2, ease: 'easeInOut', repeat: Infinity },
        });
        ringSpeeds.current = [14, 10, 16, 8];
        break;
    }
  }, [state, controls]);

  return (
    <div className={`relative flex items-center justify-center ${className ?? ''}`}>
      {/* Glow backdrop */}
      <motion.div
        animate={controls}
        className="absolute h-[200px] w-[200px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(220,20,60,0.15) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Rotating rings */}
      {rings.map((ring, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full border ${ring.border}`}
          style={{
            width: ring.size,
            height: ring.size,
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: ringSpeeds.current[i],
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Core orb */}
      <motion.div
        animate={controls}
        className="relative z-10 flex h-[80px] w-[80px] items-center justify-center overflow-hidden rounded-full"
        style={{
          background:
            'radial-gradient(circle at 35% 35%, rgba(220,20,60,0.4), rgba(139,92,246,0.25) 60%, rgba(17,17,19,0.8))',
          boxShadow:
            '0 0 30px rgba(220,20,60,0.25), 0 0 60px rgba(139,92,246,0.12), inset 0 0 20px rgba(220,20,60,0.1)',
        }}
      >
        {/* Inner glow */}
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 40% 40%, rgba(220,50,80,0.3), rgba(139,92,246,0.15) 50%, transparent)',
          }}
          animate={
            state === 'responding'
              ? {
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.8, 0.4],
                }
              : {
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }
          }
          transition={{
            duration: state === 'responding' ? 2 : 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Center dot */}
        <motion.div
          className="h-2 w-2 rounded-full bg-white/90"
          animate={{
            boxShadow: [
              '0 0 4px rgba(255,255,255,0.8)',
              '0 0 12px rgba(255,255,255,0.4)',
              '0 0 4px rgba(255,255,255,0.8)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Thinking particles */}
      {state === 'thinking' && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute h-1.5 w-1.5 rounded-full bg-crimson-400/50"
              initial={{ rotate: 0 }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3 + i * 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                transformOrigin: 'center',
                marginLeft: Math.cos((i * 120 * Math.PI) / 180) * 55,
                marginTop: Math.sin((i * 120 * Math.PI) / 180) * 55,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}