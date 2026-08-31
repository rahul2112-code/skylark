'use client';

import { FormEvent, KeyboardEvent, useRef } from 'react';
import { SendHorizonal } from 'lucide-react';

interface ChatInputBarProps {
  input: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

export function ChatInputBar({ input, onChange, onSubmit, isLoading }: ChatInputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSubmit(e as unknown as FormEvent);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Auto-resize textarea
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    }
    onChange(e.target.value);
  };

  return (
    <div
      style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid var(--border)',
        background: 'rgba(13,17,23,0.8)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <form onSubmit={onSubmit} id="chat-form">
        <div className="chat-input-wrapper flex items-end gap-3 px-4 py-3">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about deals, pipeline, work orders, sectors... (Enter to send)"
            disabled={isLoading}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              resize: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              minHeight: 24,
              maxHeight: 160,
              overflow: 'auto',
              fontFamily: 'inherit',
            }}
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="send-btn"
            title="Send (Enter)"
          >
            <SendHorizonal size={17} color="white" />
          </button>
        </div>

        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
          Press{' '}
          <kbd style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 5px', fontSize: '0.68rem' }}>
            Enter
          </kbd>{' '}
          to send ·{' '}
          <kbd style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 5px', fontSize: '0.68rem' }}>
            Shift+Enter
          </kbd>{' '}
          for newline
        </p>
      </form>
    </div>
  );
}
