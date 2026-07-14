import { Sparkles } from 'lucide-react';

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[22px] border border-dashed border-white/10 bg-white/[0.03] px-6 text-center">
      <div className="mb-4 rounded-full border border-sky-400/20 bg-sky-400/10 p-3 text-sky-300">
        <Sparkles className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">{description}</p>
    </div>
  );
}
