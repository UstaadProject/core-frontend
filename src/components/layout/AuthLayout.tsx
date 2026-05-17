import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const features = [
  { emoji: '🎓', text: '50+ structured lessons' },
  { emoji: '🔥', text: 'Daily streak rewards' },
  { emoji: '🏆', text: 'Live leaderboard' },
  { emoji: '🤖', text: 'AI tutor — Shagird' },
  { emoji: '📄', text: 'Auto-generated resume' },
];

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen relative overflow-hidden flex items-center justify-center p-4' style={{ background: 'hsl(240 10% 3.5%)' }}>
      {/* Animated gradient orbs */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-1/3 -left-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse-glow' style={{ background: 'radial-gradient(hsl(320 100% 58% / 0.15), transparent 70%)' }} />
        <div className='absolute -bottom-1/3 -right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse-glow' style={{ background: 'radial-gradient(hsl(280 100% 65% / 0.12), transparent 70%)', animationDelay: '1s' }} />
        <div className='absolute top-1/3 right-1/4 w-72 h-72 rounded-full blur-3xl animate-float' style={{ background: 'radial-gradient(hsl(25 100% 60% / 0.08), transparent 70%)', animationDelay: '0.5s' }} />
      </div>

      {/* Grid / dot pattern */}
      <div
        className='absolute inset-0 opacity-[0.025] pointer-events-none'
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Feature pills — left side (desktop only) */}
      <div className='absolute left-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3'>
        {features.map((f, i) => (
          <div
            key={f.text}
            className='feature-pill animate-fade-in'
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            <span className='text-lg'>{f.emoji}</span>
            <span>{f.text}</span>
          </div>
        ))}
      </div>

      {/* Feature pills — right side (desktop only) */}
      <div className='absolute right-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3'>
        {features.slice().reverse().map((f, i) => (
          <div
            key={f.text + '-r'}
            className='feature-pill animate-fade-in'
            style={{ animationDelay: `${(i + 1) * 0.5 + 0.25}s` }}
          >
            <span className='text-lg'>{f.emoji}</span>
            <span>{f.text}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className='relative z-10 w-full max-w-md'>{children}</div>
    </div>
  );
};
