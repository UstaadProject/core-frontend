import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Loader2, Download, Sparkles } from 'lucide-react';
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

type ContentPart =
  | { type: 'text'; value: string }
  | { type: 'code'; value: string; language?: string };

const parseContentParts = (content: string): ContentPart[] => {
  const parts: ContentPart[] = [];
  const codeRegex = /```([a-zA-Z0-9_-]+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        value: content.slice(lastIndex, match.index).trim(),
      });
    }

    parts.push({
      type: 'code',
      language: match[1],
      value: match[2].trim(),
    });

    lastIndex = codeRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      value: content.slice(lastIndex).trim(),
    });
  }

  return parts.filter((part) => part.value.length > 0);
};

const renderInlineTokens = (text: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(
        <strong key={`b-${match.index}`} className='font-semibold'>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push(
        <code
          key={`c-${match.index}`}
          className='rounded bg-[hsl(var(--background))] px-1 py-0.5 text-[0.85em] text-[hsl(var(--foreground))]'
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
};

const renderTextBlock = (text: string): ReactNode[] => {
  const lines = text.split('\n').filter((line) => line.trim().length > 0);

  return lines.map((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('### ')) {
      return (
        <h4 key={index} className='text-base font-semibold mt-2 mb-1'>
          {renderInlineTokens(trimmed.replace('### ', ''))}
        </h4>
      );
    }

    if (trimmed.startsWith('## ')) {
      return (
        <h3 key={index} className='text-lg font-semibold mt-2 mb-1'>
          {renderInlineTokens(trimmed.replace('## ', ''))}
        </h3>
      );
    }

    if (trimmed.startsWith('# ')) {
      return (
        <h2 key={index} className='text-xl font-bold mt-2 mb-1'>
          {renderInlineTokens(trimmed.replace('# ', ''))}
        </h2>
      );
    }

    if (/^[-*]\s+/.test(trimmed)) {
      return (
        <div key={index} className='flex items-start gap-2 my-1'>
          <span>•</span>
          <span>{renderInlineTokens(trimmed.replace(/^[-*]\s+/, ''))}</span>
        </div>
      );
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      return (
        <p key={index} className='my-1 whitespace-pre-wrap leading-relaxed'>
          {renderInlineTokens(trimmed)}
        </p>
      );
    }

    return (
      <p key={index} className='my-1 whitespace-pre-wrap leading-relaxed'>
        {renderInlineTokens(trimmed)}
      </p>
    );
  });
};

function RichTextContent({ content }: { content: string }) {
  const parts = parseContentParts(content);

  return (
    <div className='space-y-2'>
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <div key={index} className='my-2'>
              {part.language && (
                <div className='text-[10px] uppercase tracking-wide text-[hsl(var(--muted-foreground))] mb-1'>
                  {part.language}
                </div>
              )}
              <pre className='overflow-x-auto rounded-lg bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-3 text-sm'>
                <code>{part.value}</code>
              </pre>
            </div>
          );
        }

        return <div key={index}>{renderTextBlock(part.value)}</div>;
      })}
    </div>
  );
}

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [contextLoading, setContextLoading] = useState(true);
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('modern-tech');
  const [submittedProjects, setSubmittedProjects] = useState<SubmittedProject[]>(
    []
  );
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
          description:
            error instanceof Error ? error.message : 'Please try again later',
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
          description:
            error instanceof Error ? error.message : 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [selectedTemplateId, toast]);

  const handlePrint = () => {
    window.print();
  };

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-screen'>
          <div className='flex flex-col items-center gap-4'>
            <Loader2 className='w-8 h-8 animate-spin text-[hsl(var(--primary))]' />
            <p className='text-[hsl(var(--muted-foreground))]'>
              Building your AI-powered resume...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!resume) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-screen'>
          <p className='text-[hsl(var(--muted-foreground))]'>
            Could not generate resume.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className='ui-page-shell max-w-4xl'>
        <div className='ui-page-header flex items-start justify-between gap-4'>
          <div>
            <h1 className='ui-page-title flex items-center gap-3'>
              <FileText className='w-8 h-8 text-[hsl(var(--primary))]' />
              Resume Builder
            </h1>
            <p className='ui-page-subtitle'>
              Generated from your profile and submitted project work, using your
              selected template.
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              onClick={handleRegenerate}
              variant='outline'
              disabled={regenerating}
            >
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
            <Button onClick={handlePrint} variant='outline'>
              <Download className='w-4 h-4 mr-2' />
              Download / Print
            </Button>
          </div>
        </div>

        <div className='ui-surface-card p-5 mb-6 space-y-4'>
          <div className='flex items-center justify-between gap-3'>
            <h3 className='ui-section-title'>Resume Template</h3>
            <span className='ui-chip'>
              {submittedProjects.length} submitted project
              {submittedProjects.length === 1 ? '' : 's'}
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
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    selectedTemplateId === template.id
                      ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)]'
                      : 'border-[hsl(var(--border))] bg-[hsl(var(--background)/0.4)] hover:border-[hsl(var(--primary)/0.5)]'
                  }`}
                >
                  <p className='font-medium text-[hsl(var(--foreground))]'>
                    {template.name}
                  </p>
                  <p className='text-xs text-[hsl(var(--muted-foreground))] mt-1'>
                    {template.description}
                  </p>
                </button>
              ))}
            </div>
          )}

          {resume.profileCompletion && !resume.profileCompletion.isComplete && (
            <div className='rounded-lg border border-[hsl(var(--warning)/0.5)] bg-[hsl(var(--warning)/0.08)] p-4'>
              <p className='text-sm font-medium text-[hsl(var(--foreground))]'>
                Complete your profile for a stronger resume
              </p>
              <p className='text-xs text-[hsl(var(--muted-foreground))] mt-1'>
                Missing fields for this template:
              </p>
              <div className='flex flex-wrap gap-2 mt-2'>
                {resume.profileCompletion.missingFields.map((item) => (
                  <span key={item.field} className='ui-chip'>
                    {item.label}
                  </span>
                ))}
              </div>
              <Button
                variant='outline'
                className='mt-3'
                onClick={() => navigate('/profile')}
              >
                Go to Profile
              </Button>
            </div>
          )}

          {submittedProjects.length === 0 && (
            <div className='rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background)/0.45)] p-4 text-sm text-[hsl(var(--muted-foreground))]'>
              No submitted projects yet. Submit a mini project from lesson detail
              pages to include real project work in your resume.
            </div>
          )}

          {submittedProjects.length > 0 && (
            <div className='rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background)/0.45)] p-4'>
              <p className='text-sm font-medium text-[hsl(var(--foreground))] mb-2'>
                Included Submitted Projects
              </p>
              <div className='space-y-2'>
                {submittedProjects.slice(0, 5).map((project) => (
                  <div
                    key={project._id}
                    className='rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background)/0.6)] p-2'
                  >
                    <p className='text-sm font-medium text-[hsl(var(--foreground))]'>
                      {project.title}
                    </p>
                    <p className='text-xs text-[hsl(var(--muted-foreground))]'>
                      {project.moduleId} • {project.topic}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='ui-surface-card p-8 space-y-8'>
          <div className='border-b border-[hsl(var(--border))] pb-6'>
            <h2 className='text-2xl font-bold text-[hsl(var(--foreground))]'>
              {resume.profile.name}
            </h2>
            <p className='text-[hsl(var(--muted-foreground))] mt-1'>
              {resume.profile.email}
            </p>
            <p className='text-[hsl(var(--muted-foreground))] mt-1'>
              Level: {resume.profile.level}
            </p>
          </div>

          <section>
            <h3 className='text-lg font-semibold text-[hsl(var(--foreground))] mb-3 flex items-center gap-2'>
              <Sparkles className='w-5 h-5 text-[hsl(var(--primary))]' />
              Professional Summary
            </h3>
            <div className='text-[hsl(var(--foreground))] leading-relaxed'>
              <RichTextContent content={resume.summary} />
            </div>
          </section>

          <section>
            <h3 className='text-lg font-semibold text-[hsl(var(--foreground))] mb-3'>
              Skills
            </h3>
            <div className='flex flex-wrap gap-2'>
              {resume.profile.skills.map((skill) => (
                <span
                  key={skill}
                  className='px-3 py-1 text-sm rounded-full bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]'
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className='text-lg font-semibold text-[hsl(var(--foreground))] mb-4'>
              Projects
            </h3>
            <div className='space-y-5'>
              {resume.projects.map((project, index) => (
                <div
                  key={`${project.title}-${index}`}
                  className='rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background)/0.45)] p-4'
                >
                  <h4 className='font-semibold text-[hsl(var(--foreground))] mb-2'>
                    {project.title}
                  </h4>
                  <ul className='space-y-2 mb-3'>
                    {project.bullet_points.map((point, pointIndex) => (
                      <li
                        key={pointIndex}
                        className='text-[hsl(var(--foreground))] text-sm'
                      >
                        <RichTextContent content={point} />
                      </li>
                    ))}
                  </ul>
                  <div className='flex flex-wrap gap-2'>
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className='px-2 py-0.5 text-xs rounded bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className='text-lg font-semibold text-[hsl(var(--foreground))] mb-3'>
              Achievements
            </h3>
            <ul className='space-y-2'>
              {resume.achievements.map((achievement, index) => (
                <li key={index} className='text-[hsl(var(--foreground))]'>
                  <RichTextContent content={achievement} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
