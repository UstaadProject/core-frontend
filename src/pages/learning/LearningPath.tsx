import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Lock,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LearningLayout } from '@/components/layout/LearningLayout';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'locked';
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  status: 'completed' | 'in-progress' | 'locked';
}

const learningPathData: Module[] = [
  {
    id: '1',
    title: 'HTML & CSS Fundamentals',
    description: 'Master the building blocks of the web',
    status: 'completed',
    lessons: [
      {
        id: '1-1',
        title: 'Introduction to HTML and CSS',
        duration: '15 min',
        status: 'completed',
      },
      {
        id: '1-2',
        title: 'Elements and Tags',
        duration: '20 min',
        status: 'completed',
      },
      {
        id: '1-3',
        title: 'HTML Boilerplate',
        duration: '10 min',
        status: 'completed',
      },
      {
        id: '1-4',
        title: 'Working with Text',
        duration: '25 min',
        status: 'completed',
      },
      {
        id: '1-5',
        title: 'Lists and Links',
        duration: '20 min',
        status: 'completed',
      },
    ],
  },
  {
    id: '2',
    title: 'JavaScript Essentials',
    description: 'Learn the language of the web',
    status: 'completed',
    lessons: [
      {
        id: '2-1',
        title: 'Introduction to JavaScript',
        duration: '20 min',
        status: 'completed',
      },
      {
        id: '2-2',
        title: 'Variables and Data Types',
        duration: '30 min',
        status: 'completed',
      },
      {
        id: '2-3',
        title: 'Functions and Scope',
        duration: '35 min',
        status: 'completed',
      },
      {
        id: '2-4',
        title: 'DOM Manipulation',
        duration: '40 min',
        status: 'completed',
      },
    ],
  },
  {
    id: '3',
    title: 'React Foundations',
    description: 'Build modern user interfaces',
    status: 'in-progress',
    lessons: [
      {
        id: '3-1',
        title: 'Introduction to React',
        duration: '25 min',
        status: 'completed',
      },
      {
        id: '3-2',
        title: 'Components and Props',
        duration: '30 min',
        status: 'completed',
      },
      {
        id: '3-3',
        title: 'State and Hooks',
        duration: '40 min',
        status: 'in-progress',
      },
      {
        id: '3-4',
        title: 'Event Handling',
        duration: '25 min',
        status: 'locked',
      },
      {
        id: '3-5',
        title: 'Conditional Rendering',
        duration: '20 min',
        status: 'locked',
      },
    ],
  },
  {
    id: '4',
    title: 'Building Your Portfolio',
    description: 'Showcase your skills professionally',
    status: 'locked',
    lessons: [
      {
        id: '4-1',
        title: 'Portfolio Planning',
        duration: '20 min',
        status: 'locked',
      },
      {
        id: '4-2',
        title: 'Project Selection',
        duration: '15 min',
        status: 'locked',
      },
      {
        id: '4-3',
        title: 'Design Principles',
        duration: '30 min',
        status: 'locked',
      },
      {
        id: '4-4',
        title: 'Deployment Basics',
        duration: '25 min',
        status: 'locked',
      },
    ],
  },
  {
    id: '5',
    title: 'Freelance Client Skills',
    description: 'Turn your skills into income',
    status: 'locked',
    lessons: [
      {
        id: '5-1',
        title: 'Finding Clients',
        duration: '25 min',
        status: 'locked',
      },
      {
        id: '5-2',
        title: 'Pricing Your Work',
        duration: '20 min',
        status: 'locked',
      },
      {
        id: '5-3',
        title: 'Client Communication',
        duration: '30 min',
        status: 'locked',
      },
    ],
  },
];

