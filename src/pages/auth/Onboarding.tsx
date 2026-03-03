import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Code,
  Palette,
  PenTool,
  TrendingUp,
  Video,
  Music,
  Sparkles,
  Target,
  Clock,
  Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/Logo';
import { useToast } from '@/hooks/use-toast';
import {
  completeOnboarding,
  generateOnboardingQuiz,
  submitOnboardingQuiz,
  type GeneratedQuiz,
  type OnboardingPreferences,
} from '@/services/api/userApi';

interface OptionCardProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  gradient?: string;
}

const OptionCard: React.FC<OptionCardProps> = ({
  icon,
  label,
  description,
  selected,
  onClick,
  gradient = 'from-primary/20 to-accent/20',
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative p-4 rounded-xl border transition-all duration-300 text-left group
        ${
          selected
            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
            : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
        }
      `}
    >
      {selected && (
        <div
          className={`absolute inset-0 rounded-xl bg-linear-to-br ${gradient} opacity-50`}
        />
      )}
      <div className='relative flex items-start gap-3'>
        <div
          className={`
          p-2 rounded-lg transition-all duration-300
          ${selected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground group-hover:text-primary'}
        `}
        >
          {icon}
        </div>
        <div className='flex-1 min-w-0'>
          <p
            className={`font-medium ${selected ? 'text-foreground' : 'text-foreground/80'}`}
          >
            {label}
          </p>
          {description && (
            <p className='text-sm text-muted-foreground mt-0.5'>
              {description}
            </p>
          )}
        </div>
        {selected && (
          <div className='absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse' />
        )}
      </div>
    </button>
  );
};

const steps = [
  {
    title: 'What skills interest you?',
    subtitle: 'Select all that apply',
    multiple: true,
  },
  {
    title: "What's your experience level?",
    subtitle: 'This helps us personalize your learning path',
    multiple: false,
  },
  {
    title: "What's your main goal?",
    subtitle: "We'll tailor your experience accordingly",
    multiple: false,
  },
  {
    title: 'How much time can you commit?',
    subtitle: 'Be realistic for the best results',
    multiple: false,
  },
];

const skillOptions = [
  {
    id: 'web-dev',
    label: 'Web Development',
    description: 'HTML, CSS, JavaScript, React',
    icon: <Code className='w-5 h-5' />,
  },
  {
    id: 'design',
    label: 'UI/UX Design',
    description: 'Figma, user research, prototyping',
    icon: <Palette className='w-5 h-5' />,
  },
  {
    id: 'writing',
    label: 'Content Writing',
    description: 'Copywriting, blogging, SEO',
    icon: <PenTool className='w-5 h-5' />,
  },
  {
    id: 'marketing',
    label: 'Digital Marketing',
    description: 'Social media, ads, analytics',
    icon: <TrendingUp className='w-5 h-5' />,
  },
  {
    id: 'video',
    label: 'Video Editing',
    description: 'Premiere Pro, After Effects',
    icon: <Video className='w-5 h-5' />,
  },
  {
    id: 'audio',
    label: 'Audio Production',
    description: 'Podcasts, music, voiceovers',
    icon: <Music className='w-5 h-5' />,
  },
];

const experienceOptions = [
  {
    id: 'beginner',
    label: 'Complete Beginner',
    description: 'Just starting out',
    icon: <Sparkles className='w-5 h-5' />,
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  {
    id: 'some',
    label: 'Some Experience',
    description: 'Done a few projects',
    icon: <Target className='w-5 h-5' />,
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description: 'Working professionally',
    icon: <Rocket className='w-5 h-5' />,
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: 'Years of experience',
    icon: <TrendingUp className='w-5 h-5' />,
    gradient: 'from-orange-500/20 to-red-500/20',
  },
];

const goalOptions = [
  {
    id: 'start',
    label: 'Start Freelancing',
    description: 'Land my first clients',
    icon: <Rocket className='w-5 h-5' />,
    gradient: 'from-primary/20 to-accent/20',
  },
  {
    id: 'improve',
    label: 'Improve Skills',
    description: 'Level up existing abilities',
    icon: <TrendingUp className='w-5 h-5' />,
    gradient: 'from-secondary/20 to-orange-500/20',
  },
  {
    id: 'clients',
    label: 'Get More Clients',
    description: 'Scale my freelance business',
    icon: <Target className='w-5 h-5' />,
    gradient: 'from-accent/20 to-purple-500/20',
  },
  {
    id: 'transition',
    label: 'Career Transition',
    description: 'Switch to freelancing full-time',
    icon: <Sparkles className='w-5 h-5' />,
    gradient: 'from-pink-500/20 to-primary/20',
  },
];

const timeOptions = [
  {
    id: '15min',
    label: '15 minutes/day',
    description: 'Quick daily practice',
    icon: <Clock className='w-5 h-5' />,
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  {
    id: '30min',
    label: '30 minutes/day',
    description: 'Steady progress',
    icon: <Clock className='w-5 h-5' />,
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: '1hour',
    label: '1 hour/day',
    description: 'Serious commitment',
    icon: <Clock className='w-5 h-5' />,
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: '2hours',
    label: '2+ hours/day',
    description: 'Intensive learning',
    icon: <Clock className='w-5 h-5' />,
    gradient: 'from-orange-500/20 to-red-500/20',
  },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<'preferences' | 'quiz' | 'generating'>(
    'preferences'
  );
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selections, setSelections] = useState<OnboardingPreferences>({
    skills: [],
    experience: '',
    goal: '',
    time: '',
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const getOptionsForStep = (step: number) => {
    switch (step) {
      case 0:
        return skillOptions;
      case 1:
        return experienceOptions;
      case 2:
        return goalOptions;
      case 3:
        return timeOptions;
      default:
        return [];
    }
  };

  const getSelectionForStep = (step: number) => {
    switch (step) {
      case 0:
        return selections.skills;
      case 1:
        return selections.experience;
      case 2:
        return selections.goal;
      case 3:
        return selections.time;
      default:
        return '';
    }
  };

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
    if (Array.isArray(selection)) {
      return selection.length > 0;
    }
    return selection !== '';
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
      await submitOnboardingQuiz(quizAnswers);
      await completeOnboarding(selections);

      toast({
        title: 'Welcome to Ustaad!',
        description: 'Your personalized learning path is ready.',
      });
      navigate('/dashboard');
    } catch (error) {
      setPhase('quiz');
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

    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const options = getOptionsForStep(currentStep);
  const selection = getSelectionForStep(currentStep);
  const isMultiple = steps[currentStep].multiple;

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const selectedQuizOption = currentQuestion
    ? quizAnswers[currentQuestion.id]
    : '';

  return (
    <div className='min-h-screen bg-background relative overflow-hidden'>
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse-glow' />
        <div className='absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-secondary/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse-glow delay-500' />
      </div>

      <div
        className='absolute inset-0 opacity-[0.02]'
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className='relative z-10 container max-w-2xl mx-auto px-4 py-8 min-h-screen flex flex-col'>
        <div className='flex items-center justify-between mb-8'>
          <Logo />
          {phase === 'preferences' ? (
            <div className='flex items-center gap-2'>
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-8 bg-gradient-hero'
                      : index < currentStep
                        ? 'w-2 bg-primary'
                        : 'w-2 bg-muted'
                  }`}
                />
              ))}
            </div>
          ) : phase === 'quiz' ? (
            <p className='text-sm text-muted-foreground'>
              Question {currentQuestionIndex + 1} of{' '}
              {quiz?.questions.length || 0}
            </p>
          ) : (
            <p className='text-sm text-muted-foreground'>
              Generating your path...
            </p>
          )}
        </div>

        <div className='flex-1 flex flex-col justify-center'>
          {phase === 'preferences' && (
            <div className='animate-slide-up'>
              <h1 className='text-3xl md:text-4xl font-bold text-foreground mb-2'>
                {steps[currentStep].title}
              </h1>
              <p className='text-lg text-muted-foreground mb-8'>
                {steps[currentStep].subtitle}
              </p>

              <div className='grid gap-3 grid-cols-1 md:grid-cols-2'>
                {options.map((option) => (
                  <OptionCard
                    key={option.id}
                    icon={option.icon}
                    label={option.label}
                    description={option.description}
                    gradient={(option as { gradient?: string }).gradient}
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
            <div className='animate-slide-up'>
              <h1 className='text-2xl md:text-3xl font-bold text-foreground mb-2'>
                Skills Assessment Quiz
              </h1>
              <p className='text-muted-foreground mb-6'>
                This helps us set your ability level and generate the right
                learning path.
              </p>

              <div className='rounded-xl border border-border bg-card/70 p-5 mb-4'>
                <p className='text-sm text-muted-foreground mb-2'>
                  {currentQuestion.topic || 'General'} •{' '}
                  {currentQuestion.difficulty || 'Mixed'}
                </p>
                <h2 className='text-lg font-semibold text-foreground'>
                  {currentQuestion.question}
                </h2>
              </div>

              <div className='space-y-3'>
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    onClick={() =>
                      handleQuizOptionSelect(currentQuestion.id, option)
                    }
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedQuizOption === option
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted/20 hover:border-primary/40'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === 'generating' && (
            <div className='animate-slide-up flex flex-col items-center justify-center text-center'>
              <div className='w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6' />
              <h1 className='text-2xl md:text-3xl font-bold text-foreground mb-2'>
                Creating Your Learning Path
              </h1>
              <p className='text-muted-foreground mb-4 max-w-md'>
                Our AI is analyzing your quiz results and creating a
                personalized learning journey just for you...
              </p>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Sparkles className='w-4 h-4 text-primary animate-pulse' />
                <span>This may take a moment</span>
              </div>
            </div>
          )}
        </div>

        <div className='flex items-center justify-between pt-8'>
          <Button
            variant='ghost'
            onClick={handleBack}
            disabled={
              isLoading ||
              (phase === 'preferences' && currentStep === 0) ||
              phase === 'generating'
            }
            className='gap-2'
          >
            <ArrowLeft className='w-4 h-4' />
            Back
          </Button>

          {phase === 'preferences' ? (
            <Button
              variant='gradient'
              size='lg'
              onClick={handlePreferencesNext}
              disabled={!canProceedPreferences() || isLoading}
              className='gap-2'
            >
              {isLoading ? (
                <div className='w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin' />
              ) : (
                <>
                  {currentStep === steps.length - 1 ? 'Start Quiz' : 'Continue'}
                  <ArrowRight className='w-4 h-4' />
                </>
              )}
            </Button>
          ) : phase === 'quiz' ? (
            <Button
              variant='gradient'
              size='lg'
              onClick={handleQuizNext}
              disabled={!selectedQuizOption || isLoading}
              className='gap-2'
            >
              {isLoading ? (
                <div className='w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin' />
              ) : (
                <>
                  {currentQuestionIndex === (quiz?.questions.length || 1) - 1
                    ? 'Finish Onboarding'
                    : 'Next Question'}
                  <ArrowRight className='w-4 h-4' />
                </>
              )}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
