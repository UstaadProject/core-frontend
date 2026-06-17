import * as React from 'react';
import { Flame, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

/* ----------------------------------------------------------------
   Leveling math — XP curve. Level N requires N*100 cumulative-ish.
   level(xp): each level needs (level * 100) xp.
----------------------------------------------------------------- */
export function levelFromXp(totalXp: number) {
  let level = 1;
  let remaining = Math.max(0, Math.floor(totalXp));
  let need = 100;
  while (remaining >= need) {
    remaining -= need;
    level += 1;
    need = level * 100;
  }
  return { level, intoLevel: remaining, neededForNext: need };
}

/* ---------------- XP bar (level + progress to next) ---------------- */
export function XpBar({
  totalXp,
  className,
  compact,
}: {
  totalXp: number;
  className?: string;
  compact?: boolean;
}) {
  const { level, intoLevel, neededForNext } = levelFromXp(totalXp);
  const pct = (intoLevel / neededForNext) * 100;
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
        {level}
      </div>
      <div className="min-w-0 flex-1">
        {!compact && (
          <div className="mb-1 flex items-center justify-between text-xs font-medium">
            <span className="text-foreground">Level {level}</span>
            <span className="text-muted-foreground">
              {intoLevel} / {neededForNext} XP
            </span>
          </div>
        )}
        <Progress value={pct} tone="xp" striped size={compact ? 'sm' : 'md'} />
      </div>
    </div>
  );
}

/* ---------------- Stat pill (icon + value + label) ---------------- */
export function StatPill({
  icon: Icon,
  value,
  label,
  tone = 'primary',
  className,
}: {
  icon: LucideIcon;
  value: React.ReactNode;
  label: string;
  tone?: 'primary' | 'xp' | 'streak' | 'badge' | 'info';
  className?: string;
}) {
  const toneMap: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    xp: 'bg-xp/12 text-xp',
    streak: 'bg-streak/12 text-streak',
    badge: 'bg-badge/15 text-badge',
    info: 'bg-info/12 text-info',
  };
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5',
        className
      )}
    >
      <div className={cn('grid size-10 place-items-center rounded-xl', toneMap[tone])}>
        <Icon className="size-5" />
      </div>
      <div className="leading-tight">
        <div className="font-display text-xl font-extrabold tabular-nums">
          {value}
        </div>
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

/* ---------------- Streak flame ---------------- */
export function StreakFlame({
  days,
  className,
}: {
  days: number;
  className?: string;
}) {
  const active = days > 0;
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold',
        active ? 'bg-streak/12 text-streak' : 'bg-muted text-muted-foreground',
        className
      )}
      title={`${days}-day streak`}
    >
      <Flame className={cn('size-4', active && 'fill-streak/30')} />
      <span className="tabular-nums">{days}</span>
    </div>
  );
}

/* ---------------- Level ring (circular progress) ---------------- */
export function LevelRing({
  value,
  size = 64,
  stroke = 6,
  tone = 'primary',
  children,
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  tone?: 'primary' | 'xp' | 'success' | 'streak';
  children?: React.ReactNode;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const colorMap: Record<string, string> = {
    primary: 'var(--primary)',
    xp: 'var(--xp)',
    success: 'var(--success)',
    streak: 'var(--streak)',
  };
  return (
    <div
      className={cn('relative grid place-items-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={colorMap[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (pct / 100) * c}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/* ---------------- Confetti burst (celebration) ----------------
   Lightweight CSS confetti — render when `fire` is true. */
const CONFETTI_COLORS = [
  'var(--primary)',
  'var(--xp)',
  'var(--streak)',
  'var(--badge)',
  'var(--info)',
];

export function ConfettiBurst({ pieces = 40 }: { pieces?: number }) {
  const bits = React.useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.2,
        duration: 0.9 + Math.random() * 0.8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 6 + Math.random() * 6,
        rotate: Math.random() * 360,
      })),
    [pieces]
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {bits.map((b) => (
        <span
          key={b.id}
          className="absolute top-1/3 block rounded-[2px]"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size * 0.6,
            background: b.color,
            transform: `rotate(${b.rotate}deg)`,
            animation: `confetti-fall ${b.duration}s ${b.delay}s cubic-bezier(0.2,0.6,0.4,1) forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(90vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
