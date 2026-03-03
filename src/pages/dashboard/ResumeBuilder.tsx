import { useEffect, useRef, useState } from 'react';
import { FileText, Loader2, Download, Sparkles } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { buildResume, type ResumeData } from '@/services/api/learningApi';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function ResumeBuilder() {
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const { toast } = useToast();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchResume = async () => {
      try {
        setLoading(true);
        const data = await buildResume();
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
  }, [toast]);

  const handlePrint = () => {
    window.print();
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
      <div className='p-8 max-w-4xl mx-auto'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-[hsl(var(--foreground))] flex items-center gap-3'>
              <FileText className='w-8 h-8 text-[hsl(var(--primary))]' />
              Resume Builder
            </h1>
            <p className='text-[hsl(var(--muted-foreground))] mt-2'>
              Generated from your profile, learning progress, and AI project summaries.
            </p>
          </div>
          <Button onClick={handlePrint} variant='outline'>
            <Download className='w-4 h-4 mr-2' />
            Download / Print
          </Button>
        </div>

        <div className='bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-8 space-y-8'>
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
            <p className='text-[hsl(var(--foreground))] leading-relaxed'>
              {resume.summary}
            </p>
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
                <div key={`${project.title}-${index}`} className='border border-[hsl(var(--border))] rounded-lg p-4'>
                  <h4 className='font-semibold text-[hsl(var(--foreground))] mb-2'>
                    {project.title}
                  </h4>
                  <ul className='space-y-2 mb-3'>
                    {project.bullet_points.map((point, pointIndex) => (
                      <li key={pointIndex} className='text-[hsl(var(--foreground))] text-sm'>
                        • {point}
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
                  • {achievement}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
