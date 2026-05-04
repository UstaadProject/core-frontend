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
    <div className='relative p-8 md:p-10 rounded-2xl overflow-hidden border border-border/60 bg-gradient-to-br from-card/80 via-card to-surface/60 animate-slide-up'>
      {/* Animated gradient orbs */}
      <div className='absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/8 blur-3xl animate-pulse-glow' />
      <div
        className='absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-secondary/8 blur-3xl animate-pulse-glow'
        style={{ animationDelay: '0.5s' }}
      />
      <div
        className='absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-accent/8 blur-3xl animate-pulse-glow'
        style={{ animationDelay: '1s' }}
      />

      <div className='relative flex flex-col md:flex-row md:items-center md:justify-between gap-8'>
        <div className='space-y-3'>
          <p className='text-muted-foreground text-sm font-semibold uppercase tracking-wider'>
            {greeting}
          </p>
          <h1 className='text-3xl md:text-5xl font-bold font-poppins'>
            Welcome back, <span className='text-gradient-hero'>{userName}</span>
          </h1>
          <p className='text-muted-foreground text-base leading-relaxed max-w-2xl'>
            You're making exceptional progress! Keep up the amazing momentum and
            unlock your full potential.
          </p>
        </div>

        <div className='flex flex-col gap-4 md:gap-5'>
          {/* Streak */}
          <div className='flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-br from-secondary/15 to-secondary/5 border border-secondary/30 hover:border-secondary/50 transition-all duration-300 group'>
            <div className='p-3 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/10 group-hover:scale-110 transition-transform'>
              <Flame className='w-6 h-6 text-secondary' />
            </div>
            <div>
              <p className='text-3xl font-bold font-poppins text-secondary'>
                {streak}
              </p>
              <p className='text-xs text-muted-foreground font-semibold'>
                Day Streak 🔥
              </p>
            </div>
          </div>

          {/* XP */}
          <div className='flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 border border-accent/30 hover:border-accent/50 transition-all duration-300 group'>
            <div className='p-3 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 group-hover:scale-110 transition-transform'>
              <Zap className='w-6 h-6 text-accent' />
            </div>
            <div>
              <p className='text-3xl font-bold font-poppins text-accent'>
                {xp.toLocaleString()}
              </p>
              <p className='text-xs text-muted-foreground font-semibold'>
                Total XP ⚡
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
