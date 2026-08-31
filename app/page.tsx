'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { MessageBubble } from '@/components/message-bubble';
import { ThinkingIndicator } from '@/components/thinking-indicator';
import { ChatInputBar } from '@/components/chat-input';
import { BrainCircuit, Layers, Zap } from 'lucide-react';

export default function Home() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  // useChat v4+ API: uses sendMessage + status
  const { messages, sendMessage, status, error } = (useChat as any)({
    api: '/api/chat',
  }) as any;

  const isLoading = status === 'streaming' || status === 'submitted';

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    sendMessage({ role: 'user', content: text });
    setInput('');
  };

  const handleSuggestedQuery = (query: string) => {
    if (isLoading) return;
    sendMessage({ role: 'user', content: query });
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-base)' }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{
          borderColor: 'var(--border)',
          background: 'rgba(13,17,23,0.9)',
          backdropFilter: 'blur(24px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-glow)' }}
          >
            <BrainCircuit size={18} color="white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-gradient font-bold text-lg leading-none">Skylark BI Agent</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 2 }}>
              Powered by Gemini · Monday.com
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge badge-green">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
          <span className="badge badge-indigo">
            <Layers size={10} />
            2 Boards
          </span>
          <span className="badge badge-amber">
            <Zap size={10} />
            AI Ready
          </span>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onSuggestedQuery={handleSuggestedQuery} isLoading={isLoading} />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-2">
            {/* Empty state */}
            {(!messages || messages.length === 0) && (
              <div
                className="flex flex-col items-center justify-center h-full text-center animate-fade-in"
                style={{ paddingBottom: '4rem' }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: 'var(--gradient-hero)',
                    boxShadow: '0 0 60px rgba(99,102,241,0.3)',
                  }}
                >
                  <BrainCircuit size={36} color="white" />
                </div>
                <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Ask me anything
                </h2>
                <p className="max-w-md" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  I can analyze your deals pipeline, work order status, sector performance,
                  revenue forecasts, and operational metrics — all from your Monday.com boards.
                </p>
              </div>
            )}

            {/* Messages list */}
            {messages && messages.map((msg: any, idx: number) => (
              <MessageBubble key={msg.id} message={msg} isLatest={idx === messages.length - 1} />
            ))}

            {/* Thinking indicator */}
            {isLoading && <ThinkingIndicator />}

            {error && !isLoading && (
              <div
                role="alert"
                className="max-w-2xl rounded-lg px-4 py-3"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#fca5a5',
                }}
              >
                Unable to generate a response. Please try again.
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <ChatInputBar
            input={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </main>
      </div>
    </div>
  );
}
