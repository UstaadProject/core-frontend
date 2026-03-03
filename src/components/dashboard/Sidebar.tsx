import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Sparkles,
  Trophy,
  Users,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOutUser } from '@/services/firebase/firebase';

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Learning Path', url: '/learning-path', icon: GraduationCap },
  { title: 'Leaderboard', url: '/leaderboard', icon: Trophy },
  { title: 'Resume Builder', url: '/resume-builder', icon: User },
  { title: 'Courses', url: '/courses', icon: BookOpen },
  { title: 'AI Assistant', url: '/ai-assistant', icon: Sparkles },
  { title: 'Achievements', url: '/achievements', icon: Trophy },
  { title: 'Community', url: '/community', icon: Users },
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
        'relative flex flex-col h-screen bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className='flex items-center gap-3 p-4 border-b border-[hsl(var(--border-muted))]'>
        <div className='w-8 h-8 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center text-[hsl(var(--primary-foreground))] font-bold text-sm'>
          U
        </div>
        {!collapsed && (
          <span className='font-semibold text-lg text-[hsl(var(--foreground))]'>
            Ustaad
          </span>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className='absolute -right-3 top-20 w-6 h-6 rounded-full bg-[hsl(var(--surface-elevated))] border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors z-10'
      >
        {collapsed ? (
          <ChevronRight className='w-3 h-3' />
        ) : (
          <ChevronLeft className='w-3 h-3' />
        )}
      </button>

      {/* Main Navigation */}
      <nav className='flex-1 p-3 space-y-1 overflow-y-auto'>
        {mainNavItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
              isActive(item.url)
                ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
                : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/0.5)]'
            )}
          >
            <item.icon
              className={cn(
                'w-5 h-5 shrink-0 transition-colors',
                isActive(item.url)
                  ? 'text-[hsl(var(--primary))]'
                  : 'text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))]'
              )}
            />
            {!collapsed && (
              <span className='font-medium text-sm'>{item.title}</span>
            )}
            {isActive(item.url) && !collapsed && (
              <div className='ml-auto w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]' />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className='p-3 space-y-1 border-t border-[hsl(var(--border-muted))]'>
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
              isActive(item.url)
                ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
                : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/0.5)]'
            )}
          >
            <item.icon className='w-5 h-5 shrink-0' />
            {!collapsed && (
              <span className='font-medium text-sm'>{item.title}</span>
            )}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className='flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.1)]'
        >
          <LogOut className='w-5 h-5 shrink-0' />
          {!collapsed && <span className='font-medium text-sm'>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
