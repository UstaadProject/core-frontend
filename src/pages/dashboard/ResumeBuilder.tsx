import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Loader2, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  buildResume,
  getResumeTemplates,
  getSubmittedProjects,
  type ResumeData,
  type ResumeTemplate,
  type SubmittedProject,
} from '@/services/api/learningApi';
import { useToast } from '@/hooks/use-toast';
import { ProfessionalResumeTemplate } from '@/components/resume/ProfessionalResumeTemplate';

function ResumeBuilderSkeleton() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="h-20 w-2/5 animate-pulse rounded-2xl bg-muted" />
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
        <div className="h-[500px] animate-pulse rounded-2xl bg-muted" />
      </div>
    </DashboardLayout>
  );
}

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [contextLoading, setContextLoading] = useState(true);
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('professional');
  const [submittedProjects, setSubmittedProjects] = useState<SubmittedProject[]>([]);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const { toast } = useToast();
  const hasFetchedContextRef = useRef(false);

  useEffect(() => {
    if (hasFetchedContextRef.current) return;
    hasFetchedContextRef.current = true;
    (async () => {
      try {
        setContextLoading(true);
        const [templateData, projectData] = await Promise.all([
          getResumeTemplates(),
          getSubmittedProjects(),
        ]);
        setTemplates(templateData.templates || []);
        setSubmittedProjects(projectData || []);
        if (templateData.templates?.length) {
          setSelectedTemplateId(templateData.templates[0].id);
        }
      } catch (error) {
        toast({
          title: 'Failed to load resume context',
          description:
            error instanceof Error ? error.message : 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setContextLoading(false);
      }
    })();
  }, [toast]);

  useEffect(() => {
    if (!selectedTemplateId) return;
    (async () => {
      try {
        setLoading(true);
        setResume(await buildResume({ templateId: selectedTemplateId }));
      } catch (error) {
        toast({
          title: 'Failed to build resume',
          description:
            error instanceof Error ? error.message : 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedTemplateId, toast]);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      const data = await buildResume({
        regenerate: true,
        templateId: selectedTemplateId,
      });
      setResume(data);
      toast({
        title: 'Resume regenerated',
        description: 'A fresh version has been generated and saved.',
      });
    } catch (error) {
      toast({
        title: 'Failed to regenerate resume',
        description:
          error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) return <ResumeBuilderSkeleton />;

  if (!resume) {
    return (
      <DashboardLayout>
        <div className="grid h-[60vh] place-items-center text-muted-foreground">
          <p>Could not generate resume.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="size-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
                Professional Resume
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                AI-generated from your profile and submitted projects.
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleRegenerate} disabled={regenerating}>
            {regenerating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Regenerating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Regenerate
              </>
            )}
          </Button>
        </div>

        {/* Template selector */}
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold">Select Template</h3>
              <Badge variant="secondary">
                {submittedProjects.length} project
                {submittedProjects.length !== 1 ? 's' : ''} included
              </Badge>
            </div>

            {contextLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading templates…
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {templates.map((template) => {
                  const selected = selectedTemplateId === template.id;
                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplateId(template.id)}
                      className={cn(
                        'rounded-xl border p-4 text-left transition-all',
                        selected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border hover:border-primary/40 hover:bg-accent/40'
                      )}
                    >
                      <div className="mb-1.5 flex items-center justify-between">
                        <p className="text-sm font-semibold">{template.name}</p>
                        {selected && <CheckCircle2 className="size-4 text-primary" />}
                      </div>
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        {template.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {resume.profileCompletion && !resume.profileCompletion.isComplete && (
              <div className="rounded-xl border border-streak/40 bg-streak/10 p-4">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-streak" />
                  <div>
                    <p className="text-sm font-semibold">
                      Complete your profile for a stronger resume
                    </p>
                    <p className="mb-3 mt-1 text-xs text-muted-foreground">
                      Missing:{' '}
                      {resume.profileCompletion.missingFields
                        .map((f) => f.label)
                        .join(', ')}
                    </p>
                    <Button size="sm" variant="outline" onClick={() => navigate('/profile')}>
                      Go to Profile →
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {submittedProjects.length > 0 && (
              <div className="rounded-xl border border-success/20 bg-success/[0.05] p-4">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="size-4 text-success" />
                  Included Projects ({Math.min(submittedProjects.length, 5)})
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {submittedProjects.slice(0, 5).map((project) => (
                    <div
                      key={project._id}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-xs"
                    >
                      <p className="font-semibold">{project.title}</p>
                      <p className="mt-0.5 text-muted-foreground">{project.moduleId}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview */}
        <div className="mb-10">
          <ProfessionalResumeTemplate resume={resume} />
        </div>
      </div>
    </DashboardLayout>
  );
}
