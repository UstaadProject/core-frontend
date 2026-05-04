import { Layers, ExternalLink } from 'lucide-react';
import type { RecommendedProject } from '@/services/api/analyticsApi';

interface RecommendedProjectsSectionProps {
  projects: RecommendedProject[];
}

export function RecommendedProjectsSection({
  projects,
}: RecommendedProjectsSectionProps) {
  return (
    <div
      className='ui-surface-card p-6 rounded-2xl animate-slide-up'
      style={{ animationDelay: '0.4s' }}
    >
      <div className='flex items-center gap-3 mb-6'>
        <div className='p-2.5 rounded-lg bg-accent/20'>
          <Layers className='w-5 h-5 text-accent' />
        </div>
        <div>
          <h3 className='ui-section-title'>Recommended Projects</h3>
          <p className='text-xs text-[hsl(var(--muted-foreground))] mt-0.5'>
            Hands-on projects to apply your knowledge
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {projects.map((project, idx) => (
          <div
            key={idx}
            className='p-5 rounded-xl border border-border/60 bg-gradient-to-br from-accent/5 to-primary/5 hover:border-accent/50 transition-all group cursor-pointer'
          >
            <div className='mb-3'>
              <h4 className='font-semibold text-[hsl(var(--foreground))] group-hover:text-accent transition-colors line-clamp-2'>
                {project.title}
              </h4>
            </div>

            <p className='text-xs text-[hsl(var(--muted-foreground))] line-clamp-2 mb-3'>
              {project.description}
            </p>

            <div className='mb-3 space-y-2'>
              <p className='text-xs text-[hsl(var(--muted-foreground))]'>
                <span className='font-semibold'>Why:</span> {project.reason}
              </p>
            </div>

            <div className='flex flex-wrap gap-1.5 mb-4'>
              {project.relevantSkills.slice(0, 3).map((skill, i) => (
                <span
                  key={i}
                  className='px-2 py-1 rounded text-xs font-medium bg-primary/20 text-primary'
                >
                  {skill}
                </span>
              ))}
              {project.relevantSkills.length > 3 && (
                <span className='px-2 py-1 rounded text-xs font-medium bg-muted/50 text-[hsl(var(--muted-foreground))]'>
                  +{project.relevantSkills.length - 3} more
                </span>
              )}
            </div>

            <div className='flex items-center justify-between pt-3 border-t border-border/30'>
              <div className='flex items-center gap-2'>
                <span className='text-xs font-medium text-[hsl(var(--muted-foreground))]'>
                  {project.difficulty}
                </span>
                <span className='text-xs text-[hsl(var(--muted-foreground))]'>
                  • {project.estimatedDuration}h
                </span>
              </div>
              <button className='p-1.5 rounded-lg hover:bg-accent/20 transition-colors'>
                <ExternalLink className='w-4 h-4 text-accent' />
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className='text-center py-8'>
          <Layers className='w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50' />
          <p className='text-[hsl(var(--muted-foreground))]'>
            No projects to recommend yet.
          </p>
        </div>
      )}
    </div>
  );
}
