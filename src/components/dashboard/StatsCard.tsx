import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'accent';
  trend?: { value: number; positive: boolean };
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'primary',
  trend,
}: StatsCardProps) {
  const variants = {
    primary: {
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      glow: 'group-hover:glow-primary',
    },
    secondary: {
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary',
      glow: 'group-hover:glow-secondary',
    },
    accent: {
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
      glow: 'group-hover:glow-accent',
    },
  };

  const v = variants[variant];

  return (
    <div
      className={cn(
        'group relative p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300',
        v.glow
      )}
    >
      {/* Glow effect */}
      <div
        className={cn(
          'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl',
          variant === 'primary' && 'bg-primary/10',
          variant === 'secondary' && 'bg-secondary/10',
          variant === 'accent' && 'bg-accent/10'
        )}
      />

      <div className='flex items-start justify-between'>
        <div className='space-y-1'>
          <p className='text-sm text-muted-foreground'>{title}</p>
          <p className='text-3xl font-display font-bold text-foreground'>
            {value}
          </p>
          {subtitle && <p className='text-xs text-muted-text'>{subtitle}</p>}
          {trend && (
            <p
              className={cn(
                'text-xs font-medium',
                trend.positive ? 'text-success' : 'text-destructive'
              )}
            >
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% from last
              week
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', v.iconBg)}>
          <Icon className={cn('w-5 h-5', v.iconColor)} />
        </div>
      </div>
    </div>
  );
}
