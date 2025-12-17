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
  const [selections, setSelections] = useState<{
    skills: string[];
    experience: string;
    goal: string;
    time: string;
  }>({
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

  const canProceed = () => {
    const selection = getSelectionForStep(currentStep);
    if (Array.isArray(selection)) {
      return selection.length > 0;
    }
    return selection !== '';
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast({
        title: 'Welcome to Ustaad!',
        description: 'Your personalized learning path is ready.',
      });
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const options = getOptionsForStep(currentStep);
  const selection = getSelectionForStep(currentStep);
  const isMultiple = steps[currentStep].multiple;

  return (
    <div className='min-h-screen bg-background relative overflow-hidden'>
      {/* Background effects */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse-glow' />
        <div className='absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-secondary/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse-glow delay-500' />
      </div>

      {/* Grid pattern */}
      <div
        className='absolute inset-0 opacity-[0.02]'
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className='relative z-10 container max-w-2xl mx-auto px-4 py-8 min-h-screen flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <Logo />
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
        </div>

        {/* Content */}
        <div className='flex-1 flex flex-col justify-center'>
          <div className='animate-slide-up'>
            <h1 className='text-3xl md:text-4xl font-bold text-foreground mb-2'>
              {steps[currentStep].title}
            </h1>
            <p className='text-lg text-muted-foreground mb-8'>
              {steps[currentStep].subtitle}
            </p>

            <div
              className={`grid gap-3 ${currentStep === 0 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}
            >
              {options.map((option) => (
                <OptionCard
                  key={option.id}
                  icon={option.icon}
                  label={option.label}
                  description={option.description}
                  gradient={(option as any).gradient}
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
        </div>

        {/* Navigation */}
        <div className='flex items-center justify-between pt-8'>
          <Button
            variant='ghost'
            onClick={handleBack}
            disabled={currentStep === 0}
            className='gap-2'
          >
            <ArrowLeft className='w-4 h-4' />
            Back
          </Button>

          <Button
            variant='gradient'
            size='lg'
            onClick={handleNext}
            disabled={!canProceed()}
            className='gap-2'
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
            <ArrowRight className='w-4 h-4' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
