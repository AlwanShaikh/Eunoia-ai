import Link from 'next/link';

export function Footer() {
  return (
    <footer id="privacy" className="border-t border-white/10 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-white">EUNOIA</p>
          <p className="mt-1">Beautiful Thinking.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="#" className="transition-colors hover:text-white">Privacy</Link>
          <Link href="#" className="transition-colors hover:text-white">Terms</Link>
          <Link href="#" className="transition-colors hover:text-white">Contact</Link>
          <Link href="#" className="transition-colors hover:text-white">GitHub</Link>
        </div>
      </div>
    </footer>
  );
}
