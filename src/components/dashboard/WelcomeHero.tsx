import { Flame, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WelcomeHeroProps {
  userName: string;
  streak: number;
  xp: number;
}

export function WelcomeHero({ userName, streak, xp }: WelcomeHeroProps) {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div
      className='relative rounded-2xl overflow-hidden border border-[hsl(var(--border)/0.6)] animate-slide-up'
      style={{
        background:
          'linear-gradient(135deg, hsl(240 10% 7%) 0%, hsl(240 8% 5%) 100%)',
        boxShadow: '0 4px 40px hsl(320 100% 58% / 0.08)',
      }}
    >
      {/* Dot-grid overlay */}
      <div
        className='absolute inset-0 opacity-[0.025]'
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Glow orbs */}
      <div className='absolute top-0 right-0 w-80 h-80 rounded-full bg-[hsl(320_100%_58%/0.08)] blur-3xl animate-pulse-glow pointer-events-none' />
      <div
        className='absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-[hsl(25_100%_60%/0.06)] blur-3xl animate-pulse-glow pointer-events-none'
        style={{ animationDelay: '0.8s' }}
      />
      <div
        className='absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-[hsl(280_100%_65%/0.06)] blur-3xl animate-pulse-glow pointer-events-none'
        style={{ animationDelay: '1.6s' }}
      />

      <div className='relative p-8 md:p-10'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-8'>
          {/* Text block */}
          <div className='space-y-4 flex-1'>
            <div className='flex items-center gap-2'>
              <span className='pill pill-primary text-[10px] tracking-widest uppercase'>
                {greeting} 👋
              </span>
            </div>
            <h1 className='font-display text-3xl md:text-5xl font-extrabold leading-tight tracking-tight'>
              Welcome back,{' '}
              <span className='text-gradient-hero'>{userName}</span>
            </h1>
            <p className='text-[hsl(var(--muted-foreground))] text-base leading-relaxed max-w-xl'>
              You're making exceptional progress! Keep the momentum going and
              unlock your full potential.
            </p>
            <button
              onClick={() => navigate('/learning-path')}
              className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:gap-3 group'
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
                boxShadow: '0 0 20px hsl(var(--primary) / 0.35)',
                color: 'hsl(var(--primary-foreground))',
              }}
            >
              Continue Learning
              <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
            </button>
          </div>

          {/* Stats pills */}
          <div className='flex flex-row md:flex-col gap-3 shrink-0'>
            {/* Streak */}
            <div
              className='flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 group hover:scale-[1.03]'
              style={{
                background:
                  'linear-gradient(135deg, hsl(25 100% 60% / 0.12), hsl(25 100% 60% / 0.04))',
                borderColor: 'hsl(25 100% 60% / 0.3)',
              }}
            >
              <div
                className='p-2.5 rounded-xl group-hover:scale-110 transition-transform'
                style={{
                  background:
                    'linear-gradient(135deg, hsl(25 100% 60% / 0.3), hsl(25 100% 60% / 0.1))',
                }}
              >
                <Flame className='w-5 h-5 text-[hsl(var(--secondary))]' />
              </div>
              <div>
                <p
                  className='text-2xl font-extrabold font-display'
                  style={{ color: 'hsl(var(--secondary))' }}
                >
                  {streak}
                </p>
                <p className='text-[11px] text-[hsl(var(--muted-foreground))] font-semibold'>
                  Day Streak 🔥
                </p>
              </div>
            </div>

            {/* XP */}
            <div
              className='flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 group hover:scale-[1.03]'
              style={{
                background:
                  'linear-gradient(135deg, hsl(280 100% 65% / 0.12), hsl(280 100% 65% / 0.04))',
                borderColor: 'hsl(280 100% 65% / 0.3)',
              }}
            >
              <div
                className='p-2.5 rounded-xl group-hover:scale-110 transition-transform'
                style={{
                  background:
                    'linear-gradient(135deg, hsl(280 100% 65% / 0.3), hsl(280 100% 65% / 0.1))',
                }}
              >
                <Zap className='w-5 h-5 text-[hsl(var(--accent))]' />
              </div>
              <div>
                <p
                  className='text-2xl font-extrabold font-display'
                  style={{ color: 'hsl(var(--accent))' }}
                >
                  {xp.toLocaleString()}
                </p>
                <p className='text-[11px] text-[hsl(var(--muted-foreground))] font-semibold'>
                  Total XP ⚡
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
