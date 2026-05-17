import { useEffect, useRef, useState } from 'react';
import { Trophy, Lock, Star } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  getAchievements,
  type AchievementItem,
} from '@/services/api/learningApi';
import { useToast } from '@/hooks/use-toast';

function AchievementsSkeleton() {
  return (
    <DashboardLayout>
      <div className='p-8 max-w-7xl mx-auto space-y-6'>
        <div className='skeleton skeleton-card h-20 w-2/5' />
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {[...Array(8)].map((_, i) => <div key={i} className='skeleton skeleton-card h-44' />)}
        </div>
      </div>
    </DashboardLayout>
  );
}

/* SVG progress arc */
function ProgressArc({
  unlocked,
  total,
}: {
  unlocked: number;
  total: number;
}) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? unlocked / total : 0;
  const dash = pct * circ;

  return (
    <svg width='120' height='120' viewBox='0 0 100 100'>
      <defs>
        <linearGradient id='arcGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='hsl(320 100% 58%)' />
          <stop offset='100%' stopColor='hsl(280 100% 65%)' />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle
        cx='50'
        cy='50'
        r={r}
        fill='none'
        stroke='hsl(240 6% 20%)'
        strokeWidth='8'
      />
      {/* Fill */}
      <circle
        cx='50'
        cy='50'
        r={r}
        fill='none'
        stroke='url(#arcGrad)'
        strokeWidth='8'
        strokeLinecap='round'
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ / 4}
        style={{ transition: 'stroke-dasharray 1s cubic-bezier(.4,0,.2,1)' }}
      />
      {/* Label */}
      <text
        x='50'
        y='46'
        textAnchor='middle'
        fill='white'
        fontSize='18'
        fontWeight='800'
        fontFamily='Plus Jakarta Sans, Inter, sans-serif'
      >
        {unlocked}
      </text>
      <text
        x='50'
        y='62'
        textAnchor='middle'
        fill='hsl(240 5% 64.9%)'
        fontSize='9'
        fontWeight='600'
        fontFamily='Inter, sans-serif'
      >
        / {total}
      </text>
    </svg>
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

  if (loading) return <AchievementsSkeleton />;

  const unlockedKeys = new Set(unlocked.map((u) => u.key));
  const totalBadges = available.length;
  const unlockedCount = unlocked.length;

  return (
    <DashboardLayout>
      <div className='max-w-7xl mx-auto'>
        {/* Page banner */}
        <div className='page-banner'>
          <div className='flex items-center justify-between gap-6'>
            <div className='flex items-center gap-4'>
              <div
                className='p-3 rounded-xl'
                style={{ background: 'linear-gradient(135deg, hsl(var(--primary)/0.2), hsl(var(--accent)/0.15))' }}
              >
                <Trophy className='w-7 h-7 text-[hsl(var(--primary))] animate-bounce-subtle' />
              </div>
              <div>
                <h1 className='text-3xl font-extrabold font-display text-[hsl(var(--foreground))]'>
                  Achievements & Badges
                </h1>
                <p className='text-[hsl(var(--muted-foreground))] text-sm mt-0.5'>
                  Unlock badges based on consistency, progress, and milestones
                </p>
              </div>
            </div>

            {/* Progress arc */}
            <div className='flex items-center gap-4 shrink-0'>
              <ProgressArc unlocked={unlockedCount} total={totalBadges} />
              <div className='text-right hidden sm:block'>
                <p className='text-2xl font-extrabold font-display text-[hsl(var(--foreground))]'>
                  {unlockedCount}/{totalBadges}
                </p>
                <p className='text-[hsl(var(--muted-foreground))] text-xs font-semibold uppercase tracking-wider'>
                  Badges Earned
                </p>
                <div className='mt-2 flex items-center gap-1 justify-end'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.round((unlockedCount / totalBadges) * 5) ? 'text-yellow-400' : 'text-[hsl(var(--muted))]'}`}
                      fill={i < Math.round((unlockedCount / totalBadges) * 5) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='p-8 space-y-8'>
          {/* Unlocked section */}
          {unlockedCount > 0 && (
            <div>
              <div className='flex items-center gap-2 mb-4'>
                <span className='pill pill-success text-[11px]'>✓ Earned</span>
                <span className='text-[hsl(var(--muted-foreground))] text-xs'>
                  {unlockedCount} badge{unlockedCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {available
                  .filter((a) => unlockedKeys.has(a.key))
                  .map((achievement, i) => (
                    <div
                      key={achievement.key}
                      className='achievement-unlocked rounded-2xl p-5 transition-all hover:scale-[1.02] hover:-translate-y-1 animate-slide-up'
                      style={{ animationDelay: `${i * 0.06}s` }}
                    >
                      <div className='text-4xl mb-3 animate-bounce-subtle' style={{ animationDelay: `${i * 0.2}s` }}>
                        {achievement.badge}
                      </div>
                      <h3 className='font-bold text-sm text-[hsl(var(--foreground))] mb-1'>
                        {achievement.title}
                      </h3>
                      <p className='text-[11px] text-[hsl(var(--muted-foreground))] leading-relaxed'>
                        {achievement.description}
                      </p>
                      <div className='mt-3'>
                        <span className='pill pill-success text-[10px]'>✓ Unlocked</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Locked section */}
          {available.filter((a) => !unlockedKeys.has(a.key)).length > 0 && (
            <div>
              <div className='flex items-center gap-2 mb-4'>
                <span className='pill pill-primary text-[11px]'>🔒 Locked</span>
                <span className='text-[hsl(var(--muted-foreground))] text-xs'>
                  {available.filter((a) => !unlockedKeys.has(a.key)).length} remaining
                </span>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {available
                  .filter((a) => !unlockedKeys.has(a.key))
                  .map((achievement, i) => (
                    <div
                      key={achievement.key}
                      className='achievement-locked rounded-2xl p-5 relative overflow-hidden animate-slide-up'
                      style={{ animationDelay: `${(unlockedCount + i) * 0.05}s` }}
                    >
                      <div className='text-4xl mb-3 blur-[2px]'>
                        {achievement.badge}
                      </div>
                      {/* Lock overlay */}
                      <div className='absolute top-3 right-3'>
                        <Lock className='w-4 h-4 text-[hsl(var(--muted-foreground))]' />
                      </div>
                      <h3 className='font-bold text-sm text-[hsl(var(--muted-foreground))] mb-1'>
                        {achievement.title}
                      </h3>
                      <p className='text-[11px] text-[hsl(var(--muted-foreground)/0.7)] leading-relaxed'>
                        {achievement.description}
                      </p>
                      <div className='mt-3'>
                        <span className='pill text-[10px]' style={{ background: 'hsl(var(--muted)/0.5)', color: 'hsl(var(--muted-foreground))' }}>
                          Locked
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
