import { AlertTriangle, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { WeakArea } from '@/services/api/analyticsApi';

interface WeakAreasSectionProps {
  weakAreas: WeakArea[];
}

const difficultyTone = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'text-success bg-success/10 border-success/30';
    case 'intermediate':
      return 'text-streak bg-streak/10 border-streak/30';
    case 'advanced':
      return 'text-destructive bg-destructive/10 border-destructive/30';
    default:
      return 'text-primary bg-primary/10 border-primary/30';
  }
};

export function WeakAreasSection({ weakAreas }: WeakAreasSectionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg bg-destructive/12 text-destructive">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h3 className="font-display font-bold">Areas for Improvement</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Topics where you need more practice
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {weakAreas.map((area, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:border-primary/40"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold">{area.topic}</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">{area.module}</p>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize',
                    difficultyTone(area.difficulty)
                  )}
                >
                  {area.difficulty}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-border pt-3">
                <div>
                  <p className="mb-1.5 text-xs text-muted-foreground">Proficiency</p>
                  <Progress value={area.proficiencyLevel * 100} tone="streak" size="sm" />
                  <p className="mt-1 text-xs font-semibold tabular-nums">
                    {(area.proficiencyLevel * 100).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Time Spent</p>
                  <p className="text-sm font-semibold tabular-nums">{area.hoursSpent}h</p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Missed</p>
                  <p className="text-sm font-semibold tabular-nums text-destructive">
                    {area.missedQuestions}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {weakAreas.length === 0 && (
          <div className="py-8 text-center">
            <Zap className="mx-auto mb-2 size-8 text-success" />
            <p className="text-sm text-muted-foreground">
              You're doing great! No weak areas detected.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
