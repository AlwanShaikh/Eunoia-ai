import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ProfileProvider } from '@/components/layout/profile-provider';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { PageTransition } from '@/components/ui/page-transition';
import { NeuralBackground } from '@/components/ui/neural-background';
import { AuthProvider } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Eunoia',
  description: 'A premium AI mental wellness companion designed for calm reflection and growth.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AuroraBackground>
            <NeuralBackground enableNeuralBackground={true} />
            <ProfileProvider>
              <PageTransition>{children}</PageTransition>
            </ProfileProvider>
          </AuroraBackground>
        </AuthProvider>
      </body>
    </html>
  );
}
