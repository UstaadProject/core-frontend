import { useEffect, useRef, useState } from 'react';
import { Trophy, Loader2, Lock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  getAchievements,
  type AchievementItem,
} from '@/services/api/learningApi';
import { useToast } from '@/hooks/use-toast';

export default function Achievements() {
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState<AchievementItem[]>([]);
  const [available, setAvailable] = useState<AchievementItem[]>([]);
  const hasFetchedRef = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchAchievements = async () => {
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
    };

    fetchAchievements();
  }, [toast]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-screen'>
          <div className='flex flex-col items-center gap-4'>
            <Loader2 className='w-8 h-8 animate-spin text-[hsl(var(--primary))]' />
            <p className='text-[hsl(var(--muted-foreground))]'>
              Loading achievements...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className='p-8 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold text-[hsl(var(--foreground))] flex items-center gap-3'>
          <Trophy className='w-8 h-8 text-[hsl(var(--primary))]' />
          Achievements & Badges
        </h1>
        <p className='text-[hsl(var(--muted-foreground))] mt-2 mb-8'>
          Unlock badges based on your consistency, progress, and milestones.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {available.map((achievement) => {
            const isUnlocked = unlocked.some(
              (item) => item.key === achievement.key
            );
            return (
              <div
                key={achievement.key}
                className={`rounded-xl border p-5 ${
                  isUnlocked
                    ? 'bg-[hsl(var(--card))] border-[hsl(var(--primary)/0.4)]'
                    : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] opacity-75'
                }`}
              >
                <div className='flex items-center justify-between mb-3'>
                  <div className='text-3xl'>{achievement.badge}</div>
                  {!isUnlocked && (
                    <Lock className='w-4 h-4 text-[hsl(var(--muted-foreground))]' />
                  )}
                </div>
                <h3 className='font-semibold text-[hsl(var(--foreground))]'>
                  {achievement.title}
                </h3>
                <p className='text-sm text-[hsl(var(--muted-foreground))] mt-1'>
                  {achievement.description}
                </p>
                <div className='mt-4 text-xs font-medium'>
                  {isUnlocked ? (
                    <span className='text-[hsl(var(--success))]'>Unlocked</span>
                  ) : (
                    <span className='text-[hsl(var(--muted-foreground))]'>
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
