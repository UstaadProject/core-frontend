import { Sparkles, ArrowRight } from 'lucide-react';

export function AIAssistantWidget() {
  return (
    <div className='relative p-6 rounded-xl overflow-hidden border border-primary/20 group hover:border-primary/40 transition-all duration-300'>
      {/* Background gradient */}
      <div className='absolute inset-0 gradient-primary opacity-5 group-hover:opacity-10 transition-opacity duration-500' />

      {/* Animated glow orbs */}
      <div className='absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/20 blur-3xl animate-pulse-glow' />
      <div
        className='absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-accent/20 blur-3xl animate-pulse-glow'
        style={{ animationDelay: '1s' }}
      />

      <div className='relative'>
        <div className='flex items-start gap-4'>
          <div className='p-3 rounded-xl gradient-primary shadow-primary'>
            <Sparkles className='w-6 h-6 text-primary-foreground' />
          </div>
          <div className='flex-1'>
            <h3 className='font-display font-semibold text-lg text-foreground mb-1'>
              Ai Learning Assistant
            </h3>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              Get personalized help with your courses, code reviews, and career
              advice powered by AI.
            </p>
          </div>
        </div>

        <div className='mt-5 flex items-center gap-3'>
          <input
            type='text'
            placeholder='Ask anything about your learning journey...'
            className='flex-1 px-4 py-2.5 rounded-lg bg-surface border border-border text-sm placeholder:text-muted-text focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all'
          />
          <button className='p-2.5 rounded-lg gradient-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-primary'>
            <ArrowRight className='w-5 h-5' />
          </button>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {['Review my code', 'Explain React hooks', 'Career tips'].map(
            (suggestion) => (
              <button
                key={suggestion}
                className='px-3 py-1.5 text-xs font-medium rounded-full border border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors'
              >
                {suggestion}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
