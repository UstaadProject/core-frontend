import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  Play,
  Trophy,
  Award,
} from 'lucide-react';

const humanize = (key: string) =>
  key
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  XpBar,
  StatPill,
  StreakFlame,
  levelFromXp,
} from '@/components/gamification';
import { AIAssistant } from '@/components/learning/AIAssistant';
import {
  getDashboardStats,
  updateStreak,
  type DashboardStats,
} from '@/services/api/learningApi';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

function DashboardSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="h-36 w-full animate-pulse rounded-2xl bg-muted" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-80 animate-pulse rounded-2xl bg-muted lg:col-span-2" />
          <div className="h-80 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardStats | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    (async () => {
      try {
        setLoading(true);
        await updateStreak().catch(() => {});
        setData(await getDashboardStats());
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
    })();
  }, [toast]);

  if (loading) return <DashboardSkeleton />;

  if (!data) {
    return (
      <DashboardLayout>
        <div className="grid h-[60vh] place-items-center text-center text-muted-foreground">
          <p>Unable to load dashboard. Please refresh the page.</p>
        </div>
      </DashboardLayout>
    );
  }

  const { user, gamification, stats, learningPath } = data;
  const { level } = levelFromXp(gamification.xp);
  const greeting =
    new Date().getHours() < 12
      ? 'Good morning'
      : new Date().getHours() < 18
        ? 'Good afternoon'
        : 'Good evening';

  const moduleProgress = (m: (typeof learningPath.modules)[0]) =>
    m.topicsCount === 0
      ? 0
      : Math.round((m.completedTopicsCount / m.topicsCount) * 100);

  const currentModule =
    learningPath.modules.find((m) => m.status === 'in-progress') ??
    learningPath.modules.find((m) => m.status !== 'completed');

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Hero */}
        <Card className="overflow-hidden border-none bg-gradient-to-br from-primary to-[oklch(0.5_0.12_205)] text-primary-foreground">
          <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="space-y-3">
              <p className="text-sm font-medium text-primary-foreground/80">
                {greeting},
              </p>
              <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
                {user.name?.split(' ')[0] || 'Learner'} 👋
              </h1>
              <p className="max-w-md text-sm text-primary-foreground/85">
                {currentModule
                  ? `You're on "${currentModule.title}". Keep the momentum going.`
                  : 'Your learning journey is ready. Dive in!'}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge className="border-none bg-white/15 text-primary-foreground">
                  <Sparkles className="size-3.5" /> Level {level}
                </Badge>
                <StreakFlame
                  days={gamification.streakDays}
                  className="bg-white/15 text-primary-foreground"
                />
                <Badge className="border-none bg-white/15 text-primary-foreground">
                  {learningPath.level} track
                </Badge>
              </div>
            </div>
            <div className="w-full max-w-xs rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <XpBar totalXp={gamification.xp} />
              <Button
                variant="secondary"
                className="mt-4 w-full bg-white text-primary hover:bg-white/90"
                onClick={() => navigate('/learning-path')}
              >
                <Play className="size-4" /> Continue learning
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatPill
            icon={BookOpen}
            value={stats.coursesEnrolled}
            label={`${stats.inProgress} in progress`}
            tone="primary"
          />
          <StatPill
            icon={Clock}
            value={Math.round(stats.hoursLearned)}
            label="Hours learned"
            tone="info"
          />
          <StatPill
            icon={Zap}
            value={stats.skillsMastered}
            label="Skills mastered"
            tone="xp"
          />
          <StatPill
            icon={Sparkles}
            value={gamification.xp.toLocaleString()}
            label="Total XP"
            tone="badge"
          />
        </div>

        {/* Learning path + AI */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold">Learning Path</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Your personalized{' '}
                    <span className="font-medium text-primary">
                      {learningPath.level}
                    </span>{' '}
                    journey
                  </p>
                </div>
                <Badge variant="secondary">
                  {learningPath.completedModules}/{learningPath.totalModules}{' '}
                  modules
                </Badge>
              </div>

              <div className="mb-5">
                <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>Overall progress</span>
                  <span className="tabular-nums">
                    {learningPath.totalModules === 0
                      ? 0
                      : Math.round(
                          (learningPath.completedModules /
                            learningPath.totalModules) *
                            100
                        )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    learningPath.totalModules === 0
                      ? 0
                      : (learningPath.completedModules /
                          learningPath.totalModules) *
                        100
                  }
                  tone="success"
                />
              </div>

              <div className="space-y-2.5">
                {learningPath.modules.map((m) => {
                  const status = m.status;
                  const progress = moduleProgress(m);
                  const locked = status !== 'completed' && status !== 'in-progress';
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        'flex items-center gap-4 rounded-xl border p-4 transition-colors',
                        status === 'in-progress' &&
                          'border-primary/30 bg-primary/5',
                        status === 'completed' &&
                          'border-success/25 bg-success/5',
                        locked && 'border-border bg-muted/30 opacity-70'
                      )}
                    >
                      <div className="shrink-0">
                        {status === 'completed' ? (
                          <CheckCircle2 className="size-6 text-success" />
                        ) : status === 'in-progress' ? (
                          <div className="grid size-6 place-items-center rounded-full border-2 border-primary">
                            <div className="size-2.5 rounded-full bg-primary" />
                          </div>
                        ) : (
                          <Lock className="size-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            'truncate text-sm font-semibold',
                            locked && 'text-muted-foreground'
                          )}
                        >
                          {m.title}
                        </p>
                        {status === 'in-progress' && (
                          <div className="mt-2 flex items-center gap-2">
                            <Progress value={progress} tone="primary" size="sm" />
                            <span className="w-9 text-right text-xs font-semibold tabular-nums">
                              {progress}%
                            </span>
                          </div>
                        )}
                      </div>
                      {status === 'in-progress' && (
                        <Button
                          size="sm"
                          className="shrink-0"
                          onClick={() => navigate('/learning-path')}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>

              <Button
                variant="ghost"
                className="group mt-5 px-0 text-primary hover:bg-transparent"
                onClick={() => navigate('/learning-path')}
              >
                View full learning path
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Achievements strip */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="size-5 text-badge" />
                  <h2 className="font-display text-xl font-bold">Achievements</h2>
                  {gamification.achievements.length > 0 && (
                    <Badge variant="badge">{gamification.achievements.length}</Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:bg-transparent"
                  onClick={() => navigate('/achievements')}
                >
                  View all
                  <ArrowRight className="size-4" />
                </Button>
              </div>
              {gamification.achievements.length === 0 ? (
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  <Award className="size-5 shrink-0 text-muted-foreground" />
                  Complete your first topic to earn a badge.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {gamification.achievements.slice(0, 8).map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1.5 rounded-full bg-badge/12 px-3 py-1.5 text-xs font-semibold text-badge"
                    >
                      <Award className="size-3.5" />
                      {humanize(a)}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          </div>

          <Card className="flex h-[560px] min-h-0 flex-col overflow-hidden">
            <AIAssistant />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
