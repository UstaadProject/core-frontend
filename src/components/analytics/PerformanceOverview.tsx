import { BarChart3, TrendingUp, Flame, BookOpen } from 'lucide-react';
import type { UserAnalytics } from '@/services/api/analyticsApi';

interface PerformanceOverviewProps {
  data: UserAnalytics;
}

export function PerformanceOverview({ data }: PerformanceOverviewProps) {
  const stats = [
    {
      icon: TrendingUp,
      label: 'Overall Progress',
      value: `${(data.learningProgress.overallProgress * 100).toFixed(0)}%`,
      subtext: 'of learning path',
      color: 'from-primary to-accent',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      icon: Flame,
      label: 'Streak Days',
      value: data.overview.streakDays,
      subtext: 'current streak',
      color: 'from-secondary to-primary',
      bgColor: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
    {
      icon: BookOpen,
      label: 'Topics Mastered',
      value: data.overview.topicsCompleted,
      subtext: 'total completed',
      color: 'from-accent to-primary',
      bgColor: 'bg-accent/10',
      iconColor: 'text-accent',
    },
    {
      icon: BarChart3,
      label: 'Current Level',
      value: data.overview.currentLevel,
      subtext: `${(data.overview.averageProficiency * 100).toFixed(0)}% proficiency`,
      color: 'from-accent to-secondary',
      bgColor: 'bg-accent/10',
      iconColor: 'text-accent',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up'>
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className='ui-surface-card p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group'
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          <div className='flex items-start justify-between mb-4'>
            <div
              className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}
            >
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
          <p className='text-[hsl(var(--muted-foreground))] text-sm font-medium mb-1'>
            {stat.label}
          </p>
          <div className='flex items-baseline gap-2'>
            <h3 className='text-3xl font-bold text-[hsl(var(--foreground))]'>
              {stat.value}
            </h3>
          </div>
          <p className='text-xs text-[hsl(var(--muted-foreground))] mt-2'>
            {stat.subtext}
          </p>
        </div>
      ))}
    </div>
  );
}
