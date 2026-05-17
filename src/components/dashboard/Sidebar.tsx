import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Trophy,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  MessageSquare,
  FileText,
  Medal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOutUser } from '@/services/firebase/firebase';

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, color: 'text-primary' },
  { title: 'Mock Client', url: '/mock-client', icon: MessageSquare, color: 'text-accent' },
  { title: 'Learning Path', url: '/learning-path', icon: GraduationCap, color: 'text-secondary' },
  { title: 'Analytics', url: '/analytics', icon: BarChart3, color: 'text-primary' },
  { title: 'Leaderboard', url: '/leaderboard', icon: Medal, color: 'text-yellow-400' },
  { title: 'Resume Builder', url: '/resume-builder', icon: FileText, color: 'text-accent' },
  { title: 'Achievements', url: '/achievements', icon: Trophy, color: 'text-secondary' },
];

const bottomNavItems = [
  { title: 'Profile', url: '/profile', icon: User },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOutUser();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen border-r border-[hsl(var(--sidebar-border))] transition-all duration-300 ease-out',
        collapsed ? 'w-[68px]' : 'w-[240px]'
      )}
      style={{
        background: 'linear-gradient(180deg, hsl(240 10% 5%) 0%, hsl(240 8% 4%) 100%)',
      }}
    >
      {/* Ambient glow */}
      <div
        className='pointer-events-none absolute inset-0 opacity-30'
        style={{
          background:
            'radial-gradient(ellipse 120% 40% at 50% 0%, hsl(320 100% 58% / 0.12) 0%, transparent 70%)',
        }}
      />

      {/* Logo */}
      <div
        className={cn(
          'flex items-center gap-3 border-b border-[hsl(var(--border-muted))] relative z-10',
          collapsed ? 'p-4 justify-center' : 'p-5'
        )}
      >
        <div className='relative shrink-0'>
          <div
            className='w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-lg'
            style={{
              background: 'linear-gradient(135deg, hsl(320 100% 58%), hsl(280 100% 65%))',
              boxShadow: '0 0 20px hsl(320 100% 58% / 0.4)',
            }}
          >
            U
          </div>
        </div>
        {!collapsed && (
          <span className='logo-shimmer font-bold text-lg tracking-tight'>Ustaad</span>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className='absolute -right-3 top-[72px] w-6 h-6 rounded-full border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-all z-20 shadow-md'
        style={{ background: 'hsl(240 8% 10%)' }}
      >
        {collapsed ? (
          <ChevronRight className='w-3 h-3' />
        ) : (
          <ChevronLeft className='w-3 h-3' />
        )}
      </button>

      {/* Main Navigation */}
      <nav className='flex-1 p-2.5 space-y-0.5 overflow-y-auto relative z-10 mt-1'>
        {mainNavItems.map((item) => {
          const active = isActive(item.url);
          return (
            <NavLink
              key={item.title}
              to={item.url}
              title={collapsed ? item.title : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                active
                  ? 'nav-item-active'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/0.5)]'
              )}
            >
              <item.icon
                className={cn(
                  'w-[18px] h-[18px] shrink-0 transition-all',
                  active ? item.color : 'text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))]'
                )}
              />
              {!collapsed && (
                <span className='font-medium text-[13px]'>{item.title}</span>
              )}
              {active && !collapsed && (
                <div
                  className='ml-auto w-1.5 h-1.5 rounded-full'
                  style={{
                    background: 'hsl(var(--primary))',
                    boxShadow: '0 0 6px hsl(var(--primary) / 0.8)',
                  }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section with avatar + nav */}
      <div className='p-2.5 border-t border-[hsl(var(--border-muted))] space-y-0.5 relative z-10'>
        {bottomNavItems.map((item) => {
          const active = isActive(item.url);
          return (
            <NavLink
              key={item.title}
              to={item.url}
              title={collapsed ? item.title : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                active
                  ? 'nav-item-active'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/0.5)]'
              )}
            >
              <item.icon className='w-[18px] h-[18px] shrink-0' />
              {!collapsed && (
                <span className='font-medium text-[13px]'>{item.title}</span>
              )}
            </NavLink>
          );
        })}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Log Out' : undefined}
          className='flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.1)] group'
        >
          <LogOut className='w-[18px] h-[18px] shrink-0' />
          {!collapsed && <span className='font-medium text-[13px]'>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
