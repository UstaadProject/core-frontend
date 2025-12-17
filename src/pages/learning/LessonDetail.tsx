import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LearningLayout } from '@/components/layout/LearningLayout';
import { AIAssistant } from '@/components/learning/AIAssistant';

// Mock lesson data
const lessonData = {
  '3-3': {
    id: '3-3',
    title: 'State and Hooks',
    moduleName: 'React Foundations',
    duration: '40 min',
    sections: [
      { id: 'intro', title: 'Introduction', active: true },
      { id: 'overview', title: 'Lesson overview', active: false },
      { id: 'assignment', title: 'Assignment', active: false },
      { id: 'knowledge', title: 'Knowledge check', active: false },
      { id: 'resources', title: 'Additional resources', active: false },
    ],
    content: {
      introduction: `State is one of the most important concepts in React. It allows components to create and manage their own data, which can change over time based on user interactions or other factors.

Think of state as the "memory" of a component. Just like how you remember things that happened to you, React components can remember information between re-renders using state.`,
      overview: [
        'Understand what state is in React',
        'Learn how to use the useState hook',
        'Understand when to use state vs props',
        'Practice updating state correctly',
      ],
      assignment: [
        {
          title: 'Read the official React documentation on State',
          link: 'https://react.dev/learn/state-a-components-memory',
          description:
            'This comprehensive guide covers everything you need to know about state in React.',
        },
        {
          title: 'Watch "React Hooks Explained" video',
          link: 'https://youtube.com/watch?v=example',
          description:
            'A 15-minute video explaining hooks with practical examples.',
        },
        {
          title: 'Complete the interactive useState tutorial',
          link: 'https://react.dev/learn/updating-objects-in-state',
          description: 'Practice updating state with objects and arrays.',
        },
      ],
      knowledgeCheck: [
        'What is the difference between state and props?',
        'When should you use the useState hook?',
        'How do you update state that depends on the previous state?',
        'What happens when state changes in a React component?',
      ],
      additionalResources: [
        { title: 'React State Management Guide', link: '#' },
        { title: 'Understanding useState in Depth', link: '#' },
        { title: 'Common useState Mistakes', link: '#' },
      ],
    },
  },
};

