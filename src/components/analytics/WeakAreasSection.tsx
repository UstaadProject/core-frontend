import { AlertTriangle, Zap } from 'lucide-react';
import type { WeakArea } from '@/services/api/analyticsApi';

interface WeakAreasSectionProps {
  weakAreas: WeakArea[];
}

export function WeakAreasSection({ weakAreas }: WeakAreasSectionProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'text-success bg-success/10 border-success/30';
      case 'intermediate':
        return 'text-warning bg-warning/10 border-warning/30';
      case 'advanced':
        return 'text-destructive bg-destructive/10 border-destructive/30';
      default:
        return 'text-primary bg-primary/10 border-primary/30';
    }
  };

  return (
    <div
      className='ui-surface-card p-6 rounded-2xl animate-slide-up'
      style={{ animationDelay: '0.2s' }}
    >
      <div className='flex items-center gap-3 mb-6'>
        <div className='p-2.5 rounded-lg bg-destructive/20'>
          <AlertTriangle className='w-5 h-5 text-destructive' />
        </div>
        <div>
          <h3 className='ui-section-title'>Areas for Improvement</h3>
          <p className='text-xs text-[hsl(var(--muted-foreground))] mt-0.5'>
            Topics where you need more practice
          </p>
        </div>
      </div>

      <div className='space-y-3'>
        {weakAreas.map((area, idx) => (
          <div
            key={idx}
            className='p-4 rounded-xl bg-muted/40 border border-muted/60 hover:border-primary/50 transition-all group cursor-pointer'
          >
            <div className='flex items-start justify-between gap-4 mb-3'>
              <div className='flex-1'>
                <h4 className='font-semibold text-[hsl(var(--foreground))] group-hover:text-primary transition-colors'>
                  {area.topic}
                </h4>
                <p className='text-xs text-[hsl(var(--muted-foreground))] mt-1'>
                  {area.module}
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${getDifficultyColor(area.difficulty)}`}
              >
                {area.difficulty}
              </span>
            </div>

            <div className='grid grid-cols-3 gap-3 pt-3 border-t border-muted/40'>
              <div>
                <p className='text-xs text-[hsl(var(--muted-foreground))] mb-1'>
                  Proficiency
                </p>
                <div className='w-full bg-muted/40 rounded-full h-2'>
                  <div
                    className='bg-gradient-to-r from-destructive to-warning h-2 rounded-full'
                    style={{ width: `${area.proficiencyLevel * 100}%` }}
                  />
                </div>
                <p className='text-xs font-semibold text-[hsl(var(--foreground))] mt-1'>
                  {(area.proficiencyLevel * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <p className='text-xs text-[hsl(var(--muted-foreground))] mb-1'>
                  Time Spent
                </p>
                <p className='text-sm font-semibold text-[hsl(var(--foreground))]'>
                  {area.hoursSpent}h
                </p>
              </div>
              <div>
                <p className='text-xs text-[hsl(var(--muted-foreground))] mb-1'>
                  Missed Questions
                </p>
                <p className='text-sm font-semibold text-destructive'>
                  {area.missedQuestions}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {weakAreas.length === 0 && (
        <div className='text-center py-8'>
          <Zap className='w-8 h-8 text-success mx-auto mb-2' />
          <p className='text-[hsl(var(--muted-foreground))]'>
            You're doing great! No weak areas detected.
          </p>
        </div>
      )}
    </div>
  );
}
