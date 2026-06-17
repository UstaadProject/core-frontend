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
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  getLearningPath,
  submitLearningFeedbackAndReplan,
  type FullLearningPath,
  type FullModule,
} from '@/services/api/learningApi';
import { useToast } from '@/hooks/use-toast';

type TopicStatus = 'completed' | 'in-progress' | 'available' | 'locked';

function ModuleCard({ module }: { module: FullModule }) {
  const [isExpanded, setIsExpanded] = useState(module.status === 'in-progress');
  const navigate = useNavigate();

  const completedTopics = module.completedTopics?.length || 0;
  const totalTopics = module.topics?.length || 0;
  const progress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
  const locked = module.status === 'pending';

  const getTopicStatus = (topic: string): TopicStatus => {
    if (module.completedTopics?.includes(topic)) return 'completed';
    if (module.status === 'pending') return 'locked';
    const firstIncomplete = module.topics.find(
      (t) => !module.completedTopics?.includes(t)
    );
    if (topic === firstIncomplete && module.status === 'in-progress')
      return 'in-progress';
    const topicIndex = module.topics.indexOf(topic);
    const allPreviousComplete = module.topics
      .slice(0, topicIndex)
      .every((t) => module.completedTopics?.includes(t));
    return allPreviousComplete && module.status === 'in-progress'
      ? 'available'
      : 'locked';
  };

  const handleTopicClick = (topic: string, status: TopicStatus) => {
    if (status === 'locked') return;
    navigate(`/lesson/${module.id}/${encodeURIComponent(topic)}`);
  };

  return (
    <div className="relative">
      <Card
        className={cn(
          'overflow-hidden transition-colors',
          module.status === 'in-progress' && 'border-primary/40',
          locked && 'opacity-70'
        )}
      >
        <button
          onClick={() => !locked && setIsExpanded((v) => !v)}
          disabled={locked}
          className={cn(
            'flex w-full items-center gap-4 p-4 text-left',
            !locked && 'hover:bg-accent/40'
          )}
        >
          {/* status node */}
          <div className="grid size-9 shrink-0 place-items-center">
            {module.status === 'completed' ? (
              <CheckCircle2 className="size-7 text-success" />
            ) : module.status === 'in-progress' ? (
              <div className="grid size-7 place-items-center rounded-full border-2 border-primary">
                <div className="size-2.5 rounded-full bg-primary" />
              </div>
            ) : (
              <div className="grid size-7 place-items-center rounded-full border-2 border-border">
                <Lock className="size-3.5 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-display text-base font-bold">
                {module.title}
              </h3>
              <Badge
                variant={
                  module.status === 'completed'
                    ? 'success'
                    : module.status === 'in-progress'
                      ? 'default'
                      : 'secondary'
                }
                className="shrink-0 capitalize"
              >
                {module.status === 'in-progress' ? 'In progress' : module.status}
              </Badge>
            </div>
            <p className="mt-0.5 text-sm capitalize text-muted-foreground">
              {module.difficulty} · {totalTopics} topics
            </p>
            {!locked && (
              <div className="mt-2.5 flex items-center gap-3">
                <Progress
                  value={progress}
                  tone={module.status === 'completed' ? 'success' : 'primary'}
                  size="sm"
                />
                <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                  {completedTopics}/{totalTopics}
                </span>
              </div>
            )}
          </div>

          {!locked && (
            <div className="text-muted-foreground">
              {isExpanded ? (
                <ChevronDown className="size-5" />
              ) : (
                <ChevronRight className="size-5" />
              )}
            </div>
          )}
        </button>

        {isExpanded && !locked && (
          <div className="border-t border-border bg-muted/20 p-3">
            <div className="space-y-1">
              {module.topics.map((topic) => {
                const status = getTopicStatus(topic);
                return (
                  <button
                    key={topic}
                    onClick={() => handleTopicClick(topic, status)}
                    disabled={status === 'locked'}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                      status === 'locked'
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:bg-card',
                      status === 'in-progress' &&
                        'bg-primary/5 ring-1 ring-primary/20'
                    )}
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 className="size-4 shrink-0 text-success" />
                    ) : status === 'in-progress' ? (
                      <PlayCircle className="size-4 shrink-0 text-primary" />
                    ) : status === 'available' ? (
                      <Circle className="size-4 shrink-0 text-primary" />
                    ) : (
                      <Lock className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    <BookOpen className="size-4 shrink-0 text-muted-foreground" />
                    <span
                      className={cn(
                        'flex-1 truncate text-sm',
                        status === 'completed'
                          ? 'text-muted-foreground line-through decoration-success/40'
                          : 'text-foreground'
                      )}
                    >
                      {topic}
                    </span>
                    {status === 'in-progress' && (
                      <Badge className="shrink-0">Continue</Badge>
                    )}
                    {status === 'available' && (
                      <Badge variant="secondary" className="shrink-0">
                        Start
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

const feedbackOptions: {
  type: 'too_easy' | 'too_difficult' | 'already_know' | 'just_right';
  label: string;
  emoji: string;
}[] = [
  { type: 'too_easy', label: 'Too easy', emoji: '😴' },
  { type: 'just_right', label: 'Just right', emoji: '🎯' },
  { type: 'too_difficult', label: 'Too hard', emoji: '🥵' },
  { type: 'already_know', label: 'I know this', emoji: '✅' },
];

export default function LearningPath() {
  const [loading, setLoading] = useState(true);
  const [isReplanning, setIsReplanning] = useState(false);
  const [learningData, setLearningData] = useState<FullLearningPath | null>(null);
  const { toast } = useToast();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    (async () => {
      try {
        setLoading(true);
        setLearningData(await getLearningPath());
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
    })();
  }, [toast]);

  const handleFeedback = async (
    feedbackType: 'too_easy' | 'too_difficult' | 'already_know' | 'just_right'
  ) => {
    if (!learningData?.learningPath) return;
    const activeModule =
      learningData.learningPath.modules.find(
        (m) => m.id === learningData.learningPath.currentModule
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
      setLearningData(await getLearningPath());
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
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsReplanning(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="grid h-[60vh] place-items-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p>Loading your learning path…</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!learningData?.learningPath?.modules?.length) {
    return (
      <DashboardLayout>
        <div className="grid h-[60vh] place-items-center">
          <Card className="max-w-md text-center">
            <CardContent className="flex flex-col items-center gap-3 p-8">
              <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <BookOpen className="size-7" />
              </div>
              <h2 className="font-display text-xl font-bold">
                No learning path yet
              </h2>
              <p className="text-sm text-muted-foreground">
                Complete the onboarding quiz and we'll generate a personalized
                path for you.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const { learningPath } = learningData;
  const modules = learningPath.modules;
  const completedModules = modules.filter((m) => m.status === 'completed').length;
  const overall = modules.length
    ? Math.round((completedModules / modules.length) * 100)
    : 0;

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
            Learning Path
          </h1>
          <p className="mt-1 text-muted-foreground">
            Your personalized{' '}
            <span className="font-medium capitalize text-primary">
              {learningPath.level}
            </span>{' '}
            web development journey
          </p>
        </div>

        {/* Overview */}
        <Card>
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">
                  Overall progress
                </span>
                <span className="font-semibold tabular-nums">
                  {completedModules} / {modules.length} modules
                </span>
              </div>
              <Progress value={overall} tone="success" />
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card>
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <p className="text-sm font-medium">
                How is the current pace feeling?
              </p>
              {isReplanning && (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {feedbackOptions.map((opt) => (
                <Button
                  key={opt.type}
                  variant="outline"
                  size="sm"
                  disabled={isReplanning}
                  onClick={() => handleFeedback(opt.type)}
                >
                  <span>{opt.emoji}</span>
                  {opt.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Modules timeline */}
        <div className="space-y-4">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
