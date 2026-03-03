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
  Folder,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LearningLayout } from '@/components/layout/LearningLayout';
import { Button } from '@/components/ui/button';
import { AIAssistant } from '@/components/learning/AIAssistant';
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
      parts.push({
        type: 'text',
        value: content.slice(lastIndex, match.index).trim(),
      });
    }

    parts.push({
      type: 'code',
      language: match[1],
      value: match[2].trim(),
    });

    lastIndex = codeRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      value: content.slice(lastIndex).trim(),
    });
  }

  return parts.filter((part) => part.value.length > 0);
};

const renderInlineTokens = (text: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(
        <strong key={`b-${match.index}`} className='font-semibold'>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push(
        <code
          key={`c-${match.index}`}
          className='rounded bg-[hsl(var(--background))] px-1 py-0.5 text-[0.85em] text-[hsl(var(--foreground))]'
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
};

const renderTextBlock = (text: string): ReactNode[] => {
  const lines = text.split('\n').filter((line) => line.trim().length > 0);

  return lines.map((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('### ')) {
      return (
        <h4 key={index} className='text-base font-semibold mt-2 mb-1'>
          {renderInlineTokens(trimmed.replace('### ', ''))}
        </h4>
      );
    }

    if (trimmed.startsWith('## ')) {
      return (
        <h3 key={index} className='text-lg font-semibold mt-2 mb-1'>
          {renderInlineTokens(trimmed.replace('## ', ''))}
        </h3>
      );
    }

    if (trimmed.startsWith('# ')) {
      return (
        <h2 key={index} className='text-xl font-bold mt-2 mb-1'>
          {renderInlineTokens(trimmed.replace('# ', ''))}
        </h2>
      );
    }

    if (/^[-*]\s+/.test(trimmed)) {
      return (
        <div key={index} className='flex items-start gap-2 my-1'>
          <span>•</span>
          <span>{renderInlineTokens(trimmed.replace(/^[-*]\s+/, ''))}</span>
        </div>
      );
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      return (
        <p key={index} className='my-1 whitespace-pre-wrap leading-relaxed'>
          {renderInlineTokens(trimmed)}
        </p>
      );
    }

    return (
      <p key={index} className='my-1 whitespace-pre-wrap leading-relaxed'>
        {renderInlineTokens(trimmed)}
      </p>
    );
  });
};

function RichTextContent({ content }: { content: string }) {
  const parts = parseContentParts(content);

  return (
    <div className='space-y-2'>
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <div key={index} className='my-2'>
              {part.language && (
                <div className='text-[10px] uppercase tracking-wide text-[hsl(var(--muted-foreground))] mb-1'>
                  {part.language}
                </div>
              )}
              <pre className='overflow-x-auto rounded-lg bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-3 text-sm'>
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

// Simple code formatter component
function CodeBlock({ code }: { code: string }) {
  return (
    <pre className='bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg p-4 overflow-x-auto text-sm'>
      <code className='text-[hsl(var(--foreground))]'>{code}</code>
    </pre>
  );
}

// Section component for consistent styling
function ContentSection({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-6',
        className
      )}
    >
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-8 h-8 rounded-lg bg-[hsl(var(--primary)/0.1)] flex items-center justify-center'>
          <Icon className='w-4 h-4 text-[hsl(var(--primary))]' />
        </div>
        <h3 className='font-semibold text-lg text-[hsl(var(--foreground))]'>
          {title}
        </h3>
      </div>
      {children}
    </div>
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
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchContent = async () => {
      if (!moduleId || !topic) return;

      try {
        setLoading(true);
        const data = await getTopicContent(moduleId, topic);
        setContent(data);
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
    };

    fetchContent();
  }, [moduleId, topic, toast]);

  const handleComplete = async () => {
    if (!moduleId || !topic) return;

    try {
      setCompleting(true);
      const result = await completeTopic(moduleId, topic);
      toast({
        title: result.message,
        description: `You earned ${result.xpEarned} XP!`,
      });
      navigate('/learning-path');
    } catch (error) {
      toast({
        title: 'Failed to complete topic',
        description:
          error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <LearningLayout>
        <div className='flex items-center justify-center h-screen'>
          <div className='flex flex-col items-center gap-4 text-center'>
            <Loader2 className='w-8 h-8 animate-spin text-[hsl(var(--primary))]' />
            <div>
              <h2 className='text-xl font-semibold text-[hsl(var(--foreground))]'>
                Generating Content
              </h2>
              <p className='text-[hsl(var(--muted-foreground))] mt-1'>
                Our AI is creating personalized content for "{topic}"...
              </p>
              <p className='text-sm text-[hsl(var(--muted-foreground))] mt-2'>
                This may take a moment
              </p>
            </div>
          </div>
        </div>
      </LearningLayout>
    );
  }

  if (!content) {
    return (
      <LearningLayout>
        <div className='flex items-center justify-center h-screen'>
          <div className='flex flex-col items-center gap-4 text-center'>
            <AlertTriangle className='w-12 h-12 text-[hsl(var(--destructive))]' />
            <h2 className='text-xl font-semibold text-[hsl(var(--foreground))]'>
              Content Not Available
            </h2>
            <p className='text-[hsl(var(--muted-foreground))]'>
              Unable to load content for this topic.
            </p>
            <Button
              onClick={() => navigate('/learning-path')}
              variant='outline'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Learning Path
            </Button>
          </div>
        </div>
      </LearningLayout>
    );
  }

  return (
    <LearningLayout>
      <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 p-6 lg:p-8 h-full'>
        <div className='min-h-0 overflow-y-auto pr-1'>
          <Button
            onClick={() => navigate('/learning-path')}
            variant='outline'
            className='mb-4'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Learning Path
          </Button>

          {/* Breadcrumb */}
          <div className='flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] mb-6'>
            <button
              onClick={() => navigate('/learning-path')}
              className='hover:text-[hsl(var(--foreground))] transition-colors'
            >
              Learning Path
            </button>
            <ChevronRight className='w-4 h-4' />
            <span>{content.module}</span>
            <ChevronRight className='w-4 h-4' />
            <span className='text-[hsl(var(--foreground))]'>
              {content.topic}
            </span>
          </div>

          {/* Header */}
          <div className='mb-8 animate-fade-in'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='ui-chip bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))] border-[hsl(var(--primary)/0.3)]'>
                {content.difficulty}
              </span>
              <span className='ui-chip'>{content.module}</span>
            </div>
            <h1 className='ui-page-title'>{content.topic}</h1>
          </div>

          {/* Main Content */}
          <div className='space-y-6'>
            {/* Explanation */}
            <ContentSection title='Explanation' icon={Lightbulb}>
              <div className='prose prose-invert max-w-none'>
                <div className='text-[hsl(var(--foreground))]'>
                  <RichTextContent content={content.explanation} />
                </div>
              </div>
            </ContentSection>

            {/* Code Examples */}
            {content.code_examples && content.code_examples.length > 0 && (
              <ContentSection title='Code Examples' icon={Code}>
                <div className='space-y-4'>
                  {content.code_examples.map((example, index) => (
                    <CodeBlock key={index} code={example} />
                  ))}
                </div>
              </ContentSection>
            )}

            {/* Common Mistakes */}
            {content.common_mistakes && content.common_mistakes.length > 0 && (
              <ContentSection
                title='Common Mistakes to Avoid'
                icon={AlertTriangle}
              >
                <ul className='space-y-2'>
                  {content.common_mistakes.map((mistake, index) => (
                    <li
                      key={index}
                      className='flex items-start gap-3 text-[hsl(var(--foreground))]'
                    >
                      <span className='w-5 h-5 rounded-full bg-[hsl(var(--destructive)/0.2)] flex items-center justify-center shrink-0 mt-0.5'>
                        <span className='text-xs text-[hsl(var(--destructive))]'>
                          ✗
                        </span>
                      </span>
                      <div>
                        <RichTextContent content={mistake} />
                      </div>
                    </li>
                  ))}
                </ul>
              </ContentSection>
            )}

            {/* Best Practices */}
            {content.best_practices && content.best_practices.length > 0 && (
              <ContentSection title='Best Practices' icon={CheckCircle2}>
                <ul className='space-y-2'>
                  {content.best_practices.map((practice, index) => (
                    <li
                      key={index}
                      className='flex items-start gap-3 text-[hsl(var(--foreground))]'
                    >
                      <span className='w-5 h-5 rounded-full bg-[hsl(var(--success)/0.2)] flex items-center justify-center shrink-0 mt-0.5'>
                        <span className='text-xs text-[hsl(var(--success))]'>
                          ✓
                        </span>
                      </span>
                      <div>
                        <RichTextContent content={practice} />
                      </div>
                    </li>
                  ))}
                </ul>
              </ContentSection>
            )}

            {/* Practice Tasks */}
            {content.practice_tasks && content.practice_tasks.length > 0 && (
              <ContentSection title='Practice Tasks' icon={ListTodo}>
                <ul className='space-y-3'>
                  {content.practice_tasks.map((task, index) => (
                    <li
                      key={index}
                      className='flex items-start gap-3 p-3 bg-[hsl(var(--muted)/0.3)] rounded-lg'
                    >
                      <span className='w-6 h-6 rounded-full bg-[hsl(var(--primary)/0.2)] flex items-center justify-center shrink-0 text-xs font-medium text-[hsl(var(--primary))]'>
                        {index + 1}
                      </span>
                      <div className='text-[hsl(var(--foreground))]'>
                        <RichTextContent content={task} />
                      </div>
                    </li>
                  ))}
                </ul>
              </ContentSection>
            )}

            {/* Mini Project */}
            {content.mini_project && (
              <ContentSection title='Mini Project' icon={Folder}>
                <div className='p-4 bg-[hsl(var(--primary)/0.05)] border border-[hsl(var(--primary)/0.2)] rounded-lg'>
                  <div className='text-[hsl(var(--foreground))]'>
                    <RichTextContent content={content.mini_project} />
                  </div>
                </div>
              </ContentSection>
            )}

            {/* Assignments */}
            {content.assignments && content.assignments.length > 0 && (
              <ContentSection title='Assignments' icon={ListTodo}>
                <ul className='space-y-3'>
                  {content.assignments.map((assignment, index) => (
                    <li
                      key={index}
                      className='flex items-start gap-3 p-3 bg-[hsl(var(--secondary)/0.1)] border border-[hsl(var(--secondary)/0.2)] rounded-lg'
                    >
                      <span className='w-6 h-6 rounded-full bg-[hsl(var(--secondary)/0.2)] flex items-center justify-center shrink-0 text-xs font-medium text-[hsl(var(--secondary))]'>
                        {index + 1}
                      </span>
                      <div className='text-[hsl(var(--foreground))]'>
                        <RichTextContent content={assignment} />
                      </div>
                    </li>
                  ))}
                </ul>
              </ContentSection>
            )}
          </div>

          {/* Complete Button */}
          <div className='ui-surface-card mt-8 flex items-center justify-between p-6'>
            <div>
              <h3 className='font-semibold text-[hsl(var(--foreground))]'>
                Ready to continue?
              </h3>
              <p className='text-sm text-[hsl(var(--muted-foreground))]'>
                Mark this topic as complete to earn XP and unlock the next
                topic.
              </p>
            </div>
            <Button
              onClick={handleComplete}
              disabled={completing}
              variant='gradient'
              size='lg'
            >
              {completing ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle2 className='w-4 h-4 mr-2' />
                  Mark as Complete
                </>
              )}
            </Button>
          </div>
        </div>

        <div className='hidden lg:block h-full min-h-0'>
          <div className='sticky top-4 h-[calc(100vh-2rem)] min-h-0 overflow-hidden rounded-xl border border-[hsl(var(--border))]'>
            <AIAssistant lessonTitle={content.topic} />
          </div>
        </div>
      </div>
    </LearningLayout>
  );
}
