import React from 'react';
import { Flame, Trophy, Bot, FileText, GraduationCap } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const features = [
  { icon: GraduationCap, text: '50+ structured web-dev lessons' },
  { icon: Flame, text: 'Daily streaks keep you consistent' },
  { icon: Trophy, text: 'XP, badges & a live leaderboard' },
  { icon: Bot, text: 'Shagird your always-on AI tutor' },
  { icon: FileText, text: 'Auto-generated portfolio resume' },
];

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Brand panel (desktop) */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-primary to-[oklch(0.5_0.12_205)] p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        {/* soft decorative orbs */}
        <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 size-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative">
          <Logo onDark className="text-primary-foreground" />
        </div>

        <div className="relative space-y-8">
          <div className="space-y-3">
            <h2 className="font-display text-4xl font-extrabold leading-tight">
              Master web development,
              <br />
              one quest at a time.
            </h2>
            <p className="max-w-sm text-sm text-primary-foreground/80">
              A gamified path that turns real curriculum into momentum with
              XP, streaks and an AI tutor in your corner.
            </p>
          </div>

          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f.text} className="flex items-center gap-3 text-sm">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/15">
                  <f.icon className="size-4.5" />
                </span>
                <span className="text-primary-foreground/90">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-3 text-xs text-primary-foreground/70">
          <div className="flex -space-x-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="size-7 rounded-full border-2 border-primary bg-white/25"
              />
            ))}
          </div>
          Join thousands leveling up their dev skills.
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-10 sm:px-8 lg:w-1/2">
        {/* mobile logo */}
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>
        <div className="w-full max-w-md animate-fade-in">{children}</div>
      </div>
    </div>
  );
};
