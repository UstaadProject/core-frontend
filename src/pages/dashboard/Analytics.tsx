import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import {
  getUserAnalytics,
  type UserAnalytics,
} from '@/services/api/analyticsApi';
import {
  Loader2,
  TrendingUp,
  AlertCircle,
  Brain,
  Zap,
} from 'lucide-react';
import { PerformanceOverview } from '@/components/analytics/PerformanceOverview';
import { WeakAreasSection } from '@/components/analytics/WeakAreasSection';
import { RecommendedTopicsSection } from '@/components/analytics/RecommendedTopicsSection';
import { RecommendedProjectsSection } from '@/components/analytics/RecommendedProjectsSection';
import { InsightsSection } from '@/components/analytics/InsightsSection';

export default function Analytics() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<UserAnalytics | null>(
    null
  );
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

        // Validate data structure
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid analytics data received');
        }

        setAnalyticsData(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred';
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-screen'>
          <div className='flex flex-col items-center gap-4'>
            <Loader2 className='w-8 h-8 animate-spin text-[hsl(var(--primary))]' />
            <p className='text-[hsl(var(--muted-foreground))]'>
              Analyzing your learning journey...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!analyticsData || error) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-screen'>
          <div className='flex flex-col items-center gap-4'>
            <AlertCircle className='w-8 h-8 text-[hsl(var(--destructive))]' />
            <p className='text-[hsl(var(--muted-foreground))]'>
              {error
                ? error
                : 'Unable to load analytics. Please refresh the page.'}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className='min-h-screen bg-[hsl(var(--background))] animate-fade-in'>
        {/* Header */}
        <div className='px-6 py-8 border-b border-[hsl(var(--border))] bg-gradient-to-b from-[hsl(var(--background))] to-transparent'>
          <div className='max-w-7xl mx-auto'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20'>
                <TrendingUp className='w-6 h-6 text-[hsl(var(--primary))]' />
              </div>
              <h1 className='text-4xl font-bold text-[hsl(var(--foreground))]'>
                Your Learning Analytics
              </h1>
            </div>
            <p className='text-[hsl(var(--muted-foreground))] text-lg'>
              Deep insights into your learning progress and personalized
              recommendations
            </p>
          </div>
        </div>

        {/* Content */}
        <div className='px-6 py-8'>
          <div className='max-w-7xl mx-auto space-y-8'>
            {/* Performance Overview */}
            {analyticsData &&
              analyticsData.performanceMetrics &&
              analyticsData.overview && (
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
                  <RecommendedTopicsSection
                    topics={analyticsData.recommendedTopics || []}
                  />
                )}
              </div>

              <div className='space-y-6'>
                {/* Strengths Card */}
                {(analyticsData.strengths?.length ?? 0) > 0 && (
                  <div className='ui-surface-card p-6 rounded-2xl'>
                    <div className='flex items-center gap-2 mb-4'>
                      <div className='p-2 rounded-lg bg-success/20'>
                        <Zap className='w-5 h-5 text-success' />
                      </div>
                      <h3 className='ui-section-title'>Your Strengths</h3>
                    </div>
                    <div className='space-y-2.5'>
                      {(analyticsData.strengths || []).map((strength, idx) => (
                        <div
                          key={idx}
                          className='flex items-start gap-3 p-2.5 rounded-lg bg-success/5 border border-success/20'
                        >
                          <div className='w-1.5 h-1.5 rounded-full bg-success flex-shrink-0 mt-1.5' />
                          <p className='text-sm text-[hsl(var(--foreground))]'>
                            {strength}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className='ui-surface-card p-6 rounded-2xl'>
                  <div className='flex items-center gap-2 mb-4'>
                    <div className='p-2 rounded-lg bg-accent/20'>
                      <Brain className='w-5 h-5 text-accent' />
                    </div>
                    <h3 className='ui-section-title'>Performance</h3>
                  </div>
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-[hsl(var(--muted-foreground))]'>
                        Quiz Score
                      </span>
                      <span className='font-bold text-[hsl(var(--primary))]'>
                        {analyticsData.performanceMetrics.averageQuizScore.toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                    <div className='w-full bg-muted/30 rounded-full h-2'>
                      <div
                        className='bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all'
                        style={{
                          width: `${analyticsData.performanceMetrics.averageQuizScore}%`,
                        }}
                      />
                    </div>

                    <div className='pt-2 flex justify-between items-center'>
                      <span className='text-sm text-[hsl(var(--muted-foreground))]'>
                        Completion
                      </span>
                      <span className='font-bold text-[hsl(var(--primary))]'>
                        {(
                          analyticsData.performanceMetrics.completionRate * 100
                        ).toFixed(0)}
                        %
                      </span>
                    </div>
                    <div className='w-full bg-muted/30 rounded-full h-2'>
                      <div
                        className='bg-gradient-to-r from-secondary to-primary h-2 rounded-full transition-all'
                        style={{
                          width: `${analyticsData.performanceMetrics.completionRate * 100}%`,
                        }}
                      />
                    </div>

                    <div className='pt-2 flex justify-between items-center'>
                      <span className='text-sm text-[hsl(var(--muted-foreground))]'>
                        Engagement
                      </span>
                      <span className='font-bold text-[hsl(var(--primary))]'>
                        {(
                          analyticsData.performanceMetrics.engagementScore * 100
                        ).toFixed(0)}
                        %
                      </span>
                    </div>
                    <div className='w-full bg-muted/30 rounded-full h-2'>
                      <div
                        className='bg-gradient-to-r from-accent to-secondary h-2 rounded-full transition-all'
                        style={{
                          width: `${analyticsData.performanceMetrics.engagementScore * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Projects */}
            {(analyticsData.recommendedProjects?.length ?? 0) > 0 && (
              <RecommendedProjectsSection
                projects={analyticsData.recommendedProjects || []}
              />
            )}

            {/* Insights */}
            {(analyticsData.insights?.length ?? 0) > 0 && (
              <InsightsSection insights={analyticsData.insights || []} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
