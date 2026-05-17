import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Loader2, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  buildResume,
  getResumeTemplates,
  getSubmittedProjects,
  type ResumeData,
  type ResumeTemplate,
  type SubmittedProject,
} from '@/services/api/learningApi';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ProfessionalResumeTemplate } from '@/components/resume/ProfessionalResumeTemplate';

function ResumeBuilderSkeleton() {
  return (
    <DashboardLayout>
      <div className='p-8 max-w-5xl mx-auto space-y-6'>
        <div className='skeleton skeleton-card h-20 w-2/5' />
        <div className='skeleton skeleton-card h-48' />
        <div className='skeleton skeleton-card h-[500px]' />
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

    const fetchContext = async () => {
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
          description: error instanceof Error ? error.message : 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setContextLoading(false);
      }
    };

    fetchContext();
  }, [toast]);

  useEffect(() => {
    if (!selectedTemplateId) return;

    const fetchResume = async () => {
      try {
        setLoading(true);
        const data = await buildResume({ templateId: selectedTemplateId });
        setResume(data);
      } catch (error) {
        toast({
          title: 'Failed to build resume',
          description: error instanceof Error ? error.message : 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [selectedTemplateId, toast]);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      const data = await buildResume({ regenerate: true, templateId: selectedTemplateId });
      setResume(data);
      toast({
        title: 'Resume regenerated',
        description: 'A fresh version has been generated and saved.',
      });
    } catch (error) {
      toast({
        title: 'Failed to regenerate resume',
        description: error instanceof Error ? error.message : 'Please try again later',
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
        <div className='flex items-center justify-center h-screen'>
          <p className='text-[hsl(var(--muted-foreground))]'>Could not generate resume.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className='max-w-5xl mx-auto'>
        {/* Page banner */}
        <div className='page-banner'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <div
                className='p-3 rounded-xl'
                style={{ background: 'linear-gradient(135deg, hsl(var(--primary)/0.2), hsl(var(--accent)/0.15))' }}
              >
                <FileText className='w-6 h-6 text-[hsl(var(--primary))]' />
              </div>
              <div>
                <h1 className='text-2xl font-extrabold font-display text-[hsl(var(--foreground))]'>
                  Professional Resume
                </h1>
                <p className='text-[hsl(var(--muted-foreground))] text-sm mt-0.5'>
                  AI-generated resume tailored to your profile and submitted projects
                </p>
              </div>
            </div>

            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className='flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)] transition-all hover:bg-[hsl(var(--muted)/0.3)] disabled:opacity-50'
              style={{ color: 'hsl(var(--foreground))' }}
            >
              {regenerating ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Regenerating...
                </>
              ) : (
                <>
                  <Sparkles className='w-4 h-4 text-[hsl(var(--accent))]' />
                  Regenerate
                </>
              )}
            </button>
          </div>
        </div>

        <div className='p-8 space-y-6'>
          {/* Template selector */}
          <div className='ui-surface-card p-6 rounded-2xl space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='font-bold font-display text-[hsl(var(--foreground))]'>
                Select Template
              </h3>
              <span className='pill pill-primary text-[11px]'>
                {submittedProjects.length} project{submittedProjects.length !== 1 ? 's' : ''} included
              </span>
            </div>

            {contextLoading ? (
              <div className='flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]'>
                <Loader2 className='w-4 h-4 animate-spin' />
                Loading templates...
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                {templates.map((template) => {
                  const selected = selectedTemplateId === template.id;
                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplateId(template.id)}
                      className={`rounded-xl border p-4 text-left transition-all hover:scale-[1.02] ${
                        selected
                          ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)] shadow-[0_0_16px_hsl(var(--primary)/0.15)]'
                          : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)]'
                      }`}
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <p className='font-semibold text-sm text-[hsl(var(--foreground))]'>
                          {template.name}
                        </p>
                        {selected && (
                          <CheckCircle2 className='w-4 h-4 text-[hsl(var(--primary))]' />
                        )}
                      </div>
                      <p className='text-[11px] text-[hsl(var(--muted-foreground))] leading-relaxed'>
                        {template.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Missing fields warning */}
            {resume.profileCompletion && !resume.profileCompletion.isComplete && (
              <div
                className='rounded-xl p-4 border'
                style={{
                  background: 'hsl(var(--warning)/0.08)',
                  borderColor: 'hsl(var(--warning)/0.4)',
                }}
              >
                <div className='flex items-start gap-2.5'>
                  <AlertTriangle className='w-4 h-4 text-[hsl(var(--warning))] shrink-0 mt-0.5' />
                  <div>
                    <p className='text-sm font-semibold text-[hsl(var(--foreground))]'>
                      Complete your profile for a stronger resume
                    </p>
                    <p className='text-xs text-[hsl(var(--muted-foreground))] mt-1 mb-3'>
                      Missing: {resume.profileCompletion.missingFields.map((f) => f.label).join(', ')}
                    </p>
                    <Button size='sm' variant='outline' onClick={() => navigate('/profile')}>
                      Go to Profile →
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Projects list */}
            {submittedProjects.length > 0 && (
              <div
                className='rounded-xl p-4 border'
                style={{
                  background: 'hsl(var(--success)/0.05)',
                  borderColor: 'hsl(var(--success)/0.2)',
                }}
              >
                <p className='text-sm font-semibold text-[hsl(var(--foreground))] mb-3 flex items-center gap-2'>
                  <CheckCircle2 className='w-4 h-4 text-[hsl(var(--success))]' />
                  Included Projects ({Math.min(submittedProjects.length, 5)})
                </p>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  {submittedProjects.slice(0, 5).map((project) => (
                    <div
                      key={project._id}
                      className='rounded-lg border border-[hsl(var(--border))] px-3 py-2 text-xs'
                      style={{ background: 'hsl(var(--surface))' }}
                    >
                      <p className='font-semibold text-[hsl(var(--foreground))]'>{project.title}</p>
                      <p className='text-[hsl(var(--muted-foreground))] mt-0.5'>{project.moduleId}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Resume preview */}
          <div className='mb-10'>
            <ProfessionalResumeTemplate resume={resume} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
