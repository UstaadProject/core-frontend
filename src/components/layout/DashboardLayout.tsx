import type { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className='flex h-screen w-full overflow-hidden bg-background'>
      <Sidebar />
      <main className='flex-1 min-h-0 overflow-y-auto'>
        <div>{children}</div>
      </main>
    </div>
  );
}
