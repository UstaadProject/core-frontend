import { Flame, Zap } from 'lucide-react';

interface WelcomeHeroProps {
  userName: string;
  streak: number;
  xp: number;
}

export function WelcomeHero({ userName, streak, xp }: WelcomeHeroProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className='relative p-8 rounded-2xl overflow-hidden border border-border'>
      {/* Background */}
      <div className='absolute inset-0 gradient-surface' />

      {/* Animated gradient orbs */}
      <div className='absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse-glow' />
      <div
        className='absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-secondary/10 blur-3xl animate-pulse-glow'
        style={{ animationDelay: '0.5s' }}
      />
      <div
        className='absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-accent/10 blur-3xl animate-pulse-glow'
        style={{ animationDelay: '1s' }}
      />

      <div className='relative flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
        <div className='space-y-2'>
          <p className='text-muted-foreground text-sm'>{greeting}</p>
          <h1 className='text-3xl md:text-4xl font-display font-bold'>
            Welcome back, <span className='text-gradient-hero'>{userName}</span>
          </h1>
          <p className='text-muted-foreground'>
            You're making great progress! Keep up the momentum.
          </p>
        </div>

        <div className='flex items-center gap-4'>
          {/* Streak */}
          <div className='flex items-center gap-3 px-5 py-3 rounded-xl bg-secondary/10 border border-secondary/20'>
            <div className='p-2 rounded-lg bg-secondary/20'>
              <Flame className='w-5 h-5 text-secondary' />
            </div>
            <div>
              <p className='text-2xl font-display font-bold text-secondary'>
                {streak}
              </p>
              <p className='text-xs text-muted-foreground'>Day Streak</p>
            </div>
          </div>

          {/* XP */}
          <div className='flex items-center gap-3 px-5 py-3 rounded-xl bg-accent/10 border border-accent/20'>
            <div className='p-2 rounded-lg bg-accent/20'>
              <Zap className='w-5 h-5 text-accent' />
            </div>
            <div>
              <p className='text-2xl font-display font-bold text-accent'>
                {xp.toLocaleString()}
              </p>
              <p className='text-xs text-muted-foreground'>Total XP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