function ModuleCard({ module, index }: { module: Module; index: number }) {
  const [isExpanded, setIsExpanded] = useState(module.status === 'in-progress');
  const navigate = useNavigate();

  const completedLessons = module.lessons.filter(
    (l) => l.status === 'completed'
  ).length;
  const progress = (completedLessons / module.lessons.length) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className='w-6 h-6 text-[hsl(var(--success))]' />;
      case 'in-progress':
        return (
          <div className='w-6 h-6 rounded-full border-2 border-[hsl(var(--primary))] flex items-center justify-center'>
            <div className='w-2.5 h-2.5 rounded-full bg-[hsl(var(--primary))]' />
          </div>
        );
      default:
        return <Lock className='w-5 h-5 text-[hsl(var(--muted-text))]' />;
    }
  };

  const getLessonIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className='w-4 h-4 text-[hsl(var(--success))]' />;
      case 'in-progress':
        return (
          <Circle className='w-4 h-4 text-[hsl(var(--primary))] fill-[hsl(var(--primary)/0.3)]' />
        );
      default:
        return <Circle className='w-4 h-4 text-[hsl(var(--muted-text))]' />;
    }
  };

  return (
    <div
      className={cn(
        'relative bg-[hsl(var(--card))] rounded-xl border transition-all duration-300',
        module.status === 'in-progress'
          ? 'border-[hsl(var(--primary)/0.5)] shadow-[0_0_30px_hsl(var(--primary)/0.1)]'
          : 'border-[hsl(var(--border))]',
        module.status === 'locked' && 'opacity-60'
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Module Header */}
      <button
        onClick={() => module.status !== 'locked' && setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center gap-4 p-5 text-left',
          module.status !== 'locked' && 'hover:bg-[hsl(var(--muted)/0.3)]',
          'transition-colors rounded-xl'
        )}
        disabled={module.status === 'locked'}
      >
        {/* Status & Timeline */}
        <div className='flex flex-col items-center'>
          {getStatusIcon(module.status)}
          {index < learningPathData.length - 1 && (
            <div
              className={cn(
                'w-0.5 h-8 mt-2',
                module.status === 'completed'
                  ? 'bg-[hsl(var(--success))]'
                  : 'bg-[hsl(var(--border))]'
              )}
            />
          )}
        </div>

        {/* Content */}
        <div className='flex-1 min-w-0'>
          <h3 className='font-semibold text-lg text-[hsl(var(--foreground))]'>
            {module.title}
          </h3>
          <p className='text-sm text-[hsl(var(--muted-foreground))] mt-0.5'>
            {module.description}
          </p>

          {module.status !== 'locked' && (
            <div className='flex items-center gap-4 mt-3'>
              <div className='flex-1 h-1.5 bg-[hsl(var(--muted))] rounded-full overflow-hidden'>
                <div
                  className='h-full bg-linear-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] rounded-full transition-all duration-500'
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className='text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap'>
                {completedLessons}/{module.lessons.length} lessons
              </span>
            </div>
          )}
        </div>

        {/* Expand Icon */}
        {module.status !== 'locked' && (
          <div className='text-[hsl(var(--muted-foreground))]'>
            {isExpanded ? (
              <ChevronDown className='w-5 h-5' />
            ) : (
              <ChevronRight className='w-5 h-5' />
            )}
          </div>
        )}
      </button>

      {/* Lessons List */}
      {isExpanded && module.status !== 'locked' && (
        <div className='px-5 pb-5 pl-16 stagger-children'>
          <div className='space-y-1'>
            {module.lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() =>
                  lesson.status !== 'locked' && navigate(`/lesson/${lesson.id}`)
                }
                disabled={lesson.status === 'locked'}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all',
                  lesson.status === 'locked'
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-[hsl(var(--muted)/0.5)] cursor-pointer',
                  lesson.status === 'in-progress' &&
                    'bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.3)]'
                )}
              >
                {getLessonIcon(lesson.status)}
                <BookOpen className='w-4 h-4 text-[hsl(var(--muted-foreground))]' />
                <span
                  className={cn(
                    'flex-1 text-sm',
                    lesson.status === 'completed'
                      ? 'text-[hsl(var(--muted-foreground))]'
                      : 'text-[hsl(var(--foreground))]'
                  )}
                >
                  {lesson.title}
                </span>
                <div className='flex items-center gap-1 text-xs text-[hsl(var(--muted-text))]'>
                  <Clock className='w-3 h-3' />
                  {lesson.duration}
                </div>
                {lesson.status === 'in-progress' && (
                  <span className='px-2 py-0.5 text-xs rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'>
                    Continue
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LearningPath() {
  const completedModules = learningPathData.filter(
    (m) => m.status === 'completed'
  ).length;

  return (
    <LearningLayout>
      <div className='p-8 max-w-4xl mx-auto'>
        {/* Header */}
        <div className='mb-8 animate-fade-in'>
          <h1 className='text-3xl font-bold text-[hsl(var(--foreground))]'>
            Learning Path
          </h1>
          <p className='text-[hsl(var(--muted-foreground))] mt-2'>
            Your journey to becoming a React freelancer
          </p>

          {/* Progress Overview */}
          <div className='flex items-center gap-4 mt-6 p-4 bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))]'>
            <div className='flex-1'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm text-[hsl(var(--muted-foreground))]'>
                  Overall Progress
                </span>
                <span className='text-sm font-medium text-[hsl(var(--primary))]'>
                  {completedModules} of {learningPathData.length} modules
                </span>
              </div>
              <div className='h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden'>
                <div
                  className='h-full bg-linear-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] rounded-full transition-all duration-700'
                  style={{
                    width: `${(completedModules / learningPathData.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className='space-y-4 stagger-children'>
          {learningPathData.map((module, index) => (
            <ModuleCard key={module.id} module={module} index={index} />
          ))}
        </div>
      </div>
    </LearningLayout>
  );
}
