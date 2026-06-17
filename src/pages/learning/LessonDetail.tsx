import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Code,
  AlertTriangle,
  Lightbulb,
  ListTodo,
  Loader2,
  ChevronRight,
  Sparkles,
  X,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIAssistant } from '@/components/learning/AIAssistant';
import { ConfettiBurst } from '@/components/gamification';
import {
  getTopicContent,
  completeTopic,
  type TopicContent,
} from '@/services/api/learningApi';
import { useToast } from '@/hooks/use-toast';

type ContentPart =
  | { type: 'text'; value: string }
  | { type: 'code'; value: string; language?: string };

const parseContentParts = (content: string): ContentPart[] => {
  const parts: ContentPart[] = [];
  const codeRegex = /```([a-zA-Z0-9_-]+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.slice(lastIndex, match.index).trim() });
    }
    parts.push({ type: 'code', language: match[1], value: match[2].trim() });
    lastIndex = codeRegex.lastIndex;
  }
  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.slice(lastIndex).trim() });
  }
  return parts.filter((part) => part.value.length > 0);
};

const renderInlineTokens = (text: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(
        <strong key={`b-${match.index}`} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push(
        <code
          key={`c-${match.index}`}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
};

const renderTextBlock = (text: string): ReactNode[] => {
  const lines = text.split('\n').filter((line) => line.trim().length > 0);
  return lines.map((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      return (
        <h4 key={index} className="mb-1 mt-3 font-display text-base font-semibold">
          {renderInlineTokens(trimmed.replace('### ', ''))}
        </h4>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h3 key={index} className="mb-1 mt-3 font-display text-lg font-bold">
          {renderInlineTokens(trimmed.replace('## ', ''))}
        </h3>
      );
    }
    if (trimmed.startsWith('# ')) {
      return (
        <h2 key={index} className="mb-1 mt-3 font-display text-xl font-bold">
          {renderInlineTokens(trimmed.replace('# ', ''))}
        </h2>
      );
    }
    if (/^[-*]\s+/.test(trimmed)) {
      return (
        <div key={index} className="my-1 flex items-start gap-2">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
          <span>{renderInlineTokens(trimmed.replace(/^[-*]\s+/, ''))}</span>
        </div>
      );
    }
    return (
      <p key={index} className="my-1.5 leading-relaxed">
        {renderInlineTokens(trimmed)}
      </p>
    );
  });
};

function RichTextContent({ content }: { content: string }) {
  const parts = parseContentParts(content);
  return (
    <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <div key={index} className="my-3">
              {part.language && (
                <div className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {part.language}
                </div>
              )}
              <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-3 font-mono text-xs">
                <code>{part.value}</code>
              </pre>
            </div>
          );
        }
        return <div key={index}>{renderTextBlock(part.value)}</div>;
      })}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs leading-relaxed">
      <code className="text-foreground">{code}</code>
    </pre>
  );
}

function ContentSection({
  title,
  icon: Icon,
  tone = 'primary',
  children,
}: {
  title: string;
  icon: React.ElementType;
  tone?: 'primary' | 'success' | 'destructive' | 'info';
  children: React.ReactNode;
}) {
  const toneMap = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/12 text-success',
    destructive: 'bg-destructive/10 text-destructive',
    info: 'bg-info/12 text-info',
  } as const;
  return (
    <section className="scroll-mt-6">
      <div className="mb-3 flex items-center gap-2.5">
        <div className={cn('grid size-7 place-items-center rounded-lg', toneMap[tone])}>
          <Icon className="size-4" />
        </div>
        <h3 className="font-display text-lg font-bold">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export default function LessonDetail() {
  const { moduleId, topic: encodedTopic } = useParams<{
    moduleId: string;
    topic: string;
  }>();
  const topic = encodedTopic ? decodeURIComponent(encodedTopic) : '';
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [content, setContent] = useState<TopicContent | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mobileTutorOpen, setMobileTutorOpen] = useState(false);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    (async () => {
      if (!moduleId || !topic) return;
      try {
        setLoading(true);
        setContent(await getTopicContent(moduleId, topic));
      } catch (error) {
        toast({
          title: 'Failed to load content',
          description:
            error instanceof Error ? error.message : 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [moduleId, topic, toast]);

  const handleComplete = async () => {
    if (!moduleId || !topic) return;
    try {
      setCompleting(true);
      const result = await completeTopic(moduleId, topic);
      setShowConfetti(true);
      toast({
        title: result.message,
        description: `You earned ${result.xpEarned} XP! 🎉`,
      });
      setTimeout(() => navigate('/learning-path'), 1400);
    } catch (error) {
      toast({
        title: 'Failed to complete topic',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="grid h-[60vh] place-items-center">
          <div className="flex max-w-sm flex-col items-center gap-4 text-center">
            <div className="relative">
              <div className="size-14 animate-spin rounded-full border-4 border-muted border-t-primary" />
              <Sparkles className="absolute inset-0 m-auto size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">Generating content</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Shagird is preparing a personalized lesson on “{topic}”…
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!content) {
    return (
      <DashboardLayout>
        <div className="grid h-[60vh] place-items-center">
          <Card className="max-w-md text-center">
            <CardContent className="flex flex-col items-center gap-3 p-8">
              <div className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertTriangle className="size-6" />
              </div>
              <h2 className="font-display text-xl font-bold">
                Content not available
              </h2>
              <p className="text-sm text-muted-foreground">
                Unable to load content for this topic.
              </p>
              <Button onClick={() => navigate('/learning-path')} variant="outline">
                <ArrowLeft className="size-4" />
                Back to Learning Path
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {showConfetti && <ConfettiBurst />}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Main content */}
        <div className="min-w-0 animate-fade-in space-y-6">
          {/* Back link */}
          <button
            onClick={() => navigate('/learning-path')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Learning Path
          </button>

          {/* Lesson header */}
          <Card className="overflow-hidden border-none bg-gradient-to-br from-primary to-[oklch(0.5_0.12_205)] text-primary-foreground">
            <CardContent className="p-6">
              <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-primary-foreground/80">
                <span>{content.module}</span>
                <ChevronRight className="size-3.5" />
                <span className="font-medium text-primary-foreground">
                  {content.topic}
                </span>
              </div>
              <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
                {content.topic}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge className="border-none bg-white/15 capitalize text-primary-foreground">
                  {content.difficulty}
                </Badge>
                <Badge className="border-none bg-white/15 text-primary-foreground">
                  {content.module}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Body */}
          <Card>
            <CardContent className="space-y-8 p-6 sm:p-7">
              <ContentSection title="Explanation" icon={Lightbulb} tone="primary">
                <RichTextContent content={content.explanation} />
              </ContentSection>

              {content.code_examples?.length > 0 && (
                <ContentSection title="Code Examples" icon={Code} tone="info">
                  <div className="space-y-4">
                    {content.code_examples.map((example, index) => (
                      <CodeBlock key={index} code={example} />
                    ))}
                  </div>
                </ContentSection>
              )}

              {content.common_mistakes?.length > 0 && (
                <ContentSection
                  title="Common Mistakes to Avoid"
                  icon={AlertTriangle}
                  tone="destructive"
                >
                  <ul className="space-y-3">
                    {content.common_mistakes.map((mistake, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-destructive/15 text-xs text-destructive">
                          ✗
                        </span>
                        <RichTextContent content={mistake} />
                      </li>
                    ))}
                  </ul>
                </ContentSection>
              )}

              {content.best_practices?.length > 0 && (
                <ContentSection
                  title="Best Practices"
                  icon={CheckCircle2}
                  tone="success"
                >
                  <ul className="space-y-3">
                    {content.best_practices.map((practice, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/15 text-xs text-success">
                          ✓
                        </span>
                        <RichTextContent content={practice} />
                      </li>
                    ))}
                  </ul>
                </ContentSection>
              )}

              {content.practice_tasks?.length > 0 && (
                <ContentSection title="Practice Tasks" icon={ListTodo} tone="primary">
                  <ul className="space-y-3">
                    {content.practice_tasks.map((task, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 rounded-xl bg-muted/40 p-3"
                      >
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                          {index + 1}
                        </span>
                        <RichTextContent content={task} />
                      </li>
                    ))}
                  </ul>
                </ContentSection>
              )}

              {content.assignments?.length > 0 && (
                <ContentSection title="Assignments" icon={ListTodo} tone="info">
                  <ul className="space-y-3">
                    {content.assignments.map((assignment, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 rounded-xl bg-muted/40 p-3"
                      >
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-info/15 text-xs font-bold text-info">
                          {index + 1}
                        </span>
                        <RichTextContent content={assignment} />
                      </li>
                    ))}
                  </ul>
                </ContentSection>
              )}
            </CardContent>
          </Card>

          {/* Complete */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-lg font-bold">Ready to continue?</h3>
                <p className="text-sm text-muted-foreground">
                  Mark this topic complete to earn XP and unlock the next one.
                </p>
              </div>
              <Button
                onClick={handleComplete}
                disabled={completing}
                size="lg"
                className="w-full shrink-0 sm:w-auto"
              >
                {completing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Completing…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" />
                    Mark as Complete
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI tutor — desktop sticky */}
        <div className="hidden lg:block">
          <Card className="sticky top-8 flex h-[calc(100vh-7rem)] min-h-0 flex-col overflow-hidden">
            <AIAssistant
              lessonTitle={content.topic}
              moduleId={moduleId}
              topic={topic}
            />
          </Card>
        </div>
      </div>

      {/* AI tutor — mobile floating button + drawer */}
      <button
        onClick={() => setMobileTutorOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg lg:hidden"
      >
        <MessageSquare className="size-4" />
        Ask Shagird
      </button>

      {mobileTutorOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileTutorOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 flex h-[85vh] flex-col overflow-hidden rounded-t-3xl border-t border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-3">
              <span className="font-display font-bold">Shagird</span>
              <button
                onClick={() => setMobileTutorOpen(false)}
                className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <AIAssistant
                lessonTitle={content.topic}
                moduleId={moduleId}
                topic={topic}
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
