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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOutUser } from '@/services/firebase/firebase';

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Mock Client', url: '/mock-client', icon: MessageSquare },
  { title: 'Learning Path', url: '/learning-path', icon: GraduationCap },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Leaderboard', url: '/leaderboard', icon: Trophy },
  { title: 'Resume Builder', url: '/resume-builder', icon: User },
  { title: 'Achievements', url: '/achievements', icon: Trophy },
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
        'relative flex flex-col h-screen bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] transition-all duration-300 ease-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className='flex items-center gap-3 p-5 border-b border-[hsl(var(--border-muted))]'>
        <div className='w-10 h-10 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center text-[hsl(var(--primary-foreground))] font-bold text-base shadow-lg shadow-primary/20'>
          U
        </div>
        {!collapsed && (
          <span className='font-bold text-lg text-[hsl(var(--foreground))] tracking-tight'>
            Ustaad
          </span>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className='absolute -right-3 top-20 w-6 h-6 rounded-full bg-[hsl(var(--surface-elevated))] border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-all z-10 shadow-md'
      >
        {collapsed ? (
          <ChevronRight className='w-3 h-3' />
        ) : (
          <ChevronLeft className='w-3 h-3' />
        )}
      </button>

      {/* Main Navigation */}
      <nav className='flex-1 p-3 space-y-1.5 overflow-y-auto'>
        {mainNavItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative',
              isActive(item.url)
                ? 'bg-primary/10 text-[hsl(var(--primary))] shadow-lg shadow-primary/10'
                : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/0.6)]'
            )}
          >
            <item.icon
              className={cn(
                'w-5 h-5 shrink-0 transition-all',
                isActive(item.url)
                  ? 'text-[hsl(var(--primary))]'
                  : 'text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))]'
              )}
            />
            {!collapsed && (
              <span className='font-semibold text-sm'>{item.title}</span>
            )}
            {isActive(item.url) && !collapsed && (
              <div className='ml-auto w-2 h-2 rounded-full bg-[hsl(var(--primary))] shadow-lg shadow-primary/40' />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className='p-3 space-y-1.5 border-t border-[hsl(var(--border-muted))]'>
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group',
              isActive(item.url)
                ? 'bg-primary/10 text-[hsl(var(--primary))]'
                : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/0.6)]'
            )}
          >
            <item.icon className='w-5 h-5 shrink-0' />
            {!collapsed && (
              <span className='font-semibold text-sm'>{item.title}</span>
            )}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className='flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 w-full text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.1)] group'
        >
          <LogOut className='w-5 h-5 shrink-0' />
          {!collapsed && <span className='font-semibold text-sm'>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
