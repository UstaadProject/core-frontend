import { Lightbulb, Star } from 'lucide-react';

interface InsightsSectionProps {
  insights: string[];
}

export function InsightsSection({ insights }: InsightsSectionProps) {
  return (
    <div
      className='ui-surface-card p-6 rounded-2xl animate-slide-up'
      style={{ animationDelay: '0.5s' }}
    >
      <div className='flex items-center gap-3 mb-6'>
        <div className='p-2.5 rounded-lg bg-accent/20'>
          <Star className='w-5 h-5 text-accent' />
        </div>
        <div>
          <h3 className='ui-section-title'>AI-Powered Insights</h3>
          <p className='text-xs text-[hsl(var(--muted-foreground))] mt-0.5'>
            Personalized analysis of your learning journey
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className='p-4 rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 to-transparent hover:border-accent/60 transition-all'
          >
            <div className='flex gap-3'>
              <div className='flex-shrink-0 pt-1'>
                <Lightbulb className='w-4 h-4 text-accent' />
              </div>
              <p className='text-sm text-[hsl(var(--foreground))] leading-relaxed'>
                {insight}
              </p>
            </div>
          </div>
        ))}
      </div>

      {insights.length === 0 && (
        <div className='text-center py-8'>
          <Lightbulb className='w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50' />
          <p className='text-[hsl(var(--muted-foreground))]'>
            No insights available yet. Keep learning!
          </p>
        </div>
      )}
    </div>
  );
}
