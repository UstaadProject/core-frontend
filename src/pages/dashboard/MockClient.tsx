import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { MockClientInteraction } from '@/components/freelance/MockClientInteraction';
import { MessageSquareQuote, Sparkles, ShieldCheck, MessageSquare } from 'lucide-react';

const highlights = [
  {
    icon: MessageSquareQuote,
    title: 'Client Realism',
    text: 'Practice with structured freelance scenarios that feel closer to a real discovery call.',
    tone: 'bg-primary/10 text-primary',
  },
  {
    icon: Sparkles,
    title: 'Sharper Prompts',
    text: 'Keep questions focused so the conversation moves toward scope, outcomes and deliverables.',
    tone: 'bg-info/12 text-info',
  },
  {
    icon: ShieldCheck,
    title: 'Safer Practice',
    text: 'Test your communication style before taking it into a live client conversation.',
    tone: 'bg-success/12 text-success',
  },
];

export default function MockClient() {
  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <MessageSquare className="size-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
              Mock Client Interaction
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Train your discovery flow with realistic client-style prompts and feedback.
            </p>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title}>
                <CardContent className="p-5">
                  <div className={`mb-3 grid size-10 w-fit place-items-center rounded-xl ${item.tone}`}>
                    <Icon className="size-5" />
                  </div>
                  <h2 className="mb-1 text-sm font-bold">{item.title}</h2>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Interaction */}
        <MockClientInteraction />
      </div>
    </DashboardLayout>
  );
}
