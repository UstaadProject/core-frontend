import type { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className='flex h-screen w-full overflow-hidden' style={{ background: 'hsl(240 10% 3.5%)' }}>
      <Sidebar />
      <main className='flex-1 min-h-0 overflow-y-auto relative'>
        {/* Ambient background mesh */}
        <div
          className='pointer-events-none fixed inset-0 z-0'
          style={{
            background: [
              'radial-gradient(ellipse 70% 50% at 15% 5%,  hsl(320 100% 58% / 0.07) 0%, transparent 60%)',
              'radial-gradient(ellipse 55% 45% at 85% 90%, hsl(280 100% 65% / 0.06) 0%, transparent 60%)',
              'radial-gradient(ellipse 40% 35% at 55% 50%, hsl(25  100% 60% / 0.03) 0%, transparent 65%)',
            ].join(', '),
            pointerEvents: 'none',
          }}
        />
        <div className='relative z-10'>{children}</div>
      </main>
    </div>
  );
}
