import { motion } from 'framer-motion';

export function LoadingSpinner() {
  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#6D5EF9] to-[#38BDF8]"
          animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.12 }}
        />
      ))}
    </div>
  );
}
