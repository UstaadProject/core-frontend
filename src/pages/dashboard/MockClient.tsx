import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MockClientInteraction } from '@/components/freelance/MockClientInteraction';
import { MessageSquareQuote, Sparkles, ShieldCheck, MessageSquare } from 'lucide-react';

const highlights = [
  {
    icon: MessageSquareQuote,
    title: 'Client Realism',
    text: 'Practice with structured freelance scenarios that feel closer to a real discovery call.',
    color: 'icon-bubble-primary',
    iconColor: 'text-[hsl(var(--primary))]',
  },
  {
    icon: Sparkles,
    title: 'Sharper Prompts',
    text: 'Keep your questions focused so the conversation moves toward scope, outcomes, and deliverables.',
    color: 'icon-bubble-accent',
    iconColor: 'text-[hsl(var(--accent))]',
  },
  {
    icon: ShieldCheck,
    title: 'Safer Practice',
    text: 'Test your communication style before you take it into a live client conversation.',
    color: 'icon-bubble-success',
    iconColor: 'text-[hsl(var(--success))]',
  },
];

export default function MockClient() {
  return (
    <DashboardLayout>
      <div className='max-w-7xl mx-auto'>
        {/* Page banner */}
        <div className='page-banner'>
          <div className='flex items-center gap-4'>
            <div
              className='p-3 rounded-xl'
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--primary)/0.2), hsl(var(--accent)/0.15))',
              }}
            >
              <MessageSquare className='w-6 h-6 text-[hsl(var(--primary))]' />
            </div>
            <div>
              <h1 className='text-3xl font-extrabold font-display text-[hsl(var(--foreground))]'>
                Mock Client Interaction
              </h1>
              <p className='text-[hsl(var(--muted-foreground))] text-sm mt-0.5'>
                Train your freelance discovery flow with realistic client-style prompts and structured feedback.
              </p>
            </div>
          </div>
        </div>

        <div className='p-8 space-y-6 animate-fade-in'>
          {/* Highlights */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className='stat-card p-5 rounded-2xl animate-slide-up'
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className={`icon-bubble ${item.color} mb-4 w-fit`}>
                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <h2 className='font-bold text-sm text-[hsl(var(--foreground))] mb-1.5'>
                    {item.title}
                  </h2>
                  <p className='text-[12px] text-[hsl(var(--muted-foreground))] leading-relaxed'>
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Main interaction */}
          <MockClientInteraction />
        </div>
      </div>
    </DashboardLayout>
  );
}
