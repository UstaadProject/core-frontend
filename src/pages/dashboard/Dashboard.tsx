import { BookOpen, Clock, Target, Trophy } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WelcomeHero } from '@/components/dashboard/WelcomeHero';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { LearningProgress } from '@/components/dashboard/LearningProgress';
import { AIAssistantWidget } from '@/components/dashboard/AIAssistantWidget';

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
      </div>
    </DashboardLayout>
  );
};

export default Index;
