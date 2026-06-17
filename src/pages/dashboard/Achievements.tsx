import { useEffect, useRef, useState } from 'react';
import { Trophy, Lock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LevelRing } from '@/components/gamification';
import { cn } from '@/lib/utils';
import {
  getAchievements,
  type AchievementItem,
} from '@/services/api/learningApi';
import { useToast } from '@/hooks/use-toast';

function AchievementsSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="h-28 w-full animate-pulse rounded-2xl bg-muted" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function BadgeCard({
  achievement,
  unlocked,
}: {
  achievement: AchievementItem;
  unlocked: boolean;
}) {
  return (
    <Card
      className={cn(
        'card-hover relative overflow-hidden',
        unlocked ? 'border-badge/30 bg-badge/[0.04]' : 'opacity-80'
      )}
    >
      <CardContent className="p-5">
        {!unlocked && (
          <div className="absolute right-3 top-3">
            <Lock className="size-4 text-muted-foreground" />
          </div>
        )}
        <div className={cn('mb-3 text-4xl', !unlocked && 'opacity-40 grayscale')}>
          {achievement.badge}
        </div>
        <h3
          className={cn(
            'text-sm font-bold',
            unlocked ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {achievement.title}
        </h3>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          {achievement.description}
        </p>
        <div className="mt-3">
          {unlocked ? (
            <Badge variant="badge">✓ Unlocked</Badge>
          ) : (
            <Badge variant="secondary">Locked</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Achievements() {
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState<AchievementItem[]>([]);
  const [available, setAvailable] = useState<AchievementItem[]>([]);
  const hasFetchedRef = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getAchievements();
        setUnlocked(data.unlocked || []);
        setAvailable(data.available || []);
      } catch (error) {
        toast({
          title: 'Failed to load achievements',
          description:
            error instanceof Error ? error.message : 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  if (loading) return <AchievementsSkeleton />;

  const unlockedKeys = new Set(unlocked.map((u) => u.key));
  const totalBadges = available.length;
  const unlockedCount = unlocked.length;
  const pct = totalBadges > 0 ? (unlockedCount / totalBadges) * 100 : 0;
  const lockedList = available.filter((a) => !unlockedKeys.has(a.key));

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-8">
        {/* Hero */}
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-2xl bg-badge/15 text-badge">
                <Trophy className="size-6" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
                  Achievements & Badges
                </h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Earn badges for consistency, progress and milestones.
                </p>
              </div>
            </div>
            <LevelRing value={pct} size={88} stroke={8} tone="streak">
              <div className="text-center">
                <div className="font-display text-xl font-extrabold tabular-nums">
                  {unlockedCount}
                </div>
                <div className="text-[10px] font-medium text-muted-foreground">
                  / {totalBadges}
                </div>
              </div>
            </LevelRing>
          </CardContent>
        </Card>

        {/* Earned */}
        {unlockedCount > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="badge">✓ Earned</Badge>
              <span className="text-xs text-muted-foreground">
                {unlockedCount} badge{unlockedCount !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {available
                .filter((a) => unlockedKeys.has(a.key))
                .map((a) => (
                  <BadgeCard key={a.key} achievement={a} unlocked />
                ))}
            </div>
          </div>
        )}

        {/* Locked */}
        {lockedList.length > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="secondary">🔒 Locked</Badge>
              <span className="text-xs text-muted-foreground">
                {lockedList.length} remaining
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {lockedList.map((a) => (
                <BadgeCard key={a.key} achievement={a} unlocked={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
