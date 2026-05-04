import { Target, Lightbulb, Clock } from 'lucide-react';
import type { RecommendedTopic } from '@/services/api/analyticsApi';

interface RecommendedTopicsSectionProps {
  topics: RecommendedTopic[];
}

export function RecommendedTopicsSection({
  topics,
}: RecommendedTopicsSectionProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-destructive/10 border-destructive/30 text-destructive';
      case 'medium':
        return 'bg-warning/10 border-warning/30 text-warning';
      case 'low':
        return 'bg-success/10 border-success/30 text-success';
      default:
        return 'bg-primary/10 border-primary/30 text-primary';
    }
  };

  return (
    <div
      className='ui-surface-card p-6 rounded-2xl animate-slide-up'
      style={{ animationDelay: '0.3s' }}
    >
      <div className='flex items-center gap-3 mb-6'>
        <div className='p-2.5 rounded-lg bg-primary/20'>
          <Target className='w-5 h-5 text-primary' />
        </div>
        <div>
          <h3 className='ui-section-title'>Recommended Topics</h3>
          <p className='text-xs text-[hsl(var(--muted-foreground))] mt-0.5'>
            Topics tailored to boost your skills
          </p>
        </div>
      </div>

      <div className='space-y-3'>
        {topics.map((topic, idx) => (
          <div
            key={idx}
            className='p-4 rounded-xl border border-border/50 bg-gradient-to-br from-muted/20 to-muted/5 hover:border-primary/50 transition-all group cursor-pointer'
          >
            <div className='flex items-start justify-between gap-4 mb-3'>
              <div className='flex-1'>
                <h4 className='font-semibold text-[hsl(var(--foreground))] group-hover:text-primary transition-colors'>
                  {topic.topic}
                </h4>
                <p className='text-xs text-[hsl(var(--muted-foreground))] mt-1'>
                  {topic.module}
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg border font-semibold text-xs ${getPriorityColor(topic.priority)}`}
              >
                {topic.priority} Priority
              </span>
            </div>

            <p className='text-sm text-[hsl(var(--muted-foreground))] mb-3'>
              {topic.reason}
            </p>

            <div className='flex items-center justify-between pt-3 border-t border-border/30'>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]'>
                  <Clock className='w-3.5 h-3.5' />
                  <span>{topic.estimatedTime}h</span>
                </div>
                <div className='px-2 py-1 rounded bg-muted/50 border border-border/40'>
                  <span className='text-xs font-medium text-[hsl(var(--foreground))]'>
                    {topic.difficulty}
                  </span>
                </div>
              </div>
              <button className='px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors font-semibold text-xs'>
                Start Learning
              </button>
            </div>
          </div>
        ))}
      </div>

      {topics.length === 0 && (
        <div className='text-center py-8'>
          <Lightbulb className='w-8 h-8 text-primary mx-auto mb-2 opacity-50' />
          <p className='text-[hsl(var(--muted-foreground))]'>
            No topics to recommend right now.
          </p>
        </div>
      )}
    </div>
  );
}
