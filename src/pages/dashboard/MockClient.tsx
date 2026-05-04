import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MockClientInteraction } from '@/components/freelance/MockClientInteraction';
import { MessageSquareQuote, Sparkles, ShieldCheck } from 'lucide-react';

const highlights = [
  {
    icon: MessageSquareQuote,
    title: 'Client realism',
    text: 'Practice with structured freelance scenarios that feel closer to a real discovery call.',
  },
  {
    icon: Sparkles,
    title: 'Sharper prompts',
    text: 'Keep your questions focused so the conversation moves toward scope, outcomes, and deliverables.',
  },
  {
    icon: ShieldCheck,
    title: 'Safer practice',
    text: 'Test your communication style before you take it into a live client conversation.',
  },
];

export default function MockClient() {
  return (
    <DashboardLayout>
      <div className='min-h-screen bg-[hsl(var(--background))] animate-fade-in'>
        <div className='px-6 py-8 border-b border-[hsl(var(--border))] bg-linear-to-b from-[hsl(var(--background))] to-transparent'>
          <div className='max-w-7xl mx-auto'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2.5 rounded-lg bg-linear-to-br from-primary/20 to-accent/20'>
                <MessageSquareQuote className='w-6 h-6 text-[hsl(var(--primary))]' />
              </div>
              <h1 className='text-4xl font-bold text-[hsl(var(--foreground))]'>
                Mock Client
              </h1>
            </div>
            <p className='text-[hsl(var(--muted-foreground))] text-lg max-w-3xl'>
              Train your freelance discovery flow with realistic client-style
              prompts and a clean scenario layout.
            </p>
          </div>
        </div>

        <div className='px-6 py-8'>
          <div className='max-w-7xl mx-auto space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className='ui-surface-card rounded-2xl p-5'
                  >
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='p-2 rounded-lg bg-primary/10'>
                        <Icon className='w-5 h-5 text-[hsl(var(--primary))]' />
                      </div>
                      <h2 className='font-semibold text-[hsl(var(--foreground))]'>
                        {item.title}
                      </h2>
                    </div>
                    <p className='text-sm text-[hsl(var(--muted-foreground))] leading-6'>
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>

            <MockClientInteraction />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
