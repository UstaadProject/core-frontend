import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
      <div className="space-y-6">
        <div className="h-20 w-2/5 animate-pulse rounded-2xl bg-muted" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-2xl bg-muted lg:col-span-2" />
          <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </DashboardLayout>
  );
}

function PerformanceBar({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: number;
  tone: 'primary' | 'info' | 'xp';
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-muted-foreground">
          {icon}
          {label}
        </span>
        <span className="font-bold tabular-nums">{value.toFixed(1)}%</span>
      </div>
      <Progress value={value} tone={tone} size="sm" />
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
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserAnalytics();
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid analytics data received');
        }
        setAnalyticsData(data);
      } catch (error) {
        const msg =
          error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(msg);
        toast({
          title: 'Failed to load analytics',
          description: msg,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  if (loading) return <AnalyticsSkeleton />;

  if (!analyticsData || error) {
    return (
      <DashboardLayout>
        <div className="grid h-[60vh] place-items-center">
          <Card className="max-w-md text-center">
            <CardContent className="flex flex-col items-center gap-3 p-8">
              <div className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertCircle className="size-6" />
              </div>
              <p className="text-sm text-muted-foreground">
                {error ?? 'Unable to load analytics. Please refresh the page.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <TrendingUp className="size-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
              Learning Analytics
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Deep insights into your progress and personalized recommendations.
            </p>
          </div>
        </div>

        {analyticsData.performanceMetrics && analyticsData.overview && (
          <PerformanceOverview data={analyticsData} />
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {(analyticsData.weakAreas?.length ?? 0) > 0 && (
              <WeakAreasSection weakAreas={analyticsData.weakAreas || []} />
            )}
            {(analyticsData.recommendedTopics?.length ?? 0) > 0 && (
              <RecommendedTopicsSection
                topics={analyticsData.recommendedTopics || []}
              />
            )}
          </div>

          <div className="space-y-6">
            {(analyticsData.strengths?.length ?? 0) > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-lg bg-success/12 text-success">
                      <Zap className="size-5" />
                    </div>
                    <h3 className="font-display font-bold">Your Strengths</h3>
                  </div>
                  <div className="space-y-2">
                    {(analyticsData.strengths || []).map((strength, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 rounded-lg border border-success/20 bg-success/[0.06] p-2.5"
                      >
                        <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" />
                        <p className="text-sm">{strength}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-lg bg-info/12 text-info">
                    <Brain className="size-5" />
                  </div>
                  <h3 className="font-display font-bold">Performance</h3>
                </div>
                <div className="space-y-4">
                  <PerformanceBar
                    label="Quiz Score"
                    value={analyticsData.performanceMetrics.averageQuizScore}
                    tone="primary"
                    icon={<Target className="size-3.5" />}
                  />
                  <PerformanceBar
                    label="Completion Rate"
                    value={analyticsData.performanceMetrics.completionRate * 100}
                    tone="xp"
                    icon={<BookOpen className="size-3.5" />}
                  />
                  <PerformanceBar
                    label="Engagement"
                    value={analyticsData.performanceMetrics.engagementScore * 100}
                    tone="info"
                    icon={<Zap className="size-3.5" />}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {(analyticsData.recommendedProjects?.length ?? 0) > 0 && (
          <RecommendedProjectsSection
            projects={analyticsData.recommendedProjects || []}
          />
        )}

        {(analyticsData.insights?.length ?? 0) > 0 && (
          <InsightsSection insights={analyticsData.insights || []} />
        )}
      </div>
    </DashboardLayout>
  );
}
