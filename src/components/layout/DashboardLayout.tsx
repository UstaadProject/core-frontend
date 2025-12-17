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
        <div >{children}</div>
      </main>
    </div>
  );
}
