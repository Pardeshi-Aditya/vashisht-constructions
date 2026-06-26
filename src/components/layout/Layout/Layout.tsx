import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileContactBar } from '@/components/layout/MobileContactBar';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';

interface LayoutProps {
  children: ReactNode;
  transparentNav?: boolean;
}

export function Layout({ children, transparentNav = false }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar transparent={transparentNav} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileContactBar />
      <WhatsAppButton />
    </div>
  );
}
