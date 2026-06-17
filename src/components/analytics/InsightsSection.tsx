import { Lightbulb, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface InsightsSectionProps {
  insights: string[];
}

export function InsightsSection({ insights }: InsightsSectionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg bg-primary/12 text-primary">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h3 className="font-display font-bold">AI-Powered Insights</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Personalized analysis of your learning journey
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4"
            >
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>

        {insights.length === 0 && (
          <div className="py-8 text-center">
            <Lightbulb className="mx-auto mb-2 size-8 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">
              No insights available yet. Keep learning!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
