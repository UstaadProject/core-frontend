import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Trophy,
  User,
  Settings,
  LogOut,
  BarChart3,
  MessageSquare,
  FileText,
  Medal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/Logo';
import { signOutUser } from '@/services/firebase/firebase';

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Learning Path', url: '/learning-path', icon: GraduationCap },
  { title: 'Mock Client', url: '/mock-client', icon: MessageSquare },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Leaderboard', url: '/leaderboard', icon: Medal },
  { title: 'Resume Builder', url: '/resume-builder', icon: FileText },
  { title: 'Achievements', url: '/achievements', icon: Trophy },
];

const bottomNavItems = [
  { title: 'Profile', url: '/profile', icon: User },
  { title: 'Settings', url: '/settings', icon: Settings },
];

function NavItem({
  url,
  title,
  Icon,
  onNavigate,
}: {
  url: string;
  title: string;
  Icon: typeof LayoutDashboard;
  onNavigate?: () => void;
}) {
  const location = useLocation();
  const active = location.pathname === url;
  return (
    <NavLink
      to={url}
      onClick={onNavigate}
      className={cn(
        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
      )}
    >
      <Icon
        className={cn(
          'size-[18px] shrink-0',
          active
            ? 'text-sidebar-primary'
            : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground'
        )}
      />
      <span>{title}</span>
      {active && <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />}
    </NavLink>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOutUser();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="flex h-full w-[256px] flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
          Menu
        </p>
        {mainNavItems.map((item) => (
          <NavItem
            key={item.url}
            url={item.url}
            title={item.title}
            Icon={item.icon}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="space-y-1 border-t border-sidebar-border px-3 py-3">
        {bottomNavItems.map((item) => (
          <NavItem
            key={item.url}
            url={item.url}
            title={item.title}
            Icon={item.icon}
            onNavigate={onNavigate}
          />
        ))}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="size-[18px] shrink-0" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
