"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Direction the section slides in from */
  from?: 'bottom' | 'left' | 'right' | 'none';
  /** Delay in seconds before animation starts */
  delay?: number;
  /** Duration of animation in seconds */
  duration?: number;
  /** Whether animation is enabled */
  animate?: boolean;
}

const directionVariants = {
  bottom: { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } },
  none: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

/**
 * AnimatedSection - Wraps content with a smooth fade-in and slide-up animation
 * when it comes into view.
 */
export function AnimatedSection({
  children,
  className,
  from = 'bottom',
  delay = 0,
  duration = 0.6,
  animate = true,
}: AnimatedSectionProps) {
  if (!animate) {
    return <div className={className}>{children}</div>;
  }

  const variant = directionVariants[from];

  return (
    <motion.div
      className={cn('will-change-transform', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: variant.hidden,
        visible: {
          ...variant.visible,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * FloatingElement - Adds a subtle floating animation to any element
 */
export function FloatingElement({
  children,
  className,
  amplitude = 8,
  duration = 4,
}: {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={cn('will-change-transform', className)}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggeredChildren - Staggers animation of children for a cascading reveal effect
 */
export function StaggeredChildren({
  children,
  className,
  staggerDelay = 0.08,
  from = 'bottom',
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  from?: 'bottom' | 'left' | 'right' | 'none';
}) {
  const dirVariants = {
    bottom: { y: 20 },
    left: { x: -20 },
    right: { x: 20 },
    none: {},
  };

  return (
    <motion.div
      className={cn('', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, ...dirVariants[from] },
                visible: {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1],
                  },
                },
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}