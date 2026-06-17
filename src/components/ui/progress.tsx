import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const fillVariants = cva('h-full rounded-full transition-all duration-700 ease-out', {
  variants: {
    tone: {
      primary: 'bg-primary',
      xp: 'bg-xp',
      success: 'bg-success',
      streak: 'bg-streak',
      info: 'bg-info',
    },
  },
  defaultVariants: { tone: 'primary' },
});

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof fillVariants> {
  /** 0–100 */
  value?: number;
  /** show animated diagonal stripes on the fill */
  striped?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' } as const;

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, tone, striped, size = 'md', ...props }, ref) => {
    const pct = Math.max(0, Math.min(100, value));
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          'w-full overflow-hidden rounded-full bg-muted',
          sizeMap[size],
          className
        )}
        {...props}
      >
        <div
          className={cn(fillVariants({ tone }), striped && 'progress-stripe')}
          style={{ width: `${pct}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
