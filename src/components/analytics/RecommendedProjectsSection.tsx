import { Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RecommendedProject } from '@/services/api/analyticsApi';

interface RecommendedProjectsSectionProps {
  projects: RecommendedProject[];
}

export function RecommendedProjectsSection({
  projects,
}: RecommendedProjectsSectionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg bg-info/12 text-info">
            <Layers className="size-5" />
          </div>
          <div>
            <h3 className="font-display font-bold">Recommended Projects</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Hands-on projects to apply your knowledge
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="flex flex-col rounded-xl border border-border bg-muted/20 p-5 transition-colors hover:border-primary/40"
            >
              <h4 className="line-clamp-2 font-semibold">{project.title}</h4>
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                {project.description}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Why:</span>{' '}
                {project.reason}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.relevantSkills.slice(0, 3).map((skill, i) => (
                  <Badge key={i} variant="info">
                    {skill}
                  </Badge>
                ))}
                {project.relevantSkills.length > 3 && (
                  <Badge variant="secondary">
                    +{project.relevantSkills.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="mt-auto flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="font-medium capitalize">{project.difficulty}</span>
                <span>·</span>
                <span>{project.estimatedDuration}h</span>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="py-8 text-center">
            <Layers className="mx-auto mb-2 size-8 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">
              No projects to recommend yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
