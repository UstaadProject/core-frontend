import type { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export function LearningLayout({ children }: LayoutProps) {
  return (
    <div className='flex h-screen w-full overflow-hidden bg-[hsl(var(--background))]'>
      <Sidebar />
      <main className='flex-1 min-h-0 overflow-y-auto'>{children}</main>
    </div>
  );
}
