import type { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export function LearningLayout({ children }: LayoutProps) {
  return (
    <div className='flex min-h-screen w-full bg-[hsl(var(--background))]'>
      <Sidebar />
      <main className='flex-1 overflow-auto'>{children}</main>
    </div>
  );
}
