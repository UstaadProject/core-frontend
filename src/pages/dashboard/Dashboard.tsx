import { BookOpen, Clock, Target, Trophy } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WelcomeHero } from '@/components/dashboard/WelcomeHero';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { LearningProgress } from '@/components/dashboard/LearningProgress';
import { CourseCard } from '@/components/dashboard/CourseCard';
import { AIAssistantWidget } from '@/components/dashboard/AIAssistantWidget';

const activeCourses = [
  {
    title: 'Complete React Developer',
    instructor: 'Sarah Johnson',
    progress: 65,
    duration: '12h 30m',
    rating: 4.9,
    thumbnail:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
    category: 'React',
  },
  {
    title: 'JavaScript Pro Bootcamp',
    instructor: 'Mike Chen',
    progress: 100,
    duration: '24h 15m',
    rating: 4.8,
    thumbnail:
      'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=60',
    category: 'JavaScript',
  },
  {
    title: 'Freelancing Masterclass',
    instructor: 'Emma Davis',
    progress: 20,
    duration: '8h 45m',
    rating: 4.7,
    thumbnail:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60',
    category: 'Business',
  },
];

const Index = () => {
  return (
    <DashboardLayout>
      <div className='space-y-8'>
        {/* Welcome Section */}
        <WelcomeHero userName='Ahmed' streak={12} xp={3450} />

        {/* Stats Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatsCard
            title='Courses Enrolled'
            value={8}
            subtitle='3 in progress'
            icon={BookOpen}
            variant='primary'
          />
          <StatsCard
            title='Hours Learned'
            value='47'
            subtitle='This month'
            icon={Clock}
            variant='secondary'
            trend={{ value: 12, positive: true }}
          />
          <StatsCard
            title='Skills Mastered'
            value={5}
            subtitle='2 more to unlock'
            icon={Target}
            variant='accent'
          />
          <StatsCard
            title='Achievements'
            value={12}
            subtitle='3 new this week'
            icon={Trophy}
            variant='primary'
            trend={{ value: 25, positive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Learning Progress - Takes 2 columns */}
          <div className='lg:col-span-2'>
            <LearningProgress />
          </div>

          {/* AI Assistant Widget */}
          <div className='lg:col-span-1'>
            <AIAssistantWidget />
          </div>
        </div>

        {/* Active Courses */}
        <section>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-xl font-display font-semibold text-foreground'>
                Continue Learning
              </h2>
              <p className='text-sm text-muted-foreground'>
                Pick up where you left off
              </p>
            </div>
            <button className='text-sm font-medium text-primary hover:text-primary-glow transition-colors'>
              View All Courses →
            </button>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {activeCourses.map((course) => (
              <CourseCard key={course.title} {...course} />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Index;
