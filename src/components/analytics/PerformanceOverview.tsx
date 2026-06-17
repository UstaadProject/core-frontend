import { BarChart3, TrendingUp, Flame, BookOpen, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { UserAnalytics } from '@/services/api/analyticsApi';

interface PerformanceOverviewProps {
  data: UserAnalytics;
}

export function PerformanceOverview({ data }: PerformanceOverviewProps) {
  const stats: {
    icon: LucideIcon;
    label: string;
    value: React.ReactNode;
    subtext: string;
    tone: string;
  }[] = [
    {
      icon: TrendingUp,
      label: 'Overall Progress',
      value: `${(data.learningProgress.overallProgress * 100).toFixed(0)}%`,
      subtext: 'of learning path',
      tone: 'bg-primary/10 text-primary',
    },
    {
      icon: Flame,
      label: 'Streak Days',
      value: data.overview.streakDays,
      subtext: 'current streak',
      tone: 'bg-streak/12 text-streak',
    },
    {
      icon: BookOpen,
      label: 'Topics Mastered',
      value: data.overview.topicsCompleted,
      subtext: 'total completed',
      tone: 'bg-xp/12 text-xp',
    },
    {
      icon: BarChart3,
      label: 'Current Level',
      value: data.overview.currentLevel,
      subtext: `${(data.overview.averageProficiency * 100).toFixed(0)}% proficiency`,
      tone: 'bg-info/12 text-info',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className="card-hover">
          <CardContent className="p-5">
            <div className={cn('mb-4 grid size-11 place-items-center rounded-xl', stat.tone)}>
              <stat.icon className="size-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <h3 className="mt-1 font-display text-3xl font-extrabold tabular-nums">
              {stat.value}
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground">{stat.subtext}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
