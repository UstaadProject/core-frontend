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
  Loader2,
} from 'lucide-react';
import { WelcomeHero } from '@/components/dashboard/WelcomeHero';
import { AIAssistant } from '@/components/learning/AIAssistant';
import {
  getDashboardStats,
  updateStreak,
  type DashboardStats,
} from '@/services/api/learningApi';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(
    null
  );
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Update streak on dashboard load
        await updateStreak().catch(() => {}); // Silent fail for streak
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-screen'>
          <div className='flex flex-col items-center gap-4'>
            <Loader2 className='w-8 h-8 animate-spin text-[hsl(var(--primary))]' />
            <p className='text-[hsl(var(--muted-foreground))]'>
              Loading your dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-screen'>
          <div className='flex flex-col items-center gap-4'>
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
      label: 'Modules Enrolled',
      value: stats.coursesEnrolled.toString(),
      sub: `${stats.inProgress} in progress`,
      icon: BookOpen,
    },
    {
      label: 'Hours Learned',
      value: Math.round(stats.hoursLearned).toString(),
      sub: 'Total time',
      icon: Clock,
    },
    {
      label: 'Skills Mastered',
      value: stats.skillsMastered.toString(),
      sub: `${stats.coursesEnrolled - stats.skillsMastered} more to unlock`,
      icon: Zap,
    },
    {
      label: 'XP Earned',
      value: gamification.xp.toString(),
      sub: `${gamification.streakDays} day streak`,
      icon: Trophy,
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
      <div className='p-8 max-w-7xl h-screen mx-auto flex flex-col'>
        {/* Header */}
        <div className='mb-8 animate-fade-in'>
          <WelcomeHero
            userName={user.name}
            streak={gamification.streakDays}
            xp={gamification.xp}
          />
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          {statsDisplay.map((stat, i) => (
            <div
              key={stat.label}
              className='bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-5 animate-fade-in'
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-sm text-[hsl(var(--muted-foreground))]'>
                    {stat.label}
                  </p>
                  <p className='text-3xl font-bold text-[hsl(var(--foreground))] mt-1'>
                    {stat.value}
                  </p>
                  <p className='text-sm text-[hsl(var(--muted-foreground))] mt-1'>
                    {stat.sub}
                  </p>
                </div>
                <div className='w-10 h-10 rounded-xl bg-[hsl(var(--primary)/0.1)] flex items-center justify-center'>
                  <stat.icon className='w-5 h-5 text-[hsl(var(--primary))]' />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Learning Path Card */}
          <div
            className='lg:col-span-2 bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-6 animate-fade-in'
            style={{ animationDelay: '0.4s' }}
          >
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='text-xl font-semibold text-[hsl(var(--foreground))]'>
                  Learning Path
                </h2>
                <p className='text-sm text-[hsl(var(--muted-foreground))] mt-0.5'>
                  Your personalized {learningPath.level} journey
                </p>
              </div>
              <span className='px-3 py-1 text-sm rounded-full bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))]'>
                {learningPath.completedModules} of {learningPath.totalModules}{' '}
                modules
              </span>
            </div>

            <div className='space-y-3'>
              {learningPath.modules.map((module, i) => {
                const status = getModuleStatus(module);
                const progress = getModuleProgress(module);

                return (
                  <div
                    key={module.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      status === 'in-progress'
                        ? 'bg-[hsl(var(--surface-elevated))] border border-[hsl(var(--primary)/0.3)]'
                        : 'hover:bg-[hsl(var(--muted)/0.3)]'
                    }`}
                  >
                    {/* Status Icon */}
                    <div className='relative'>
                      {status === 'completed' ? (
                        <CheckCircle2 className='w-6 h-6 text-[hsl(var(--success))]' />
                      ) : status === 'in-progress' ? (
                        <div className='w-6 h-6 rounded-full border-2 border-[hsl(var(--primary))] flex items-center justify-center'>
                          <div className='w-2.5 h-2.5 rounded-full bg-[hsl(var(--primary))]' />
                        </div>
                      ) : (
                        <div className='w-6 h-6 rounded-full border-2 border-[hsl(var(--muted))] opacity-50' />
                      )}
                      {i < learningPath.modules.length - 1 && (
                        <div
                          className={`absolute left-1/2 top-full w-0.5 h-6 -translate-x-1/2 ${
                            status === 'completed'
                              ? 'bg-[hsl(var(--success))]'
                              : 'bg-[hsl(var(--border))]'
                          }`}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className='flex-1'>
                      <p
                        className={`font-medium ${
                          status === 'locked'
                            ? 'text-[hsl(var(--muted-foreground))] opacity-50'
                            : 'text-[hsl(var(--foreground))]'
                        }`}
                      >
                        {module.title}
                      </p>
                      {status === 'in-progress' && (
                        <div className='flex items-center gap-3 mt-2'>
                          <span className='text-xs text-[hsl(var(--muted-foreground))]'>
                            Progress
                          </span>
                          <div className='flex-1 h-1.5 bg-[hsl(var(--muted))] rounded-full overflow-hidden'>
                            <div
                              className='h-full bg-linear-to-r from-[hsl(var(--success))] to-[hsl(var(--primary))] rounded-full'
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className='text-xs text-[hsl(var(--foreground))]'>
                            {progress}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    {status === 'in-progress' && (
                      <button
                        onClick={() => navigate('/learning-path')}
                        className='px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium hover:opacity-90 transition-opacity'
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
              className='flex items-center gap-2 mt-6 text-[hsl(var(--primary))] hover:underline text-sm font-medium'
            >
              View full learning path
              <ArrowRight className='w-4 h-4' />
            </button>
          </div>

          <div className='h-140 min-h-0 overflow-hidden rounded-xl border border-[hsl(var(--border))]'>
            <AIAssistant />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
