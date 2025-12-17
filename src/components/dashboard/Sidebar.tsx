import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  User,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { title: 'Learning Path', icon: Target, path: '/learning' },
  { title: 'Courses', icon: BookOpen, path: '/courses' },
  { title: 'AI Assistant', icon: Sparkles, path: '/assistant' },
  { title: 'Achievements', icon: Trophy, path: '/achievements' },
  { title: 'Community', icon: MessageSquare, path: '/community' },
];

const bottomItems = [
  { title: 'Profile', icon: User, path: '/profile' },
  { title: 'Settings', icon: Settings, path: '/settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className='flex items-center h-16 px-4 border-b border-sidebar-border'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-primary'>
            <span className='text-primary-foreground font-bold text-sm'>U</span>
          </div>
          {!collapsed && (
            <span className='font-display font-bold text-xl text-gradient-primary'>
              Ustaad
            </span>
          )}
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className='absolute -right-3 top-20 w-6 h-6 rounded-full bg-surface-elevated border border-border flex items-center justify-center hover:bg-primary/20 hover:border-primary transition-colors'
      >
        {collapsed ? (
          <ChevronRight className='w-3 h-3 text-muted-foreground' />
        ) : (
          <ChevronLeft className='w-3 h-3 text-muted-foreground' />
        )}
      </button>

      {/* Navigation */}
      <nav className='flex-1 py-6 px-3 space-y-1'>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'w-5 h-5 flex-shrink-0 transition-colors',
                  isActive ? 'text-primary' : 'group-hover:text-primary'
                )}
              />
              {!collapsed && (
                <span className='font-medium text-sm'>{item.title}</span>
              )}
              {isActive && !collapsed && (
                <div className='ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow' />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className='py-4 px-3 border-t border-sidebar-border space-y-1'>
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
              )}
            >
              <item.icon className='w-5 h-5 flex-shrink-0' />
              {!collapsed && (
                <span className='font-medium text-sm'>{item.title}</span>
              )}
            </NavLink>
          );
        })}

        <button className='flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-destructive hover:bg-destructive/10 w-full'>
          <LogOut className='w-5 h-5 flex-shrink-0' />
          {!collapsed && <span className='font-medium text-sm'>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
