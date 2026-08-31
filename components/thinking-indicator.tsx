'use client';

import { BrainCircuit } from 'lucide-react';

export function ThinkingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in-up">
      {/* AI Avatar */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full"
        style={{
          width: 36,
          height: 36,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          alignSelf: 'flex-start',
          marginTop: 2,
        }}
      >
        <BrainCircuit size={16} style={{ color: 'var(--accent-primary)' }} />
      </div>

      {/* Thinking bubble */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '4px 18px 18px 18px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginRight: 4 }}>
          Analyzing
        </span>
        <span className="thinking-dot" />
        <span className="thinking-dot" />
        <span className="thinking-dot" />
      </div>
    </div>
  );
}
