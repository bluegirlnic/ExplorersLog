import { ReactNode } from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-earth-50">
      <Navigation />
      <main className="pb-20 md:pb-8">{children}</main>
    </div>
  );
}
