import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import {
  getUserAnalytics,
  type UserAnalytics,
} from '@/services/api/analyticsApi';
import {
  TrendingUp,
  AlertCircle,
  Brain,
  Zap,
  Target,
  BookOpen,
} from 'lucide-react';
import { PerformanceOverview } from '@/components/analytics/PerformanceOverview';
import { WeakAreasSection } from '@/components/analytics/WeakAreasSection';
import { RecommendedTopicsSection } from '@/components/analytics/RecommendedTopicsSection';
import { RecommendedProjectsSection } from '@/components/analytics/RecommendedProjectsSection';
import { InsightsSection } from '@/components/analytics/InsightsSection';

function AnalyticsSkeleton() {
  return (
    <DashboardLayout>
      <div className='p-8 max-w-7xl mx-auto space-y-6'>
        <div className='skeleton skeleton-card h-20 w-2/5' />
        <div className='grid grid-cols-3 gap-5'>
          {[...Array(3)].map((_, i) => <div key={i} className='skeleton skeleton-card h-32' />)}
        </div>
        <div className='grid grid-cols-3 gap-5'>
          <div className='col-span-2 skeleton skeleton-card h-64' />
          <div className='skeleton skeleton-card h-64' />
        </div>
      </div>
    </DashboardLayout>
  );
}

interface PerformanceBarProps {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

function PerformanceBar({ label, value, color, icon }: PerformanceBarProps) {
  return (
    <div className='space-y-1.5'>
      <div className='flex items-center justify-between text-sm'>
        <div className='flex items-center gap-2 text-[hsl(var(--muted-foreground))]'>
          {icon}
          <span>{label}</span>
        </div>
        <span className='font-bold' style={{ color }}>
          {value.toFixed(1)}%
        </span>
      </div>
      <div className='w-full h-2 rounded-full bg-[hsl(var(--muted)/0.4)] overflow-hidden'>
        <div
          className='h-full rounded-full transition-all duration-1000'
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function Analytics() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<UserAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserAnalytics();

        if (!data || typeof data !== 'object') {
          throw new Error('Invalid analytics data received');
        }

        setAnalyticsData(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(errorMessage);
        toast({
          title: 'Failed to load analytics',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [toast]);

  if (loading) return <AnalyticsSkeleton />;

  if (!analyticsData || error) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-screen'>
          <div className='flex flex-col items-center gap-4 text-center'>
            <div
              className='p-4 rounded-2xl'
              style={{ background: 'hsl(var(--destructive)/0.1)' }}
            >
              <AlertCircle className='w-8 h-8 text-[hsl(var(--destructive))]' />
            </div>
            <p className='text-[hsl(var(--muted-foreground))]'>
              {error ?? 'Unable to load analytics. Please refresh the page.'}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className='max-w-7xl mx-auto animate-fade-in'>
        {/* Page banner */}
        <div className='page-banner'>
          <div className='flex items-center gap-4 mb-2'>
            <div
              className='p-3 rounded-xl'
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)/0.2), hsl(var(--accent)/0.15))' }}
            >
              <TrendingUp className='w-6 h-6 text-[hsl(var(--primary))]' />
            </div>
            <div>
              <h1 className='text-3xl font-extrabold font-display text-[hsl(var(--foreground))]'>
                Learning Analytics
              </h1>
              <p className='text-[hsl(var(--muted-foreground))] text-sm mt-0.5'>
                Deep insights into your progress and personalized recommendations
              </p>
            </div>
          </div>
        </div>

        <div className='p-8 space-y-8'>
          {/* Performance Overview */}
          {analyticsData.performanceMetrics && analyticsData.overview && (
            <PerformanceOverview data={analyticsData} />
          )}

          {/* Main Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 space-y-6'>
              {/* Weak Areas */}
              {(analyticsData.weakAreas?.length ?? 0) > 0 && (
                <WeakAreasSection weakAreas={analyticsData.weakAreas || []} />
              )}

              {/* Recommended Topics */}
              {(analyticsData.recommendedTopics?.length ?? 0) > 0 && (
                <RecommendedTopicsSection topics={analyticsData.recommendedTopics || []} />
              )}
            </div>

            <div className='space-y-6'>
              {/* Your Strengths */}
              {(analyticsData.strengths?.length ?? 0) > 0 && (
                <div className='ui-surface-card p-6 rounded-2xl'>
                  <div className='section-header'>
                    <div className='section-header-icon icon-bubble icon-bubble-success'>
                      <Zap className='w-4 h-4 text-[hsl(var(--success))]' />
                    </div>
                    <h3 className='font-bold font-display text-[hsl(var(--foreground))]'>
                      Your Strengths
                    </h3>
                  </div>
                  <div className='space-y-2'>
                    {(analyticsData.strengths || []).map((strength, idx) => (
                      <div
                        key={idx}
                        className='flex items-start gap-2.5 p-2.5 rounded-lg animate-slide-up'
                        style={{
                          animationDelay: `${idx * 0.06}s`,
                          background: 'hsl(var(--success)/0.07)',
                          border: '1px solid hsl(var(--success)/0.2)',
                        }}
                      >
                        <div className='w-1.5 h-1.5 rounded-full bg-[hsl(var(--success))] flex-shrink-0 mt-1.5' />
                        <p className='text-sm text-[hsl(var(--foreground))]'>{strength}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance metrics */}
              <div className='ui-surface-card p-6 rounded-2xl'>
                <div className='section-header'>
                  <div className='section-header-icon icon-bubble icon-bubble-accent'>
                    <Brain className='w-4 h-4 text-[hsl(var(--accent))]' />
                  </div>
                  <h3 className='font-bold font-display text-[hsl(var(--foreground))]'>
                    Performance
                  </h3>
                </div>
                <div className='space-y-4'>
                  <PerformanceBar
                    label='Quiz Score'
                    value={analyticsData.performanceMetrics.averageQuizScore}
                    color='hsl(var(--primary))'
                    icon={<Target className='w-3.5 h-3.5' />}
                  />
                  <PerformanceBar
                    label='Completion Rate'
                    value={analyticsData.performanceMetrics.completionRate * 100}
                    color='hsl(var(--secondary))'
                    icon={<BookOpen className='w-3.5 h-3.5' />}
                  />
                  <PerformanceBar
                    label='Engagement'
                    value={analyticsData.performanceMetrics.engagementScore * 100}
                    color='hsl(var(--accent))'
                    icon={<Zap className='w-3.5 h-3.5' />}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Projects */}
          {(analyticsData.recommendedProjects?.length ?? 0) > 0 && (
            <RecommendedProjectsSection projects={analyticsData.recommendedProjects || []} />
          )}

          {/* Insights */}
          {(analyticsData.insights?.length ?? 0) > 0 && (
            <InsightsSection insights={analyticsData.insights || []} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
