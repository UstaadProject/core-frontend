import { useEffect, useRef, useState } from 'react';
import { Trophy, Flame, Zap, Clock, Crown } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  getLeaderboard,
  type LeaderboardUser,
} from '@/services/api/learningApi';
import { useToast } from '@/hooks/use-toast';

function LeaderboardSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="h-20 w-2/5 animate-pulse rounded-2xl bg-muted" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-2xl bg-muted" />
      </div>
    </DashboardLayout>
  );
}

// gradient + ring per podium rank (0=gold,1=silver,2=bronze)
const podiumStyles = [
  { ring: 'ring-badge', avatar: 'bg-badge text-white', block: 'h-32', glow: 'shadow-[0_8px_32px_-8px_var(--badge)]' },
  { ring: 'ring-muted-foreground/40', avatar: 'bg-muted-foreground text-white', block: 'h-24', glow: '' },
  { ring: 'ring-streak/50', avatar: 'bg-streak text-white', block: 'h-20', glow: '' },
];
const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div
      className={cn(
        'grid place-items-center rounded-full font-bold uppercase',
        className
      )}
    >
      {name.charAt(0)}
    </div>
  );
}

export default function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const { toast } = useToast();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    (async () => {
      try {
        setLoading(true);
        setUsers(await getLeaderboard());
      } catch (error) {
        toast({
          title: 'Failed to load leaderboard',
          description:
            error instanceof Error ? error.message : 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  if (loading) return <LeaderboardSkeleton />;

  const topThree = users.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="grid size-12 place-items-center rounded-2xl bg-badge/15 text-badge">
            <Trophy className="size-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
              Leaderboard
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Compete on XP, streaks and learning progress.
            </p>
          </div>
        </div>

        {/* Podium */}
        {topThree.length >= 3 && (
          <div className="flex items-end justify-center gap-3 sm:gap-5">
            {podiumOrder.map((rank) => {
              const user = topThree[rank];
              if (!user) return null;
              const style = podiumStyles[rank];
              return (
                <div key={user.email} className="flex w-28 flex-col items-center gap-3 sm:w-40">
                  <Card className={cn('relative w-full text-center', style.glow)}>
                    <CardContent className="p-4">
                      {rank === 0 && (
                        <Crown className="absolute -top-3.5 left-1/2 size-7 -translate-x-1/2 fill-badge/30 text-badge" />
                      )}
                      <Avatar
                        name={user.name}
                        className={cn('mx-auto size-12 text-lg ring-2 ring-offset-2 ring-offset-card', style.ring, style.avatar)}
                      />
                      <p className="mt-2.5 truncate text-sm font-bold">{user.name}</p>
                      <div className="mt-1 flex items-center justify-center gap-1 text-sm font-bold text-xp">
                        <Zap className="size-3.5" />
                        {user.xp.toLocaleString()}
                      </div>
                      <div className="mt-1.5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Flame className="size-3" /> {user.streakDays}d
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="size-3" /> {Math.round(user.hoursLearned)}h
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  <div
                    className={cn(
                      'grid w-full place-items-center rounded-t-xl font-display text-2xl font-extrabold text-white',
                      style.block,
                      style.avatar
                    )}
                  >
                    #{rank + 1}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full rankings */}
        <Card className="overflow-hidden">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-display font-bold">Full Rankings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {['Rank', 'Learner', 'XP', 'Streak', 'Skills', 'Hours', 'Modules'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.email}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/40"
                  >
                    <td className="px-5 py-3">
                      <Badge
                        variant={user.rank <= 3 ? 'badge' : 'secondary'}
                        className="tabular-nums"
                      >
                        #{user.rank}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          name={user.name}
                          className="size-8 bg-primary text-xs text-primary-foreground"
                        />
                        <span className="font-semibold">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-xp">
                        <Zap className="size-3.5" />
                        {user.xp.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 text-streak">
                        <Flame className="size-3.5" />
                        {user.streakDays}d
                      </span>
                    </td>
                    <td className="px-5 py-3 tabular-nums">{user.skillsMastered}</td>
                    <td className="px-5 py-3 tabular-nums">
                      {Math.round(user.hoursLearned)}h
                    </td>
                    <td className="px-5 py-3 tabular-nums">{user.modulesCompleted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
