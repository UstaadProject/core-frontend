import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Layout,
  Server,
  Layers,
  Database,
  Smartphone,
  Cloud,
  Sparkles,
  Target,
  Clock,
  Rocket,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Check,
  Zap,
  ShieldCheck,
  Flame,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/layout/Logo';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  completeOnboarding,
  generateOnboardingQuiz,
  submitOnboardingQuiz,
  type GeneratedQuiz,
  type OnboardingPreferences,
  type SubmitQuizResult,
} from '@/services/api/userApi';

const prettyArea = (skillArea: string) =>
  skillArea
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const STATUS_META: Record<
  'weak' | 'developing' | 'strong',
  { label: string; bar: string; chip: string }
> = {
  weak: {
    label: 'Needs focus',
    bar: 'bg-rose-500',
    chip: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  },
  developing: {
    label: 'Developing',
    bar: 'bg-amber-500',
    chip: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  strong: {
    label: 'Strong',
    bar: 'bg-primary',
    chip: 'bg-primary/10 text-primary',
  },
};

interface OptionDef {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

const OptionCard: React.FC<{
  option: OptionDef;
  selected: boolean;
  onClick: () => void;
}> = ({ option, selected, onClick }) => {
  const Icon = option.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-all',
        selected
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-border bg-card hover:border-primary/40 hover:bg-accent/40'
      )}
    >
      <span
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-xl transition-colors',
          selected
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground group-hover:text-primary'
        )}
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-tight">{option.label}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {option.description}
        </p>
      </div>
      <span
        className={cn(
          'grid size-5 shrink-0 place-items-center rounded-full border transition-all',
          selected
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border'
        )}
      >
        {selected && <Check className="size-3.5" />}
      </span>
    </button>
  );
};

const steps = [
  {
    title: 'Which areas excite you most?',
    subtitle: 'Pick all that apply — your path will lean into these.',
    multiple: true,
  },
  {
    title: "What's your experience level?",
    subtitle: 'This sets the starting difficulty of your path.',
    multiple: false,
  },
  {
    title: "What's your main goal?",
    subtitle: "We'll tailor projects and milestones to match.",
    multiple: false,
  },
  {
    title: 'How much time can you commit?',
    subtitle: 'Be realistic — consistency beats intensity.',
    multiple: false,
  },
];

const skillOptions: OptionDef[] = [
  { id: 'frontend', label: 'Frontend', description: 'HTML, CSS, JavaScript, React', icon: Layout },
  { id: 'backend', label: 'Backend', description: 'Node, APIs, auth, servers', icon: Server },
  { id: 'fullstack', label: 'Full-Stack', description: 'End-to-end web apps', icon: Layers },
  { id: 'databases', label: 'Databases', description: 'SQL, NoSQL, data modeling', icon: Database },
  { id: 'responsive', label: 'Responsive UI', description: 'Mobile-first, accessible design', icon: Smartphone },
  { id: 'devops', label: 'Deployment', description: 'Hosting, CI/CD, the cloud', icon: Cloud },
];

const experienceOptions: OptionDef[] = [
  { id: 'beginner', label: 'Complete Beginner', description: 'Just starting out', icon: Sparkles },
  { id: 'some', label: 'Some Experience', description: 'Built a few things', icon: Target },
  { id: 'intermediate', label: 'Intermediate', description: 'Comfortable coding', icon: Rocket },
  { id: 'advanced', label: 'Advanced', description: 'Years of practice', icon: TrendingUp },
];

const goalOptions: OptionDef[] = [
  { id: 'job', label: 'Land a Dev Job', description: 'Become job-ready', icon: Briefcase },
  { id: 'freelance', label: 'Start Freelancing', description: 'Find my first clients', icon: Rocket },
  { id: 'projects', label: 'Build Projects', description: 'Ship my own ideas', icon: Layers },
  { id: 'transition', label: 'Career Switch', description: 'Move into tech', icon: GraduationCap },
];

