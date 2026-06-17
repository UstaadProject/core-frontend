import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const Logo: React.FC<{
  to?: string;
  className?: string;
  showText?: boolean;
  onDark?: boolean;
}> = ({ to = '/', className, showText = true, onDark = false }) => {
  return (
    <Link to={to} className={cn('flex items-center gap-2.5 group', className)}>
      <div
        className={cn(
          'grid size-9 place-items-center rounded-xl font-display text-lg font-extrabold shadow-sm transition-transform group-hover:scale-105',
          onDark
            ? 'bg-white text-primary'
            : 'bg-primary text-primary-foreground'
        )}
      >
        U
      </div>
      {showText && (
        <span className="font-display text-xl font-extrabold tracking-tight">
          Ustaad
        </span>
      )}
    </Link>
  );
};
