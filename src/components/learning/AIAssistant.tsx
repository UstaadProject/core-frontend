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
                <div className='text-[10px] uppercase tracking-wide text-[hsl(var(--muted-foreground))] mb-1'>
                  {part.language}
                </div>
              )}
              <pre className='overflow-x-auto rounded-lg bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-3 text-xs'>
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
  onClose?: () => void;
}

const quickPrompts = [
  'Explain this concept',
  'Give me an example',
  'Quiz me on this',
  'Summarize the lesson',
];

export function AIAssistant({ lessonTitle, onClose }: AIAssistantProps) {
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
      const response = await askTutor(userMessage);
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
            "I'm having trouble connecting right now. Please make sure you're viewing a lesson topic first, then I can help you better!",
        },
      ]);
      toast({
        title: 'Connection issue',
        description:
          'Make sure you have selected a lesson topic to get AI assistance.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex h-full min-h-0 flex-col bg-[hsl(var(--card))] animate-slide-in-right'>
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-[hsl(var(--border-muted))]'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-linear-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center'>
            <Sparkles className='w-5 h-5 text-[hsl(var(--primary-foreground))]' />
          </div>
          <div>
            <h3 className='font-semibold text-[hsl(var(--foreground))]'>
              Shagird
            </h3>
            <p className='text-xs text-[hsl(var(--muted-foreground))]'>
              Always here to help
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className='p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors'
          >
            <X className='w-4 h-4' />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className='min-h-0 flex-1 overflow-y-auto p-4 space-y-4'>
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
                'max-w-[85%] px-4 py-3 rounded-2xl text-sm',
                msg.role === 'user'
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-br-sm'
                  : 'bg-[hsl(var(--surface-elevated))] text-[hsl(var(--foreground))] rounded-bl-sm'
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
          <div className='flex justify-start'>
            <div className='px-4 py-3 rounded-2xl rounded-bl-sm bg-[hsl(var(--surface-elevated))]'>
              <Loader2 className='w-4 h-4 animate-spin text-[hsl(var(--muted-foreground))]' />
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className='px-4 pb-2'>
        <div className='flex flex-wrap gap-2'>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => setMessage(prompt)}
              disabled={isLoading}
              className='px-3 py-1.5 text-xs rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--primary)/0.2)] hover:text-[hsl(var(--primary))] transition-colors disabled:opacity-50'
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className='p-4 border-t border-[hsl(var(--border-muted))]'>
        <div className='flex items-center gap-2 bg-[hsl(var(--surface))] rounded-xl px-4 py-2'>
          <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder='Ask anything about your lessons...'
            disabled={isLoading}
            className='flex-1 bg-transparent text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-text))] focus:outline-none disabled:opacity-50'
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
            className='p-2 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity disabled:opacity-50'
          >
            {isLoading ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Send className='w-4 h-4' />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
