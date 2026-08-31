import { parseISO, format, isValid, isPast } from 'date-fns';

export interface RawColumnValue {
  id: string;
  text: string | null;
  value: string | null;
  type?: string;
  column?: { id: string; title: string; type: string };
}

export interface RawItem {
  id: string;
  name: string;
  updated_at?: string;
  column_values: RawColumnValue[];
}

export interface NormalizedItem {
  id: string;
  name: string;
  updatedAt: string | null;
  /** Human-friendly key → cleaned value */
  columns: Record<string, string | number | boolean | null>;
  /** Original raw key → cleaned value (for AI lookup by column id) */
  raw: Record<string, string | number | boolean | null>;
}

/* ── Helpers ──────────────────────────────────────────────── */

function parseNumber(text: string): number | null {
  // Strip currency symbols, commas, K/M suffixes
  const cleaned = text
    .replace(/[₹$€£¥,\s]/g, '')
    .replace(/K$/i, '000')
    .replace(/M$/i, '000000');
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

function parseDate(text: string): string | null {
  // Try ISO date first
  const match = text.match(/(\d{4}-\d{2}-\d{2})/);
  if (match) {
    const d = parseISO(match[1]);
    if (isValid(d)) return format(d, 'MMM d, yyyy');
  }
  // Try common formats
  const alt = new Date(text);
  if (isValid(alt)) return format(alt, 'MMM d, yyyy');
  return null;
}

function parseJsonLabel(value: string | null): string | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    // Monday status/dropdown: { "label": "..." } or { "index": n }
    if (parsed?.label) return String(parsed.label);
    if (parsed?.text)  return String(parsed.text);
    if (parsed?.name)  return String(parsed.name);
    // People: { "personsAndTeams": [{ "name": "..." }] }
    if (Array.isArray(parsed?.personsAndTeams)) {
      return parsed.personsAndTeams.map((p: any) => p.name).join(', ');
    }
  } catch {
    // not JSON
  }
  return null;
}

function normalizeColumnValue(col: RawColumnValue): string | number | null {
  const text  = col.text?.trim()  ?? '';
  const value = col.value?.trim() ?? '';
  const type  = col.type ?? col.column?.type ?? '';

  if (!text && !value) return null;

  switch (type) {
    case 'numeric':
    case 'numbers': {
      const n = parseNumber(text || value);
      return n !== null ? n : text || null;
    }

    case 'date': {
      return (parseDate(text || value) ?? text) || null;
    }

    case 'status':
    case 'color': {
      // "text" field usually has the label already
      if (text) return text;
      return parseJsonLabel(value);
    }

    case 'dropdown': {
      if (text) return text;
      return parseJsonLabel(value);
    }

    case 'people':
    case 'multiple-person': {
      if (text) return text;
      return parseJsonLabel(value);
    }

    case 'phone': {
      // Just return as string
      return text || parseJsonLabel(value);
    }

    case 'checkbox': {
      const boolVal = value === '{"checked":"true"}' || text === 'v';
      return boolVal ? 'Yes' : 'No';
    }

    case 'link': {
      if (text) return text;
      try { return (JSON.parse(value) as { url?: string })?.url ?? null; } catch { return null; }
    }

    default: {
      // For currency-looking text
      if (/[₹$€£¥]/.test(text)) {
        const n = parseNumber(text);
        if (n !== null) return n;
      }

      // For date-looking text
      if (/\d{4}-\d{2}-\d{2}/.test(text)) {
        const d = parseDate(text);
        if (d) return d;
      }

      return text || null;
    }
  }
}

/* ── Main Export ──────────────────────────────────────────── */

export function cleanMondayData(items: RawItem[]): NormalizedItem[] {
  return items.map(item => {
    const columns: Record<string, string | number | boolean | null> = {};
    const raw:     Record<string, string | number | boolean | null> = {};

    item.column_values.forEach(col => {
      const cleaned = normalizeColumnValue(col);
      const title   = col.column?.title ?? col.id;
      const key     = title.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

      columns[key]  = cleaned as any;
      raw[col.id]   = cleaned as any;
    });

    return {
      id:        item.id,
      name:      item.name,
      updatedAt: item.updated_at ? parseDate(item.updated_at) : null,
      columns,
      raw,
    };
  });
}

/* ── Analytics Helpers ────────────────────────────────────── */

export function sumColumn(items: NormalizedItem[], columnKey: string): number {
  return items.reduce((acc, item) => {
    const v = item.columns[columnKey];
    return acc + (typeof v === 'number' ? v : 0);
  }, 0);
}

export function groupBy(
  items: NormalizedItem[],
  columnKey: string
): Record<string, NormalizedItem[]> {
  const groups: Record<string, NormalizedItem[]> = {};
  for (const item of items) {
    const key = String(item.columns[columnKey] ?? 'Unknown');
    (groups[key] ??= []).push(item);
  }
  return groups;
}

export function findNumericColumn(items: NormalizedItem[]): string | null {
  if (!items.length) return null;
  const candidate = Object.keys(items[0].columns).find(k =>
    typeof items[0].columns[k] === 'number'
  );
  return candidate ?? null;
}

export function isOverdue(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return isValid(d) && isPast(d);
}
