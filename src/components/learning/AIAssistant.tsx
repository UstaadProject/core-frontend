import { useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [messages, setMessages] = useState<
    { role: 'user' | 'ai'; content: string }[]
  >([
    {
      role: 'ai',
      content: `Hi! I'm your AI learning assistant. I'm here to help you understand "${lessonTitle || 'this lesson'}" better. Feel free to ask me anything!`,
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setMessage('');
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content:
            "That's a great question! Let me explain this concept in detail...",
        },
      ]);
    }, 1000);
  };

  return (
    <div className='flex flex-col h-full bg-[hsl(var(--card))] border-l border-[hsl(var(--border))] animate-slide-in-right'>
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-[hsl(var(--border-muted))]'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center'>
            <Sparkles className='w-5 h-5 text-[hsl(var(--primary-foreground))]' />
          </div>
          <div>
            <h3 className='font-semibold text-[hsl(var(--foreground))]'>
              AI Learning Assistant
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
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
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
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className='px-4 pb-2'>
        <div className='flex flex-wrap gap-2'>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => setMessage(prompt)}
              className='px-3 py-1.5 text-xs rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--primary)_/_0.2)] hover:text-[hsl(var(--primary))] transition-colors'
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
            placeholder='Ask anything about this lesson...'
            className='flex-1 bg-transparent text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-text))] focus:outline-none'
          />
          <button
            onClick={handleSend}
            className='p-2 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity'
          >
            <Send className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  );
}
