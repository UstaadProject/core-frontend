import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Loader2, Sparkles } from 'lucide-react';
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

  // Load templates and projects
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

  // Build resume when template changes
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
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setRegenerating(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-screen'>
          <div className='flex flex-col items-center gap-4'>
            <Loader2 className='w-8 h-8 animate-spin text-[hsl(var(--primary))]' />
            <p className='text-[hsl(var(--muted-foreground))]'>Building your professional resume...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // No resume error
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
      <div className='ui-page-shell max-w-5xl'>
        {/* Header */}
        <div className='ui-page-header flex items-start justify-between gap-4 mb-6'>
          <div>
            <h1 className='ui-page-title flex items-center gap-3'>
              <FileText className='w-8 h-8 text-[hsl(var(--primary))]' />
              Professional Resume
            </h1>
            <p className='ui-page-subtitle'>
              AI-generated resume tailored to your profile and submitted projects.
            </p>
          </div>
          <Button onClick={handleRegenerate} disabled={regenerating} variant='outline'>
            {regenerating ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Regenerating...
              </>
            ) : (
              <>
                <Sparkles className='w-4 h-4 mr-2' />
                Regenerate
              </>
            )}
          </Button>
        </div>

        {/* Template Selector */}
        <div className='ui-surface-card p-5 mb-6 space-y-4'>
          <div className='flex items-center justify-between gap-3'>
            <h3 className='ui-section-title'>Select Template</h3>
            <span className='ui-chip'>
              {submittedProjects.length} submitted project{submittedProjects.length === 1 ? '' : 's'}
            </span>
          </div>

          {contextLoading ? (
            <div className='flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]'>
              <Loader2 className='w-4 h-4 animate-spin' />
              Loading templates...
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    selectedTemplateId === template.id
                      ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)]'
                      : 'border-[hsl(var(--border))] bg-[hsl(var(--background)/0.4)] hover:border-[hsl(var(--primary)/0.5)]'
                  }`}
                >
                  <p className='font-semibold text-[hsl(var(--foreground))]'>{template.name}</p>
                  <p className='text-xs text-[hsl(var(--muted-foreground))] mt-2'>{template.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* Missing Fields Warning */}
          {resume.profileCompletion && !resume.profileCompletion.isComplete && (
            <div className='rounded-lg border border-[hsl(var(--warning)/0.5)] bg-[hsl(var(--warning)/0.08)] p-4'>
              <p className='text-sm font-semibold text-[hsl(var(--foreground))]'>
                💡 Tip: Complete your profile for a stronger resume
              </p>
              <p className='text-xs text-[hsl(var(--muted-foreground))] mt-2 mb-3'>
                Missing fields: {resume.profileCompletion.missingFields.map((f) => f.label).join(', ')}
              </p>
              <Button size='sm' variant='outline' onClick={() => navigate('/profile')}>
                Go to Profile
              </Button>
            </div>
          )}

          {/* Projects Info */}
          {submittedProjects.length > 0 && (
            <div className='rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background)/0.45)] p-4'>
              <p className='text-sm font-semibold text-[hsl(var(--foreground))] mb-3'>
                ✓ Included Projects ({Math.min(submittedProjects.length, 5)})
              </p>
              <div className='space-y-2'>
                {submittedProjects.slice(0, 5).map((project) => (
                  <div key={project._id} className='rounded-md border border-[hsl(var(--border))] p-2 text-xs'>
                    <p className='font-medium text-[hsl(var(--foreground))]'>{project.title}</p>
                    <p className='text-[hsl(var(--muted-foreground))]'>{project.moduleId}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resume Preview */}
        <div className='mb-10'>
          <ProfessionalResumeTemplate resume={resume} />
        </div>
      </div>
    </DashboardLayout>
  );
}
