import { useMemo, useState } from 'react';
import { BadgeCheck, Briefcase, MessageCircle, Target } from 'lucide-react';

type Scenario = {
  id: string;
  title: string;
  client: string;
  project: string;
  opening: string;
  focus: string;
  successCriteria: string[];
};

const SCENARIOS: Scenario[] = [
  {
    id: 'startup-landing',
    title: 'Startup landing page',
    client: 'A first-time founder',
    project: 'Launch a simple landing page for a new product.',
    opening:
      'We need a page that explains the product clearly and helps people sign up fast.',
    focus: 'Discovery, CTA placement, and launch scope',
    successCriteria: [
      'Clarify the audience',
      'Identify the primary CTA',
      'Define the deadline and budget',
    ],
  },
  {
    id: 'ecommerce-refresh',
    title: 'E-commerce refresh',
    client: 'A small shop owner',
    project: 'Improve the store UI and mobile checkout flow.',
    opening:
      'Sales are okay, but the site feels slow and the cart experience is confusing.',
    focus: 'Performance, trust signals, and checkout friction',
    successCriteria: [
      'Ask about conversion bottlenecks',
      'Understand product volume',
      'Confirm current tech stack',
    ],
  },
  {
    id: 'portfolio-build',
    title: 'Portfolio build',
    client: 'A creative professional',
    project: 'Design a modern personal portfolio with case studies.',
    opening:
      'I want something polished, but I also want to be able to edit it later without trouble.',
    focus: 'Content structure, maintainability, and handoff',
    successCriteria: [
      'Define content sections',
      'Decide on editing workflow',
      'Check hosting preferences',
    ],
  },
];

export function MockClientInteraction() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(
    SCENARIOS[0]?.id || ''
  );

  const selectedScenario = useMemo(
    () =>
      SCENARIOS.find((scenario) => scenario.id === selectedScenarioId) ||
      SCENARIOS[0],
    [selectedScenarioId]
  );

  if (!selectedScenario) {
    return null;
  }

  return (
    <div className='grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6'>
      <div className='ui-surface-card rounded-3xl p-6 space-y-6'>
        <div>
          <div className='flex items-center gap-2 mb-2'>
            <MessageCircle className='w-5 h-5 text-[hsl(var(--primary))]' />
            <h2 className='text-2xl font-bold text-[hsl(var(--foreground))]'>
              Scenario Picker
            </h2>
          </div>
          <p className='text-sm text-[hsl(var(--muted-foreground))] max-w-2xl'>
            Choose a client situation, then practice the questions you would ask
            before starting the work.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {SCENARIOS.map((scenario) => {
            const isActive = scenario.id === selectedScenarioId;

            return (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenarioId(scenario.id)}
                className={`text-left rounded-2xl border p-4 transition-all duration-200 ${
                  isActive
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                    : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-primary/40'
                }`}
              >
                <div className='flex items-center gap-2 mb-3'>
                  <Briefcase className='w-4 h-4 text-[hsl(var(--primary))]' />
                  <span className='font-semibold text-sm text-[hsl(var(--foreground))]'>
                    {scenario.title}
                  </span>
                </div>
                <p className='text-xs text-[hsl(var(--muted-foreground))]'>
                  {scenario.client}
                </p>
                <p className='mt-2 text-sm text-[hsl(var(--foreground))] leading-6'>
                  {scenario.project}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className='ui-surface-card rounded-3xl p-6 space-y-5'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h3 className='text-xl font-bold text-[hsl(var(--foreground))]'>
              {selectedScenario.title}
            </h3>
            <p className='text-sm text-[hsl(var(--muted-foreground))] mt-1'>
              {selectedScenario.client}
            </p>
          </div>
          <div className='rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary'>
            Practice call
          </div>
        </div>

        <div className='rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-5 space-y-4'>
          <div>
            <div className='text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]'>
              Opening message
            </div>
            <p className='mt-2 text-sm leading-7 text-[hsl(var(--foreground))]'>
              {selectedScenario.opening}
            </p>
          </div>

          <div>
            <div className='text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]'>
              What to clarify
            </div>
            <p className='mt-2 text-sm leading-7 text-[hsl(var(--foreground))]'>
              {selectedScenario.focus}
            </p>
          </div>
        </div>

        <div>
          <div className='flex items-center gap-2 mb-3'>
            <Target className='w-4 h-4 text-[hsl(var(--primary))]' />
            <h4 className='font-semibold text-[hsl(var(--foreground))]'>
              Success Criteria
            </h4>
          </div>
          <div className='space-y-3'>
            {selectedScenario.successCriteria.map((criterion) => (
              <div
                key={criterion}
                className='flex items-start gap-3 rounded-xl border border-[hsl(var(--border))] px-4 py-3'
              >
                <BadgeCheck className='mt-0.5 w-4 h-4 text-success' />
                <p className='text-sm text-[hsl(var(--foreground))] leading-6'>
                  {criterion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