const timeOptions: OptionDef[] = [
  { id: '15min', label: '15 minutes/day', description: 'Quick daily practice', icon: Clock },
  { id: '30min', label: '30 minutes/day', description: 'Steady progress', icon: Clock },
  { id: '1hour', label: '1 hour/day', description: 'Serious commitment', icon: Clock },
  { id: '2hours', label: '2+ hours/day', description: 'Intensive learning', icon: Clock },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<
    'preferences' | 'quiz' | 'generating' | 'diagnosis'
  >('preferences');
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [diagnosis, setDiagnosis] = useState<SubmitQuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selections, setSelections] = useState<OnboardingPreferences>({
    skills: [],
    experience: '',
    goal: '',
    time: '',
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const getOptionsForStep = (step: number) =>
    [skillOptions, experienceOptions, goalOptions, timeOptions][step] ?? [];

  const getSelectionForStep = (step: number) =>
    [selections.skills, selections.experience, selections.goal, selections.time][
      step
    ] ?? '';

  const handleSelection = (id: string) => {
    if (currentStep === 0) {
      setSelections((prev) => ({
        ...prev,
        skills: prev.skills.includes(id)
          ? prev.skills.filter((s) => s !== id)
          : [...prev.skills, id],
      }));
    } else if (currentStep === 1) {
      setSelections((prev) => ({ ...prev, experience: id }));
    } else if (currentStep === 2) {
      setSelections((prev) => ({ ...prev, goal: id }));
    } else if (currentStep === 3) {
      setSelections((prev) => ({ ...prev, time: id }));
    }
  };

  const canProceedPreferences = () => {
    const selection = getSelectionForStep(currentStep);
    return Array.isArray(selection) ? selection.length > 0 : selection !== '';
  };

  const handleStartQuiz = async () => {
    try {
      setIsLoading(true);
      const generatedQuiz = await generateOnboardingQuiz(selections);
      if (!generatedQuiz?.questions?.length) {
        throw new Error('Quiz could not be generated.');
      }
      setQuiz(generatedQuiz);
      setCurrentQuestionIndex(0);
      setQuizAnswers({});
      setPhase('quiz');
    } catch (error) {
      toast({
        title: 'Unable to start quiz',
        description:
          error instanceof Error
            ? error.message
            : 'Something went wrong while generating quiz.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return;
    }
    await handleStartQuiz();
  };

  const handleQuizOptionSelect = (questionId: string, option: string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitQuizAndComplete = async () => {
    try {
      setIsLoading(true);
      setPhase('generating');
      const result = await submitOnboardingQuiz(quizAnswers);
      setDiagnosis(result);
      setPhase('diagnosis');
    } catch (error) {
      setPhase('quiz');
      toast({
        title: 'Assessment failed',
        description:
          error instanceof Error
            ? error.message
            : 'Something went wrong while evaluating your quiz.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLearning = async () => {
    try {
      setIsLoading(true);
      await completeOnboarding(selections);
      toast({
        title: 'Welcome to Ustaad!',
        description: 'Your personalized learning path is ready.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Onboarding failed',
        description:
          error instanceof Error
            ? error.message
            : 'Something went wrong while finishing onboarding.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizNext = async () => {
    if (!quiz) return;
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      return;
    }
    await handleSubmitQuizAndComplete();
  };

  const handleBack = () => {
    if (phase === 'quiz') {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prev) => prev - 1);
      } else {
        setPhase('preferences');
        setCurrentStep(steps.length - 1);
      }
      return;
    }
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const options = getOptionsForStep(currentStep);
  const selection = getSelectionForStep(currentStep);
  const isMultiple = steps[currentStep].multiple;

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const selectedQuizOption = currentQuestion
    ? quizAnswers[currentQuestion.id]
    : '';

  const totalSteps = steps.length;
  const progressPct =
    phase === 'preferences'
      ? ((currentStep + (canProceedPreferences() ? 1 : 0)) / totalSteps) * 100
      : phase === 'quiz' && quiz
        ? 100
        : 100;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar with logo + thin progress */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <Logo />
          {phase === 'preferences' ? (
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </span>
          ) : phase === 'quiz' ? (
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestionIndex + 1} of {quiz?.questions.length || 0}
            </span>
          ) : null}
        </div>
        <div className="h-1 w-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-10">
        {phase === 'preferences' && (
          <div className="animate-fade-in">
            <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
              {steps[currentStep].title}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {steps[currentStep].subtitle}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {options.map((option) => (
                <OptionCard
                  key={option.id}
                  option={option}
                  selected={
                    isMultiple
                      ? (selection as string[]).includes(option.id)
                      : selection === option.id
                  }
                  onClick={() => handleSelection(option.id)}
                />
              ))}
            </div>
          </div>
        )}

        {phase === 'quiz' && currentQuestion && (
          <div className="animate-fade-in">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" /> Skills assessment
            </div>
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
              Let's gauge your level
            </h1>
            <p className="mt-1.5 text-muted-foreground">
              A few quick questions so we start you at the right difficulty.
            </p>

            <Card className="mt-6">
              <CardContent className="p-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {currentQuestion.topic || 'General'} ·{' '}
                  {currentQuestion.difficulty || 'Mixed'}
                </p>
                <h2 className="text-lg font-semibold">{currentQuestion.question}</h2>
              </CardContent>
            </Card>

            <div className="mt-4 space-y-3">
              {currentQuestion.options.map((option, i) => {
                const active = selectedQuizOption === option;
                return (
                  <button
                    key={option}
                    onClick={() =>
                      handleQuizOptionSelect(currentQuestion.id, option)
                    }
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all',
                      active
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border bg-card hover:border-primary/40 hover:bg-accent/40'
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-7 shrink-0 place-items-center rounded-lg text-sm font-bold',
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm font-medium">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {phase === 'generating' && (
          <div className="flex animate-fade-in flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="size-16 rounded-full border-4 border-muted border-t-primary animate-spin" />
              <Sparkles className="absolute inset-0 m-auto size-6 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
              Building your learning path
            </h1>
            <p className="mt-2 max-w-md text-muted-foreground">
              Shagird is analyzing your answers and assembling a personalized,
              gamified journey just for you…
            </p>
          </div>
        )}

        {phase === 'diagnosis' && diagnosis && (
          <div className="animate-fade-in">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="size-3.5" /> Assessment complete
            </div>
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
              Here's where you stand
            </h1>
            <p className="mt-1.5 text-muted-foreground">
              {diagnosis.diagnosis.summary}
            </p>

            {/* Level + path summary */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Zap className="size-3.5" /> Level
                </div>
                <p className="mt-1 text-lg font-bold">
                  {diagnosis.skillProfile.overallLevel}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Target className="size-3.5" /> Score
                </div>
                <p className="mt-1 text-lg font-bold">
                  {Math.round(diagnosis.skillProfile.scorePercent)}%
                </p>
              </div>
              <div className="col-span-2 rounded-2xl border border-border bg-card p-4 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <BookOpen className="size-3.5" /> Your path
                </div>
                <p className="mt-1 text-lg font-bold">
                  {diagnosis.learningPath.modules.length} modules
                </p>
              </div>
            </div>

            {/* Per-skill-area proficiency bars */}
            {diagnosis.skillProfile.skillAreas.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  Skill breakdown
                </h2>
                <div className="mt-3 space-y-3">
                  {[...diagnosis.skillProfile.skillAreas]
                    .sort((a, b) => a.proficiency - b.proficiency)
                    .map((area) => {
                      const meta = STATUS_META[area.status];
                      const pct = Math.round(area.proficiency * 100);
                      return (
                        <div key={area.skillArea}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="font-medium">
                              {prettyArea(area.skillArea)}
                            </span>
                            <span
                              className={cn(
                                'rounded-full px-2 py-0.5 text-xs font-semibold',
                                meta.chip
                              )}
                            >
                              {meta.label}
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn('h-full rounded-full', meta.bar)}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Strengths vs focus */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                    <ShieldCheck className="size-4" /> Strengths
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {diagnosis.diagnosis.strengths.map((s) => (
                      <li
                        key={s}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-rose-600 dark:text-rose-400">
                    <Flame className="size-4" /> We'll focus on
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {(diagnosis.diagnosis.next_focus.length > 0
                      ? diagnosis.diagnosis.next_focus
                      : diagnosis.diagnosis.weak_areas
                    ).map((s) => (
                      <li
                        key={s}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-rose-500" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Path preview */}
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Your personalized path
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {diagnosis.diagnosis.recommendation}
              </p>
              <div className="mt-3 space-y-2">
                {diagnosis.learningPath.modules.slice(0, 6).map((module, i) => {
                  const deepCount = module.topicRefs.filter(
                    (t) => t.depth === 'deep'
                  ).length;
                  return (
                    <div
                      key={module.id}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {module.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {module.topics.length} topics
                          {deepCount > 0 && ` · ${deepCount} in-depth`}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize text-muted-foreground">
                        {module.difficulty}
                      </span>
                    </div>
                  );
                })}
                {diagnosis.learningPath.modules.length > 6 && (
                  <p className="pl-1 text-xs text-muted-foreground">
                    + {diagnosis.learningPath.modules.length - 6} more modules
                  </p>
                )}
              </div>
            </div>

            <Button
              size="lg"
              className="mt-8 w-full"
              onClick={handleStartLearning}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="size-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              ) : (
                <>
                  Start learning
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </main>

      {phase !== 'generating' && phase !== 'diagnosis' && (
        <footer className="border-t border-border bg-card/60 backdrop-blur-sm">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={isLoading || (phase === 'preferences' && currentStep === 0)}
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>

            <Button
              size="lg"
              onClick={phase === 'preferences' ? handlePreferencesNext : handleQuizNext}
              disabled={
                isLoading ||
                (phase === 'preferences'
                  ? !canProceedPreferences()
                  : !selectedQuizOption)
              }
            >
              {isLoading ? (
                <div className="size-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              ) : (
                <>
                  {phase === 'preferences'
                    ? currentStep === steps.length - 1
                      ? 'Start quiz'
                      : 'Continue'
                    : currentQuestionIndex === (quiz?.questions.length || 1) - 1
                      ? 'Finish'
                      : 'Next'}
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Onboarding;
