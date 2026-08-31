'use client';

import { MessageSquare, TrendingUp, BarChart3, Briefcase, Zap, Clock, DollarSign } from 'lucide-react';

const SUGGESTED_QUERIES = [
  { icon: TrendingUp,    label: 'Pipeline Overview',       query: "What's the total pipeline value and how many active deals do we have?" },
  { icon: BarChart3,     label: 'Sector Performance',      query: 'Which sectors are performing best this quarter in terms of deal value?' },
  { icon: Briefcase,     label: 'Work Order Status',       query: 'Give me a summary of work order completion rates and any overdue items.' },
  { icon: DollarSign,    label: 'Revenue Forecast',        query: 'What revenue can we expect from deals in the negotiation or proposal stage?' },
  { icon: Clock,         label: 'Overdue Work Orders',     query: 'Which work orders are overdue or at risk of missing their deadline?' },
  { icon: Zap,           label: 'Cross-board Insights',    query: 'Are there clients with active deals who also have ongoing work orders?' },
];

interface SidebarProps {
  onSuggestedQuery: (query: string) => void;
  isLoading: boolean;
}

export function Sidebar({ onSuggestedQuery, isLoading }: SidebarProps) {
  return (
    <aside
      className="flex flex-col border-r overflow-y-auto"
      style={{
        width: 240,
        minWidth: 240,
        borderColor: 'var(--border)',
        background: 'var(--bg-surface)',
        flexShrink: 0,
      }}
    >
      {/* Quick Actions */}
      <div className="p-4">
        <div
          className="flex items-center gap-2 mb-3"
          style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          <MessageSquare size={11} />
          Suggested Questions
        </div>

        <div className="space-y-1.5">
          {SUGGESTED_QUERIES.map(({ icon: Icon, label, query }) => (
            <button
              key={label}
              onClick={() => !isLoading && onSuggestedQuery(query)}
              disabled={isLoading}
              className="sidebar-item w-full text-left"
            >
              <div className="flex items-start gap-2.5">
                <Icon size={13} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: 1 }} />
                <span>{label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)', margin: '0 1rem' }} />

      {/* Data Sources */}
      <div className="p-4">
        <div
          className="flex items-center gap-2 mb-3"
          style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          <Briefcase size={11} />
          Data Sources
        </div>

        <div className="space-y-2">
          <div
            className="glass rounded-xl p-3"
            style={{ fontSize: '0.78rem' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Deals Board</span>
              <span className="badge badge-green">Live</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Sales pipeline data</p>
          </div>

          <div
            className="glass rounded-xl p-3"
            style={{ fontSize: '0.78rem' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Work Orders</span>
              <span className="badge badge-green">Live</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Project execution data</p>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-auto p-4">
        <div
          className="glass rounded-xl p-3 text-center"
          style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}
        >
          Data fetched live from Monday.com on every query
        </div>
      </div>
    </aside>
  );
}
