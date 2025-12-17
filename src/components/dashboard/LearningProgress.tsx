import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const modules = [
  {
    id: 1,
    title: 'HTML & CSS Fundamentals',
    status: 'completed',
    progress: 100,
  },
  { id: 2, title: 'JavaScript Essentials', status: 'completed', progress: 100 },
  { id: 3, title: 'React Foundations', status: 'current', progress: 65 },
  { id: 4, title: 'Building Your Portfolio', status: 'locked', progress: 0 },
  { id: 5, title: 'Freelance Client Skills', status: 'locked', progress: 0 },
];

export function LearningProgress() {
  // Calculate progress line height dynamically
  const completedCount = modules.filter((m) => m.status === 'completed').length;
  const currentIndex = modules.findIndex((m) => m.status === 'current');
  const currentModule = modules.find((m) => m.status === 'current');

  // Calculate the percentage based on completed modules position
  const totalModules = modules.length;
  const progressPercentage =
    currentIndex >= 0
      ? (currentIndex / (totalModules - 1)) * 100 +
        (currentModule?.progress || 0) / (totalModules - 1)
      : (completedCount / (totalModules - 1)) * 100;

  return (
    <div className='p-6 rounded-xl bg-card border border-border'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-lg font-display font-semibold text-foreground'>
            Learning Path
          </h3>
          <p className='text-sm text-muted-foreground'>
            Your journey to becoming a React freelancer
          </p>
        </div>
        <span className='text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full'>
          {completedCount + (currentModule ? 1 : 0)} of {totalModules} modules
        </span>
      </div>

      <div className='relative'>
        {/* Progress line background */}
        <div className='absolute left-[15px] top-4 bottom-4 w-0.5 bg-border' />
        {/* Progress line filled */}
        <div
          className='absolute left-[15px] top-4 w-0.5 gradient-primary rounded-full transition-all duration-500'
          style={{ height: `${Math.min(progressPercentage, 100)}%` }}
        />

        <div className='space-y-1'>
          {modules.map((module, index) => (
            <div
              key={module.id}
              className={cn(
                'relative flex items-center gap-4 p-4 rounded-lg transition-all duration-300',
                module.status === 'current' &&
                  'bg-primary/5 border border-primary/20',
                module.status === 'completed' && 'hover:bg-surface-elevated',
                module.status === 'locked' && 'opacity-50'
              )}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Status icon */}
              <div className='relative z-10 flex-shrink-0'>
                {module.status === 'completed' && (
                  <CheckCircle2 className='w-8 h-8 text-success' />
                )}
                {module.status === 'current' && (
                  <div className='w-8 h-8 rounded-full gradient-primary flex items-center justify-center animate-pulse-glow'>
                    <Circle className='w-4 h-4 text-primary-foreground fill-current' />
                  </div>
                )}
                {module.status === 'locked' && (
                  <div className='w-8 h-8 rounded-full bg-muted flex items-center justify-center'>
                    <Lock className='w-4 h-4 text-muted-foreground' />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className='flex-1 min-w-0'>
                <h4
                  className={cn(
                    'font-medium text-sm',
                    module.status === 'locked'
                      ? 'text-muted-foreground'
                      : 'text-foreground'
                  )}
                >
                  {module.title}
                </h4>
                {module.status === 'current' && (
                  <div className='mt-2'>
                    <div className='flex items-center justify-between text-xs mb-1'>
                      <span className='text-muted-foreground'>Progress</span>
                      <span className='text-primary font-medium'>
                        {module.progress}%
                      </span>
                    </div>
                    <div className='h-1.5 bg-muted rounded-full overflow-hidden'>
                      <div
                        className='h-full gradient-primary rounded-full transition-all duration-500'
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action */}
              {module.status === 'current' && (
                <button className='px-4 py-1.5 text-xs font-medium rounded-lg gradient-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-primary'>
                  Continue
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
