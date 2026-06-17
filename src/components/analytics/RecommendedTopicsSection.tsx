import { Target, Lightbulb, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { RecommendedTopic } from '@/services/api/analyticsApi';

interface RecommendedTopicsSectionProps {
  topics: RecommendedTopic[];
}

const priorityTone = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'text-destructive bg-destructive/10 border-destructive/30';
    case 'medium':
      return 'text-streak bg-streak/10 border-streak/30';
    case 'low':
      return 'text-success bg-success/10 border-success/30';
    default:
      return 'text-primary bg-primary/10 border-primary/30';
  }
};

export function RecommendedTopicsSection({ topics }: RecommendedTopicsSectionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg bg-primary/12 text-primary">
            <Target className="size-5" />
          </div>
          <div>
            <h3 className="font-display font-bold">Recommended Topics</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Topics tailored to boost your skills
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {topics.map((topic, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-muted/20 p-4 transition-colors hover:border-primary/40"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold">{topic.topic}</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">{topic.module}</p>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize',
                    priorityTone(topic.priority)
                  )}
                >
                  {topic.priority} priority
                </span>
              </div>

              <p className="mb-3 text-sm text-muted-foreground">{topic.reason}</p>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    {topic.estimatedTime}h
                  </span>
                  <Badge variant="secondary" className="capitalize">
                    {topic.difficulty}
                  </Badge>
                </div>
                <Button variant="soft" size="sm">
                  Start Learning
                </Button>
              </div>
            </div>
          ))}
        </div>

        {topics.length === 0 && (
          <div className="py-8 text-center">
            <Lightbulb className="mx-auto mb-2 size-8 text-primary opacity-50" />
            <p className="text-sm text-muted-foreground">
              No topics to recommend right now.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
