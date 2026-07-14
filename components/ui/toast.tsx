import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export function Toast({ title, description }: { title: string; description: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="flex items-start gap-3 rounded-[20px] border border-emerald-400/20 bg-emerald-500/10 p-4 shadow-[0_18px_50px_rgba(34,197,94,0.15)]">
      <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" />
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm text-zinc-300">{description}</p>
      </div>
    </motion.div>
  );
}