export default function LessonDetail() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [showAI, setShowAI] = useState(true);
  const [activeSection, setActiveSection] = useState('intro');

  // Get lesson data or use default
  const lesson = lessonData[lessonId as keyof typeof lessonData] || {
    id: lessonId,
    title: 'Introduction to Git',
    moduleName: 'Git Basics',
    duration: '25 min',
    sections: [
      { id: 'intro', title: 'Introduction', active: true },
      { id: 'overview', title: 'Lesson overview', active: false },
      { id: 'assignment', title: 'Assignment', active: false },
      { id: 'knowledge', title: 'Knowledge check', active: false },
      { id: 'resources', title: 'Additional resources', active: false },
    ],
    content: {
      introduction: `Git is like a really epic save button for your files and directories. Officially, Git is a version control system.

A save in a text editor records all of the words in a document as a single file. You are only ever given one record of the file, such as essay.doc, unless you make duplicate copies (which is difficult to remember to do and keep track of):

essay-draft1.doc, essay-draft2.doc, essay-final.doc

However, a save in Git records differences in the files and folders AND keeps a historical record of each save. This feature is a game changer.`,
      overview: [
        'Explain what Git and GitHub are and the differences between the two',
        'Describe the differences between Git and a text editor in terms of what they save and their record keeping',
        'Describe why Git is useful for an individual developer and a team of developers',
      ],
      assignment: [
        {
          title:
            'Read chapters 1.1 through 1.4 from the Getting Started section of Pro Git',
          link: 'https://git-scm.com/book/en/v2',
          description:
            'Learn the differences between local, centralized, and distributed version control systems.',
        },
        {
          title: 'Watch "What is Git?" explained in 2 minutes',
          link: 'https://youtube.com/watch?v=example',
          description:
            'A video about what Git is and how it can improve the workflow of both an individual and a team of developers.',
        },
        {
          title: 'Read "About GitHub and Git"',
          link: 'https://docs.github.com',
          description:
            'A brief introduction of what GitHub is and how Git and GitHub work together.',
        },
      ],
      knowledgeCheck: [
        'What kind of program is Git?',
        'What are the differences between Git and a text editor in terms of what they save and their record keeping?',
        'Does Git work at a local or remote level?',
        'Does GitHub work at a local or remote level?',
        'Why is Git useful for developers?',
      ],
      additionalResources: [
        { title: 'Short History for Git and Github', link: '#' },
        { title: 'What is Git and GitHub?', link: '#' },
        { title: 'What is version control?', link: '#' },
      ],
    },
  };

  return (
    <LearningLayout>
      <div className='flex h-screen overflow-hidden'>
        {/* Main Content */}
        <div className='flex-1 overflow-y-auto'>
          <div className='max-w-4xl mx-auto p-8'>
            {/* Back Button & Header */}
            <div className='mb-8 animate-fade-in'>
              <button
                onClick={() => navigate('/learning-path')}
                className='flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors mb-6'
              >
                <ArrowLeft className='w-4 h-4' />
                <span className='text-sm'>Back to Learning Path</span>
              </button>

              <div className='flex items-start gap-4'>
                <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center'>
                  <BookOpen className='w-8 h-8 text-[hsl(var(--primary-foreground))]' />
                </div>
                <div>
                  <h1 className='text-2xl font-bold text-[hsl(var(--foreground))]'>
                    {lesson.title}
                  </h1>
                  <p className='text-[hsl(var(--muted-foreground))] mt-1'>
                    {lesson.moduleName}
                  </p>
                  <div className='flex items-center gap-4 mt-3'>
                    <div className='flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))]'>
                      <Clock className='w-4 h-4' />
                      {lesson.duration}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className='flex gap-8'>
              {/* Main Content */}
              <div className='flex-1 space-y-10'>
                {/* Introduction */}
                <section id='intro' className='animate-fade-in'>
                  <h2 className='text-xl font-semibold text-[hsl(var(--foreground))] mb-4'>
                    Introduction
                  </h2>
                  <div className='prose prose-invert max-w-none'>
                    <p className='text-[hsl(var(--foreground)_/_0.9)] leading-relaxed whitespace-pre-line'>
                      {lesson.content.introduction}
                    </p>
                  </div>
                </section>

                {/* Lesson Overview */}
                <section
                  id='overview'
                  className='animate-fade-in'
                  style={{ animationDelay: '0.1s' }}
                >
                  <h2 className='text-xl font-semibold text-[hsl(var(--foreground))] mb-4'>
                    Lesson overview
                  </h2>
                  <ul className='space-y-3'>
                    {lesson.content.overview.map((item, i) => (
                      <li key={i} className='flex items-start gap-3'>
                        <CheckCircle2 className='w-5 h-5 text-[hsl(var(--success))] mt-0.5 flex-shrink-0' />
                        <span className='text-[hsl(var(--foreground)_/_0.9)]'>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Assignment */}
                <section
                  id='assignment'
                  className='animate-fade-in'
                  style={{ animationDelay: '0.2s' }}
                >
                  <h2 className='text-xl font-semibold text-[hsl(var(--foreground))] mb-4'>
                    Assignment
                  </h2>
                  <div className='bg-[hsl(var(--surface))] rounded-xl border border-[hsl(var(--border))] p-6'>
                    <ol className='space-y-6'>
                      {lesson.content.assignment.map((item, i) => (
                        <li key={i} className='flex gap-4'>
                          <span className='flex-shrink-0 w-6 h-6 rounded-full bg-[hsl(var(--primary)_/_0.2)] text-[hsl(var(--primary))] flex items-center justify-center text-sm font-medium'>
                            {i + 1}
                          </span>
                          <div>
                            <a
                              href={item.link}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-[hsl(var(--primary))] hover:underline font-medium flex items-center gap-1'
                            >
                              {item.title}
                              <ExternalLink className='w-3.5 h-3.5' />
                            </a>
                            <p className='text-sm text-[hsl(var(--muted-foreground))] mt-1'>
                              {item.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </section>

                {/* Knowledge Check */}
                <section
                  id='knowledge'
                  className='animate-fade-in'
                  style={{ animationDelay: '0.3s' }}
                >
                  <h2 className='text-xl font-semibold text-[hsl(var(--foreground))] mb-4'>
                    Knowledge check
                  </h2>
                  <p className='text-[hsl(var(--muted-foreground))] mb-4'>
                    The following questions are an opportunity to reflect on key
                    topics in this lesson.
                  </p>
                  <ul className='space-y-3'>
                    {lesson.content.knowledgeCheck.map((question, i) => (
                      <li key={i}>
                        <a
                          href='#'
                          className='text-[hsl(var(--primary))] hover:underline'
                        >
                          {question}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Additional Resources */}
                <section
                  id='resources'
                  className='animate-fade-in'
                  style={{ animationDelay: '0.4s' }}
                >
                  <h2 className='text-xl font-semibold text-[hsl(var(--foreground))] mb-4'>
                    Additional resources
                  </h2>
                  <p className='text-[hsl(var(--muted-foreground))] mb-4'>
                    This section contains helpful links to related content. It
                    isn't required, so consider it supplemental.
                  </p>
                  <ul className='space-y-2'>
                    {lesson.content.additionalResources.map((resource, i) => (
                      <li key={i}>
                        <a
                          href={resource.link}
                          className='text-[hsl(var(--primary))] hover:underline flex items-center gap-1'
                        >
                          {resource.title}
                          <ExternalLink className='w-3 h-3' />
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Navigation */}
                <div className='flex items-center justify-between pt-8 border-t border-[hsl(var(--border))]'>
                  <button
                    onClick={() => navigate('/learning-path')}
                    className='flex items-center gap-2 px-4 py-2 rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors'
                  >
                    <BookOpen className='w-4 h-4' />
                    View Course
                  </button>

                  <button className='flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity font-medium'>
                    Mark Complete
                    <ChevronRight className='w-4 h-4' />
                  </button>
                </div>
              </div>

              {/* Lesson Contents Sidebar */}
              <aside className='hidden lg:block w-56 flex-shrink-0'>
                <div className='sticky top-8'>
                  <h3 className='text-sm font-semibold text-[hsl(var(--foreground))] mb-4'>
                    Lesson contents
                  </h3>
                  <nav className='space-y-1'>
                    {lesson.sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id);
                          document
                            .getElementById(section.id)
                            ?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={cn(
                          'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                          activeSection === section.id
                            ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'
                            : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)_/_0.5)]'
                        )}
                      >
                        {section.title}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* AI Assistant Panel */}
        {showAI ? (
          <div className='w-80 flex-shrink-0 hidden xl:block'>
            <AIAssistant
              lessonTitle={lesson.title}
              onClose={() => setShowAI(false)}
            />
          </div>
        ) : null}

        {/* AI Assistant Toggle Button - shows when AI is closed */}
        {!showAI && (
          <button
            onClick={() => setShowAI(true)}
            className='fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-[hsl(var(--primary-foreground))] flex items-center justify-center shadow-lg hover:scale-105 transition-transform'
          >
            <MessageSquare className='w-6 h-6' />
          </button>
        )}
      </div>
    </LearningLayout>
  );
}
