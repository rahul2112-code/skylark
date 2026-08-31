'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BrainCircuit, User, Database, CheckCircle2, Loader2 } from 'lucide-react';

interface MessageBubbleProps {
  message: any;
  isLatest: boolean;
}

function ToolInvocationCard({ invocation }: { invocation: any }) {
  const toolLabels: Record<string, string> = {
    getDealsPipeline:     '📊 Fetching Deals Pipeline',
    getWorkOrders:        '🔧 Fetching Work Orders',
    analyzeSector:        '🏭 Analyzing Sector',
    getPipelineSummary:   '💰 Computing Pipeline Summary',
    getWorkOrderMetrics:  '📈 Computing Work Order Metrics',
    crossBoardAnalysis:   '🔗 Cross-Board Analysis',
  };

  const label = toolLabels[invocation.toolName] ?? `⚙️ ${invocation.toolName}`;
  const done  = invocation.state === 'result';

  return (
    <div className="tool-card" style={{ marginTop: 6, marginBottom: 4, width: 'fit-content', maxWidth: '100%' }}>
      {done
        ? <CheckCircle2 size={12} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
        : <Loader2 size={12} style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }} />}
      <span>{label}</span>
      {done && <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>· done</span>}
    </div>
  );
}

export function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  /* Derive text content — handle both older string .content and newer parts[] */
  let textContent = '';
  if (typeof message.content === 'string') {
    textContent = message.content;
  } else if (Array.isArray(message.parts)) {
    textContent = message.parts
      .filter((p: any) => p.type === 'text')
      .map((p: any) => p.text)
      .join('');
  }

  /* Tool invocations */
  const toolInvocations: any[] =
    message.toolInvocations ?? message.parts?.filter((p: any) => p.type === 'tool-invocation') ?? [];

  return (
    <div
      className={`flex gap-3 animate-fade-in-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ animationDelay: `${isLatest ? 0 : 0}ms` }}
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full"
        style={{
          width: 36,
          height: 36,
          background: isUser ? 'var(--gradient-message)' : 'var(--bg-card)',
          border: isUser ? 'none' : '1px solid var(--border)',
          boxShadow: isUser ? '0 2px 12px rgba(99,102,241,0.4)' : 'none',
          marginTop: 2,
          alignSelf: 'flex-start',
        }}
      >
        {isUser ? (
          <User size={16} color="white" />
        ) : (
          <BrainCircuit size={16} style={{ color: 'var(--accent-primary)' }} />
        )}
      </div>

      {/* Bubble */}
      <div
        style={{
          maxWidth: '75%',
          ...(isUser
            ? {
                background: 'var(--gradient-message)',
                borderRadius: '18px 4px 18px 18px',
                padding: '0.75rem 1rem',
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
              }
            : {
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '4px 18px 18px 18px',
                padding: '0.875rem 1.125rem',
              }),
        }}
      >
        {/* Tool invocations at top of AI message */}
        {!isUser && toolInvocations.length > 0 && (
          <div className="mb-3 space-y-1">
            {toolInvocations.map((inv: any, i: number) => (
              <ToolInvocationCard
                key={inv.toolCallId ?? i}
                invocation={inv.toolInvocation ?? inv}
              />
            ))}
          </div>
        )}

        {/* Text content */}
        {textContent && (
          isUser ? (
            <p style={{ color: 'white', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              {textContent}
            </p>
          ) : (
            <div className="prose-ai">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {textContent}
              </ReactMarkdown>
            </div>
          )
        )}

        {/* Timestamp */}
        <div
          style={{
            fontSize: '0.68rem',
            color: isUser ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)',
            marginTop: 6,
            textAlign: isUser ? 'right' : 'left',
          }}
        >
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
