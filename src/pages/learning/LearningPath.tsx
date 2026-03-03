import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Lock,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LearningLayout } from '@/components/layout/LearningLayout';
import {
  getLearningPath,
  submitLearningFeedbackAndReplan,
  type FullLearningPath,
  type FullModule,
} from '@/services/api/learningApi';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface ModuleCardProps {
  module: FullModule;
  index: number;
  totalModules: number;
}

function ModuleCard({ module, index, totalModules }: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(module.status === 'in-progress');
  const navigate = useNavigate();

  const completedTopics = module.completedTopics?.length || 0;
  const totalTopics = module.topics?.length || 0;
  const progress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  const getTopicStatus = (topic: string) => {
    if (module.completedTopics?.includes(topic)) return 'completed';
    if (module.status === 'pending') return 'locked';
    // First incomplete topic in an in-progress module
    const firstIncomplete = module.topics.find(
      (t) => !module.completedTopics?.includes(t)
    );
    if (topic === firstIncomplete && module.status === 'in-progress')
      return 'in-progress';
    // Check if previous topics are complete
    const topicIndex = module.topics.indexOf(topic);
    const previousTopics = module.topics.slice(0, topicIndex);
    const allPreviousComplete = previousTopics.every((t) =>
      module.completedTopics?.includes(t)
    );
    return allPreviousComplete && module.status === 'in-progress'
      ? 'available'
      : 'locked';
  };

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

  const getTopicIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className='w-4 h-4 text-[hsl(var(--success))]' />;
      case 'in-progress':
        return (
          <Circle className='w-4 h-4 text-[hsl(var(--primary))] fill-[hsl(var(--primary)/0.3)]' />
        );
      case 'available':
        return <Circle className='w-4 h-4 text-[hsl(var(--primary))]' />;
      default:
        return <Circle className='w-4 h-4 text-[hsl(var(--muted-text))]' />;
    }
  };

  const handleTopicClick = (topic: string, status: string) => {
    if (status === 'locked') return;
    // Navigate to topic/lesson page with module and topic info
    navigate(`/lesson/${module.id}/${encodeURIComponent(topic)}`);
  };

  return (
    <div
      className={cn(
        'relative bg-[hsl(var(--card))] rounded-xl border transition-all duration-300',
        module.status === 'in-progress'
          ? 'border-[hsl(var(--primary)/0.5)] shadow-[0_0_30px_hsl(var(--primary)/0.1)]'
          : 'border-[hsl(var(--border))]',
        module.status === 'pending' && 'opacity-60'
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Module Header */}
      <button
        onClick={() =>
          module.status !== 'pending' && setIsExpanded(!isExpanded)
        }
        className={cn(
          'w-full flex items-center gap-4 p-5 text-left',
          module.status !== 'pending' && 'hover:bg-[hsl(var(--muted)/0.3)]',
          'transition-colors rounded-xl'
        )}
        disabled={module.status === 'pending'}
      >
        {/* Status & Timeline */}
        <div className='flex flex-col items-center'>
          {getStatusIcon(module.status)}
          {index < totalModules - 1 && (
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
            {module.difficulty} • {totalTopics} topics
          </p>

          {module.status !== 'pending' && (
            <div className='flex items-center gap-4 mt-3'>
              <div className='flex-1 h-1.5 bg-[hsl(var(--muted))] rounded-full overflow-hidden'>
                <div
                  className='h-full bg-linear-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] rounded-full transition-all duration-500'
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className='text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap'>
                {completedTopics}/{totalTopics} topics
              </span>
            </div>
          )}
        </div>

        {/* Expand Icon */}
        {module.status !== 'pending' && (
          <div className='text-[hsl(var(--muted-foreground))]'>
            {isExpanded ? (
              <ChevronDown className='w-5 h-5' />
            ) : (
              <ChevronRight className='w-5 h-5' />
            )}
          </div>
        )}
      </button>

      {/* Topics List */}
      {isExpanded && module.status !== 'pending' && (
        <div className='px-5 pb-5 pl-16 stagger-children'>
          <div className='space-y-1'>
            {module.topics.map((topic) => {
              const topicStatus = getTopicStatus(topic);
              return (
                <button
                  key={topic}
                  onClick={() => handleTopicClick(topic, topicStatus)}
                  disabled={topicStatus === 'locked'}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all',
                    topicStatus === 'locked'
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-[hsl(var(--muted)/0.5)] cursor-pointer',
                    topicStatus === 'in-progress' &&
                      'bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.3)]'
                  )}
                >
                  {getTopicIcon(topicStatus)}
                  <BookOpen className='w-4 h-4 text-[hsl(var(--muted-foreground))]' />
                  <span
                    className={cn(
                      'flex-1 text-sm',
                      topicStatus === 'completed'
                        ? 'text-[hsl(var(--muted-foreground))]'
                        : 'text-[hsl(var(--foreground))]'
                    )}
                  >
                    {topic}
                  </span>
                  {topicStatus === 'in-progress' && (
                    <span className='px-2 py-0.5 text-xs rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'>
                      Continue
                    </span>
                  )}
                  {topicStatus === 'available' && (
                    <span className='px-2 py-0.5 text-xs rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'>
                      Start
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LearningPath() {
  const [loading, setLoading] = useState(true);
  const [isReplanning, setIsReplanning] = useState(false);
  const [learningData, setLearningData] = useState<FullLearningPath | null>(
    null
  );
  const { toast } = useToast();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchLearningPath = async () => {
      try {
        setLoading(true);
        const data = await getLearningPath();
        setLearningData(data);
      } catch (error) {
        toast({
          title: 'Failed to load learning path',
          description:
            error instanceof Error ? error.message : 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, [toast]);

  const handleFeedback = async (
    feedbackType: 'too_easy' | 'too_difficult' | 'already_know' | 'just_right'
  ) => {
    if (!learningData?.learningPath) return;

    const activeModule =
      learningData.learningPath.modules.find(
        (module) => module.id === learningData.learningPath.currentModule
      ) || learningData.learningPath.modules[0];

    if (!activeModule) return;

    const nextTopic =
      activeModule.topics.find(
        (topic) => !activeModule.completedTopics?.includes(topic)
      ) ||
      activeModule.topics[0] ||
      '';

    try {
      setIsReplanning(true);
      await submitLearningFeedbackAndReplan({
        feedbackType,
        moduleId: activeModule.id,
        topic: nextTopic,
      });

      const updated = await getLearningPath();
      setLearningData(updated);

      toast({
        title: 'Learning path updated',
        description:
          feedbackType === 'too_difficult'
            ? 'Added reinforcement and adjusted your flow.'
            : 'Path updated based on your feedback.',
      });
    } catch (error) {
      toast({
        title: 'Could not update learning path',
        description:
          error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsReplanning(false);
    }
  };

  if (loading) {
    return (
      <LearningLayout>
        <div className='flex items-center justify-center h-screen'>
          <div className='flex flex-col items-center gap-4'>
            <Loader2 className='w-8 h-8 animate-spin text-[hsl(var(--primary))]' />
            <p className='text-[hsl(var(--muted-foreground))]'>
              Loading your learning path...
            </p>
          </div>
        </div>
      </LearningLayout>
    );
  }

  if (!learningData?.learningPath?.modules?.length) {
    return (
      <LearningLayout>
        <div className='flex items-center justify-center h-screen'>
          <div className='flex flex-col items-center gap-4 text-center'>
            <BookOpen className='w-12 h-12 text-[hsl(var(--muted-foreground))]' />
            <h2 className='text-xl font-semibold text-[hsl(var(--foreground))]'>
              No Learning Path Found
            </h2>
            <p className='text-[hsl(var(--muted-foreground))] max-w-md'>
              It looks like your learning path hasn't been generated yet. Please
              complete the onboarding quiz to get started.
            </p>
          </div>
        </div>
      </LearningLayout>
    );
  }

  const { learningPath } = learningData;
  const modules = learningPath.modules;
  const completedModules = modules.filter(
    (m) => m.status === 'completed'
  ).length;

  return (
    <LearningLayout>
      <div className='ui-page-shell max-w-4xl h-screen'>
        {/* Header */}
        <div className='ui-page-header mb-8 animate-fade-in'>
          <h1 className='ui-page-title'>Learning Path</h1>
          <p className='ui-page-subtitle'>
            Your personalized {learningPath.level} web development journey
          </p>

          {/* Progress Overview */}
          <div className='ui-surface-card flex items-center gap-4 mt-6 p-4'>
            <div className='flex-1'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm text-[hsl(var(--muted-foreground))]'>
                  Overall Progress
                </span>
                <span className='text-sm font-medium text-[hsl(var(--primary))]'>
                  {completedModules} of {modules.length} modules
                </span>
              </div>
              <div className='h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden'>
                <div
                  className='h-full bg-linear-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] rounded-full transition-all duration-700'
                  style={{
                    width: `${(completedModules / modules.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className='ui-surface-card mt-4 p-4'>
            <p className='text-sm text-[hsl(var(--muted-foreground))] mb-3 font-medium'>
              How is your current learning path feeling?
            </p>
            <div className='flex flex-wrap gap-2'>
              <Button
                variant='outline'
                size='sm'
                disabled={isReplanning}
                onClick={() => handleFeedback('too_easy')}
              >
                Too Easy
              </Button>
              <Button
                variant='outline'
                size='sm'
                disabled={isReplanning}
                onClick={() => handleFeedback('too_difficult')}
              >
                Too Difficult
              </Button>
              <Button
                variant='outline'
                size='sm'
                disabled={isReplanning}
                onClick={() => handleFeedback('already_know')}
              >
                I already know this
              </Button>
              <Button
                variant='outline'
                size='sm'
                disabled={isReplanning}
                onClick={() => handleFeedback('just_right')}
              >
                Just Right
              </Button>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className='space-y-4 stagger-children'>
          {modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              index={index}
              totalModules={modules.length}
            />
          ))}
        </div>
      </div>
    </LearningLayout>
  );
}
