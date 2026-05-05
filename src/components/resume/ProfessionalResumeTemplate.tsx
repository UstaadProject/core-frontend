import { useRef } from 'react';
import { Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2pdf from 'html2pdf.js';
import type { ResumeData } from '@/services/api/learningApi';

interface ProfessionalResumeTemplateProps {
  resume: ResumeData;
}

export function ProfessionalResumeTemplate({
  resume,
}: ProfessionalResumeTemplateProps) {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (!resumeRef.current) return;

    const element = resumeRef.current;
    const opt: any = {
      margin: 10,
      filename: `${resume.profile.name.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).save();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='space-y-4'>
      {/* Action Buttons */}
      <div className='flex gap-3 no-print'>
        <Button
          onClick={handleDownloadPDF}
          variant='default'
          className='flex items-center gap-2'
        >
          <Download className='w-4 h-4' />
          Download PDF
        </Button>
        <Button
          onClick={handlePrint}
          variant='outline'
          className='flex items-center gap-2'
        >
          <Printer className='w-4 h-4' />
          Print
        </Button>
      </div>

      {/* Resume Container */}
      <div
        ref={resumeRef}
        className='bg-white text-black p-8 rounded-lg shadow-lg max-w-4xl'
        style={{ fontSize: '11px', lineHeight: '1.4' }}
      >
        {/* Header Section */}
        <div className='border-b-2 border-gray-800 pb-4 mb-6'>
          <h1 className='text-3xl font-bold mb-1'>{resume.profile.name}</h1>
          <div className='flex flex-wrap gap-4 text-xs text-gray-700'>
            {resume.profile.email && <span>{resume.profile.email}</span>}
            <span>•</span>
            <span>Level: {resume.profile.level}</span>
          </div>
        </div>

        {/* Professional Summary */}
        {resume.summary && (
          <section className='mb-6'>
            <h2 className='text-sm font-bold uppercase tracking-wide mb-2 border-b border-gray-300 pb-1'>
              Professional Summary
            </h2>
            <p className='text-xs leading-relaxed text-gray-700'>
              {resume.summary.replace(/[#*`]/g, '').trim()}
            </p>
          </section>
        )}

        {/* Goals */}
        {resume.profile.goals && (
          <section className='mb-6'>
            <h2 className='text-sm font-bold uppercase tracking-wide mb-2 border-b border-gray-300 pb-1'>
              Career Goals
            </h2>
            <p className='text-xs leading-relaxed text-gray-700'>
              {resume.profile.goals}
            </p>
          </section>
        )}

        {/* Skills */}
        {resume.profile.skills && resume.profile.skills.length > 0 && (
          <section className='mb-6'>
            <h2 className='text-sm font-bold uppercase tracking-wide mb-2 border-b border-gray-300 pb-1'>
              Technical Skills
            </h2>
            <div className='flex flex-wrap gap-2'>
              {resume.profile.skills.map((skill) => (
                <span
                  key={skill}
                  className='inline-block px-2 py-1 text-xs border border-gray-400 rounded bg-gray-100'
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <section className='mb-6'>
            <h2 className='text-sm font-bold uppercase tracking-wide mb-2 border-b border-gray-300 pb-1'>
              Projects
            </h2>
            {resume.projects.map((project, idx) => (
              <div key={idx} className='mb-4'>
                <div className='flex justify-between items-start mb-1'>
                  <p className='font-semibold text-xs'>{project.title}</p>
                </div>
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <p className='text-xs text-gray-600 mb-2'>
                    {project.tech_stack.join(', ')}
                  </p>
                )}
                {project.bullet_points && project.bullet_points.length > 0 && (
                  <ul className='list-disc list-inside ml-2 text-xs text-gray-700'>
                    {project.bullet_points.map((point, pidx) => (
                      <li key={pidx}>{point.replace(/^[-•]\s+/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Achievements */}
        {resume.achievements && resume.achievements.length > 0 && (
          <section>
            <h2 className='text-sm font-bold uppercase tracking-wide mb-2 border-b border-gray-300 pb-1'>
              Key Achievements
            </h2>
            <ul className='list-disc list-inside ml-2 text-xs text-gray-700'>
              {resume.achievements.map((achievement, idx) => (
                <li key={idx} className='mb-1'>
                  {achievement.replace(/^[-•]\s+/, '')}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          .no-print {
            display: none !important;
          }
          .bg-white {
            box-shadow: none;
            border: none;
            page-break-inside: avoid;
          }
          section {
            page-break-inside: avoid;
          }
        }

        @page {
          size: A4;
          margin: 0.5in;
        }
      `}</style>
    </div>
  );
}
