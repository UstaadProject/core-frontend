import type { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className='flex min-h-screen w-full bg-background'>
      <Sidebar />
      <main className='flex-1 overflow-auto'>
        <div className='p-6 md:p-8 max-w-7xl mx-auto'>{children}</div>
      </main>
    </div>
  );
}
