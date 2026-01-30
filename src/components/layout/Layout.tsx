import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { NetworkBackground } from '@/components/ui/NetworkBackground';

interface LayoutProps {
  children: ReactNode;
  showNetwork?: boolean;
}

export function Layout({ children, showNetwork = true }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col relative">
      {showNetwork && <NetworkBackground />}
      <Header />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
