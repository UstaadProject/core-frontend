import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Trophy,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { WelcomeHero } from '@/components/dashboard/WelcomeHero';
import { AIAssistant } from '@/components/learning/AIAssistant';

const stats = [
  {
    label: 'Courses Enrolled',
    value: '8',
    sub: '3 in progress',
    icon: BookOpen,
  },
  {
    label: 'Hours Learned',
    value: '47',
    sub: 'This month',
    trend: '+12% from last week',
    icon: Clock,
  },
  { label: 'Skills Mastered', value: '5', sub: '2 more to unlock', icon: Zap },
  {
    label: 'Achievements',
    value: '12',
    sub: '3 new this week',
    trend: '+25% from last week',
    icon: Trophy,
  },
];

const learningPath = [
  { title: 'HTML & CSS Fundamentals', status: 'completed' },
  { title: 'JavaScript Essentials', status: 'completed' },
  { title: 'React Foundations', status: 'in-progress', progress: 65 },
  { title: 'Building Your Portfolio', status: 'locked' },
  { title: 'Freelance Client Skills', status: 'locked' },
];

export default function Index() {
  const navigate = useNavigate();
  const userName = 'Spicy';

  return (
    <DashboardLayout>
      <div className='p-8 max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8 animate-fade-in'>
          <WelcomeHero userName={userName} streak={12} xp={3450} />
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className='bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-5 animate-fade-in'
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-sm text-[hsl(var(--muted-foreground))]'>
                    {stat.label}
                  </p>
                  <p className='text-3xl font-bold text-[hsl(var(--foreground))] mt-1'>
                    {stat.value}
                  </p>
                  <p className='text-sm text-[hsl(var(--muted-foreground))] mt-1'>
                    {stat.sub}
                  </p>
                  {stat.trend && (
                    <p className='text-xs text-[hsl(var(--success))] mt-1'>
                      {stat.trend}
                    </p>
                  )}
                </div>
                <div className='w-10 h-10 rounded-xl bg-[hsl(var(--primary)/0.1)] flex items-center justify-center'>
                  <stat.icon className='w-5 h-5 text-[hsl(var(--primary))]' />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Learning Path Card */}
          <div
            className='lg:col-span-2 bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-6 animate-fade-in'
            style={{ animationDelay: '0.4s' }}
          >
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='text-xl font-semibold text-[hsl(var(--foreground))]'>
                  Learning Path
                </h2>
                <p className='text-sm text-[hsl(var(--muted-foreground))] mt-0.5'>
                  Your journey to becoming a React freelancer
                </p>
              </div>
              <span className='px-3 py-1 text-sm rounded-full bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))]'>
                3 of 5 modules
              </span>
            </div>

            <div className='space-y-3'>
              {learningPath.map((item, i) => (
                <div
                  key={item.title}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    item.status === 'in-progress'
                      ? 'bg-[hsl(var(--surface-elevated))] border border-[hsl(var(--primary)/0.3)]'
                      : 'hover:bg-[hsl(var(--muted)/0.3)]'
                  }`}
                >
                  {/* Status Icon */}
                  <div className='relative'>
                    {item.status === 'completed' ? (
                      <CheckCircle2 className='w-6 h-6 text-[hsl(var(--success))]' />
                    ) : item.status === 'in-progress' ? (
                      <div className='w-6 h-6 rounded-full border-2 border-[hsl(var(--primary))] flex items-center justify-center'>
                        <div className='w-2.5 h-2.5 rounded-full bg-[hsl(var(--primary))]' />
                      </div>
                    ) : (
                      <div className='w-6 h-6 rounded-full border-2 border-[hsl(var(--muted))] opacity-50' />
                    )}
                    {i < learningPath.length - 1 && (
                      <div
                        className={`absolute left-1/2 top-full w-0.5 h-6 -translate-x-1/2 ${
                          item.status === 'completed'
                            ? 'bg-[hsl(var(--success))]'
                            : 'bg-[hsl(var(--border))]'
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className='flex-1'>
                    <p
                      className={`font-medium ${
                        item.status === 'locked'
                          ? 'text-[hsl(var(--muted-foreground))] opacity-50'
                          : 'text-[hsl(var(--foreground))]'
                      }`}
                    >
                      {item.title}
                    </p>
                    {item.progress !== undefined && (
                      <div className='flex items-center gap-3 mt-2'>
                        <span className='text-xs text-[hsl(var(--muted-foreground))]'>
                          Progress
                        </span>
                        <div className='flex-1 h-1.5 bg-[hsl(var(--muted))] rounded-full overflow-hidden'>
                          <div
                            className='h-full bg-linear-to-r from-[hsl(var(--success))] to-[hsl(var(--primary))] rounded-full'
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span className='text-xs text-[hsl(var(--foreground))]'>
                          {item.progress}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  {item.status === 'in-progress' && (
                    <button
                      onClick={() => navigate('/learning-path')}
                      className='px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium hover:opacity-90 transition-opacity'
                    >
                      Continue
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/learning-path')}
              className='flex items-center gap-2 mt-6 text-[hsl(var(--primary))] hover:underline text-sm font-medium'
            >
              View full learning path
              <ArrowRight className='w-4 h-4' />
            </button>
          </div>

          {/* AI Assistant Card */}
          <AIAssistant/>
        </div>
      </div>
    </DashboardLayout>
  );
}
