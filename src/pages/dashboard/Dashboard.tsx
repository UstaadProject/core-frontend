import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Clock,
  Trophy,
  Zap,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { WelcomeHero } from '@/components/dashboard/WelcomeHero';
import { AIAssistant } from '@/components/learning/AIAssistant';
import {
  getDashboardStats,
  updateStreak,
  type DashboardStats,
} from '@/services/api/learningApi';
import { useToast } from '@/hooks/use-toast';

/* ---- Skeleton loading state ---- */
function DashboardSkeleton() {
  return (
    <DashboardLayout>
      <div className='p-8 max-w-7xl mx-auto space-y-6'>
        {/* Hero skeleton */}
        <div className='skeleton skeleton-card h-48 w-full' />
        {/* Stats row skeleton */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='skeleton skeleton-card h-32' />
          ))}
        </div>
        {/* Bottom grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 skeleton skeleton-card h-80' />
          <div className='skeleton skeleton-card h-80' />
        </div>
      </div>
    </DashboardLayout>
  );
}

const statConfigs = [
  {
    label: 'Modules Enrolled',
    icon: BookOpen,
    variant: 'primary' as const,
    iconColor: 'text-[hsl(var(--primary))]',
    iconBg: 'icon-bubble-primary',
    cardVariant: 'stat-card-primary',
  },
  {
    label: 'Hours Learned',
    icon: Clock,
    variant: 'secondary' as const,
    iconColor: 'text-[hsl(var(--secondary))]',
    iconBg: 'icon-bubble-secondary',
    cardVariant: 'stat-card-secondary',
  },
  {
    label: 'Skills Mastered',
    icon: Zap,
    variant: 'accent' as const,
    iconColor: 'text-[hsl(var(--accent))]',
    iconBg: 'icon-bubble-accent',
    cardVariant: 'stat-card-accent',
  },
  {
    label: 'XP Earned',
    icon: Trophy,
    variant: 'success' as const,
    iconColor: 'text-[hsl(var(--success))]',
    iconBg: 'icon-bubble-success',
    cardVariant: 'stat-card-success',
  },
];

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        await updateStreak().catch(() => {});
        const data = await getDashboardStats();
        setDashboardData(data);
      } catch (error) {
        toast({
          title: 'Failed to load dashboard',
          description:
            error instanceof Error ? error.message : 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  if (loading) return <DashboardSkeleton />;

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-screen'>
          <div className='text-center space-y-2'>
            <p className='text-[hsl(var(--muted-foreground))]'>
              Unable to load dashboard. Please refresh the page.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { user, gamification, stats, learningPath } = dashboardData;

  const statsDisplay = [
    {
      ...statConfigs[0],
      value: stats.coursesEnrolled.toString(),
      sub: `${stats.inProgress} in progress`,
    },
    {
      ...statConfigs[1],
      value: Math.round(stats.hoursLearned).toString(),
      sub: 'Total time spent',
    },
    {
      ...statConfigs[2],
      value: stats.skillsMastered.toString(),
      sub: `${stats.coursesEnrolled - stats.skillsMastered} more to unlock`,
    },
    {
      ...statConfigs[3],
      value: gamification.xp.toLocaleString(),
      sub: `${gamification.streakDays} day streak 🔥`,
    },
  ];

  const getModuleStatus = (module: (typeof learningPath.modules)[0]) => {
    if (module.status === 'completed') return 'completed';
    if (module.status === 'in-progress') return 'in-progress';
    return 'locked';
  };

  const getModuleProgress = (module: (typeof learningPath.modules)[0]) => {
    if (module.topicsCount === 0) return 0;
    return Math.round((module.completedTopicsCount / module.topicsCount) * 100);
  };

  return (
    <DashboardLayout>
      <div className='p-8 max-w-7xl mx-auto'>
        {/* Hero */}
        <div className='mb-8 animate-fade-in'>
          <WelcomeHero
            userName={user.name}
            streak={gamification.streakDays}
            xp={gamification.xp}
          />
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>
          {statsDisplay.map((stat, i) => (
            <div
              key={stat.label}
              className={`stat-card ${stat.cardVariant} p-6 animate-slide-up`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {/* Icon + label row */}
              <div className='flex items-start justify-between mb-4'>
                <div className={`icon-bubble ${stat.iconBg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
              <p className='text-[11px] text-[hsl(var(--muted-foreground))] font-semibold uppercase tracking-widest mb-1'>
                {stat.label}
              </p>
              <p className='text-3xl font-extrabold font-display text-[hsl(var(--foreground))] animate-number-pop'>
                {stat.value}
              </p>
              <p className='text-[12px] text-[hsl(var(--muted-foreground))] mt-2'>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Learning Path Card */}
          <div
            className='lg:col-span-2 ui-surface-card p-6 rounded-2xl animate-slide-up'
            style={{ animationDelay: '0.3s' }}
          >
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='text-xl font-bold font-display text-[hsl(var(--foreground))]'>
                  Learning Path
                </h2>
                <p className='text-sm text-[hsl(var(--muted-foreground))] mt-0.5'>
                  Your personalized{' '}
                  <span className='text-[hsl(var(--primary))] font-medium'>
                    {learningPath.level}
                  </span>{' '}
                  journey
                </p>
              </div>
              <span className='pill pill-primary text-[11px]'>
                {learningPath.completedModules}/{learningPath.totalModules} modules
              </span>
            </div>

            <div className='space-y-2'>
              {learningPath.modules.map((module, i) => {
                const status = getModuleStatus(module);
                const progress = getModuleProgress(module);

                return (
                  <div
                    key={module.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all border ${
                      status === 'in-progress'
                        ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 hover:border-primary/50'
                        : status === 'completed'
                          ? 'bg-[hsl(var(--success)/0.07)] border-[hsl(var(--success)/0.25)]'
                          : 'bg-[hsl(var(--muted)/0.15)] border-[hsl(var(--border)/0.4)] opacity-55'
                    }`}
                  >
                    {/* Status icon + connector */}
                    <div className='relative flex flex-col items-center'>
                      {status === 'completed' ? (
                        <CheckCircle2 className='w-6 h-6 text-[hsl(var(--success))]' />
                      ) : status === 'in-progress' ? (
                        <div
                          className='w-6 h-6 rounded-full border-2 flex items-center justify-center'
                          style={{
                            borderColor: 'hsl(var(--primary))',
                            boxShadow: '0 0 8px hsl(var(--primary) / 0.4)',
                          }}
                        >
                          <div
                            className='w-2.5 h-2.5 rounded-full'
                            style={{ background: 'hsl(var(--primary))' }}
                          />
                        </div>
                      ) : (
                        <div className='w-6 h-6 rounded-full border-2 border-[hsl(var(--muted))] opacity-40' />
                      )}
                      {i < learningPath.modules.length - 1 && (
                        <div
                          className={`absolute left-1/2 top-full w-0.5 h-5 -translate-x-1/2 mt-0.5 ${
                            status === 'completed'
                              ? 'bg-[hsl(var(--success)/0.5)]'
                              : 'bg-[hsl(var(--border))]'
                          }`}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className='flex-1 min-w-0'>
                      <p
                        className={`font-semibold text-sm truncate ${
                          status === 'locked'
                            ? 'text-[hsl(var(--muted-foreground))]'
                            : 'text-[hsl(var(--foreground))]'
                        }`}
                      >
                        {module.title}
                      </p>
                      {status === 'in-progress' && (
                        <div className='flex items-center gap-2 mt-2'>
                          <div className='flex-1 h-1.5 bg-[hsl(var(--muted)/0.4)] rounded-full overflow-hidden'>
                            <div
                              className='h-full rounded-full'
                              style={{
                                width: `${progress}%`,
                                background:
                                  'linear-gradient(90deg, hsl(var(--success)), hsl(var(--primary)))',
                              }}
                            />
                          </div>
                          <span className='text-[11px] font-semibold text-[hsl(var(--foreground))] w-8 text-right'>
                            {progress}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    {status === 'in-progress' && (
                      <button
                        onClick={() => navigate('/learning-path')}
                        className='px-4 py-1.5 rounded-lg text-sm font-semibold shrink-0 transition-all hover:opacity-90 hover:scale-[1.02]'
                        style={{
                          background:
                            'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
                          color: 'hsl(var(--primary-foreground))',
                          boxShadow: '0 0 12px hsl(var(--primary) / 0.3)',
                        }}
                      >
                        Continue
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigate('/learning-path')}
              className='flex items-center gap-2 mt-6 text-[hsl(var(--primary))] hover:gap-3 transition-all text-sm font-semibold group'
            >
              View full learning path
              <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
            </button>
          </div>

          {/* AI Assistant */}
          <div className='h-[560px] min-h-0 overflow-hidden rounded-2xl border border-[hsl(var(--border))]'>
            <AIAssistant />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
