import { useState } from 'react';
import { Sparkles, Send, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { askTutor } from '@/services/api/learningApi';
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

const renderTextBlock = (text: string) => {
  const lines = text.split('\n').filter((line) => line.trim().length > 0);

  return lines.map((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('### ')) {
      return (
        <h4 key={index} className='text-sm font-semibold mt-2 mb-1'>
          {trimmed.replace('### ', '')}
        </h4>
      );
    }

    if (trimmed.startsWith('## ')) {
      return (
        <h3 key={index} className='text-base font-semibold mt-2 mb-1'>
          {trimmed.replace('## ', '')}
        </h3>
      );
    }

    if (trimmed.startsWith('# ')) {
      return (
        <h2 key={index} className='text-lg font-bold mt-2 mb-1'>
          {trimmed.replace('# ', '')}
        </h2>
      );
    }

    if (/^[-*]\s+/.test(trimmed)) {
      return (
        <div key={index} className='flex items-start gap-2 my-1'>
          <span>•</span>
          <span>{trimmed.replace(/^[-*]\s+/, '')}</span>
        </div>
      );
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      return (
        <div key={index} className='my-1'>
          {trimmed}
        </div>
      );
    }

    return (
      <p key={index} className='my-1 whitespace-pre-wrap leading-relaxed'>
        {trimmed}
      </p>
    );
  });
};

function MessageContent({ content }: { content: string }) {
  const parts = parseContentParts(content);

  return (
    <div className='space-y-2'>
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <div key={index} className='my-2'>
              {part.language && (
                <div className='mb-1 text-[10px] uppercase tracking-wide text-muted-foreground'>
                  {part.language}
                </div>
              )}
              <pre className='overflow-x-auto rounded-lg border border-border bg-background p-3 font-mono text-xs'>
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

interface AIAssistantProps {
  lessonTitle?: string;
  moduleId?: string;
  topic?: string;
  onClose?: () => void;
}

const quickPrompts = [
  'Explain this concept',
  'Give me an example',
  'Quiz me on this',
  'Summarize the lesson',
];

export function AIAssistant({
  lessonTitle,
  moduleId,
  topic,
  onClose,
}: AIAssistantProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [messages, setMessages] = useState<
    { role: 'user' | 'ai'; content: string }[]
  >([
    {
      role: 'ai',
      content: `Hi! I'm your AI learning assistant. I'm here to help you with your web development journey. Feel free to ask me anything about ${lessonTitle || 'your lessons'}!`,
    },
  ]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await askTutor(userMessage, { moduleId, topic });
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content:
            response.content ||
            "I'm sorry, I couldn't process your question. Please try again.",
        },
      ]);
    } catch (error) {
      // Fallback to a helpful response if API fails
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content:
            "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
      toast({
        title: 'Connection issue',
        description: 'Could not reach Shagird right now. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h3 className="font-display font-bold leading-tight">Shagird</h3>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" />
              Your AI tutor · online
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              'flex',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                msg.role === 'user'
                  ? 'rounded-br-md bg-primary text-primary-foreground'
                  : 'rounded-bl-md bg-muted text-foreground'
              )}
            >
              {msg.role === 'ai' ? (
                <MessageContent content={msg.content} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 pb-2">
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => setMessage(prompt)}
              disabled={isLoading}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-primary disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/30">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Shagird anything..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
            className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
