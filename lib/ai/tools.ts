/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AI Tools for Monday.com BI Agent
 *
 * Note: The `tool()` helper from the installed `ai` package has broken TypeScript
 * overloads in this version. We define the tool objects directly in the format
 * the SDK consumes at runtime (description + inputSchema + execute), which is
 * equivalent and fully type-safe at the shape level.
 */
import { z } from 'zod';
import { fetchAllBoardItems } from '@/lib/monday/fetcher';
import { groupBy, sumColumn, findNumericColumn, isOverdue } from '@/lib/monday/data-cleaner';

const DEALS_BOARD_ID    = process.env.MONDAY_DEALS_BOARD_ID    ?? '';
const WORK_ORDERS_BOARD = process.env.MONDAY_WORK_ORDERS_BOARD_ID ?? '';

function ok(data: unknown): string {
  return JSON.stringify(data, null, 2);
}
function toolErr(toolName: string, e: unknown): string {
  return JSON.stringify({
    error: `${toolName} failed`,
    message: e instanceof Error ? e.message : String(e),
    tip: 'Verify board ID and API token in .env.local',
  });
}

/* ────────────────────────────────────────────────────── */

export const tools: Record<string, any> = {
  getDealsPipeline: {
    description:
      'Fetch all deals from the Monday.com Deals board with their current stage, value, sector, owner, and metadata. Use for any question about deals, pipeline, revenue, or clients.',
    inputSchema: z.object({}),
    execute: async () => {
      try {
        const { boardName, items } = await fetchAllBoardItems(DEALS_BOARD_ID);
        return ok({ board: boardName, count: items.length, deals: items });
      } catch (e) { return toolErr('getDealsPipeline', e); }
    },
  },

  getWorkOrders: {
    description:
      'Fetch all work orders from the Monday.com Work Orders board including status, team, deadline, and progress. Use for questions about project execution or operational metrics.',
    inputSchema: z.object({}),
    execute: async () => {
      try {
        const { boardName, items } = await fetchAllBoardItems(WORK_ORDERS_BOARD);
        return ok({ board: boardName, count: items.length, workOrders: items });
      } catch (e) { return toolErr('getWorkOrders', e); }
    },
  },

  analyzeSector: {
    description:
      'Analyze the sales pipeline grouped by sector/industry. Returns deal count and total value per sector. Use for sector performance, industry focus, or vertical breakdown questions.',
    inputSchema: z.object({
      sector: z.string().optional().describe('Specific sector to focus on (e.g. "Energy"). Leave empty for all sectors.'),
    }),
    execute: async ({ sector }: { sector?: string }) => {
      try {
        const { items } = await fetchAllBoardItems(DEALS_BOARD_ID);
        if (!items.length) return ok({ error: 'No deals found. Check board ID.' });

        const sectorKey = Object.keys(items[0]?.columns ?? {}).find(k =>
          /sector|industry|vertical|segment|type/i.test(k)
        ) ?? 'name';

        const valueKey = findNumericColumn(items) ?? '';
        const grouped  = groupBy(items, sectorKey);

        const result = Object.entries(grouped)
          .filter(([grp]) => !sector || grp.toLowerCase().includes(sector.toLowerCase()))
          .map(([grp, grpItems]) => ({
            sector:     grp,
            dealCount:  grpItems.length,
            totalValue: valueKey ? sumColumn(grpItems, valueKey) : null,
            deals:      grpItems.map(i => ({ id: i.id, name: i.name, ...i.columns })),
          }))
          .sort((a, b) => (b.totalValue ?? 0) - (a.totalValue ?? 0));

        return ok({ sectorColumn: sectorKey, total: result.length, breakdown: result });
      } catch (e) { return toolErr('analyzeSector', e); }
    },
  },

  getPipelineSummary: {
    description:
      'Compute key pipeline KPIs: total value, average deal size, stage breakdown, active vs closed deals. Use for executive-level pipeline overview questions.',
    inputSchema: z.object({}),
    execute: async () => {
      try {
        const { items } = await fetchAllBoardItems(DEALS_BOARD_ID);
        if (!items.length) return ok({ error: 'No deals found. Check board ID.' });

        const valueKey = findNumericColumn(items);
        const total    = valueKey ? sumColumn(items, valueKey) : null;
        const avg      = (total && items.length) ? Math.round(total / items.length) : null;

        const stageKey = Object.keys(items[0]?.columns ?? {}).find(k =>
          /stage|status|phase|pipeline/i.test(k)
        );
        const stages = stageKey ? groupBy(items, stageKey) : {};
        const stageBreakdown = Object.entries(stages).map(([stage, si]) => ({
          stage,
          count:   si.length,
          value:   valueKey ? sumColumn(si, valueKey) : null,
          percent: `${Math.round((si.length / items.length) * 100)}%`,
        }));

        return ok({
          totalDeals:    items.length,
          pipelineValue: total,
          avgDealSize:   avg,
          stageBreakdown,
          dataQualityNote: total === null
            ? 'No numeric value column detected — check column types on the Deals board.'
            : undefined,
        });
      } catch (e) { return toolErr('getPipelineSummary', e); }
    },
  },

  getWorkOrderMetrics: {
    description:
      'Compute work order KPIs: total count, completion rate, overdue items, status distribution. Use for operational health or project progress questions.',
    inputSchema: z.object({}),
    execute: async () => {
      try {
        const { items } = await fetchAllBoardItems(WORK_ORDERS_BOARD);
        if (!items.length) return ok({ error: 'No work orders found. Check board ID.' });

        const statusKey = Object.keys(items[0]?.columns ?? {}).find(k =>
          /status|state|progress|phase/i.test(k)
        );
        const dateKey = Object.keys(items[0]?.columns ?? {}).find(k =>
          /deadline|due|end|date|delivery/i.test(k)
        );

        const statusBreakdown = statusKey ? groupBy(items, statusKey) : {};
        const overdueItems    = dateKey
          ? items.filter(item => isOverdue(String(item.columns[dateKey] ?? '')))
          : [];

        const completedStatuses = ['done', 'complete', 'completed', 'closed', 'finished'];
        const completed = statusKey
          ? items.filter(item =>
              completedStatuses.some(s =>
                String(item.columns[statusKey] ?? '').toLowerCase().includes(s)
              )
            )
          : [];

        return ok({
          totalWorkOrders:    items.length,
          completedCount:     completed.length,
          completionRate:     `${Math.round((completed.length / items.length) * 100)}%`,
          overdueCount:       overdueItems.length,
          overdueItems:       overdueItems.slice(0, 10).map(i => ({ name: i.name, ...i.columns })),
          statusDistribution: Object.entries(statusBreakdown).map(([status, si]) => ({
            status,
            count:   si.length,
            percent: `${Math.round((si.length / items.length) * 100)}%`,
          })),
        });
      } catch (e) { return toolErr('getWorkOrderMetrics', e); }
    },
  },

  crossBoardAnalysis: {
    description:
      'Compare data across both Deals and Work Orders boards to find overlapping clients, correlate pipeline with execution, or identify cross-board patterns.',
    inputSchema: z.object({}),
    execute: async () => {
      try {
        const [dealsResult, woResult] = await Promise.all([
          fetchAllBoardItems(DEALS_BOARD_ID),
          fetchAllBoardItems(WORK_ORDERS_BOARD),
        ]);

        const dealNames = dealsResult.items.map(d => d.name.toLowerCase());
        const overlap   = woResult.items.filter(wo =>
          dealNames.some(dn =>
            dn.includes(wo.name.toLowerCase()) || wo.name.toLowerCase().includes(dn)
          )
        );

        const valueKey   = findNumericColumn(dealsResult.items);
        const totalValue = valueKey ? sumColumn(dealsResult.items, valueKey) : null;

        return ok({
          summary: {
            totalDeals:      dealsResult.items.length,
            totalWorkOrders: woResult.items.length,
            clientsInBoth:   overlap.length,
            pipelineValue:   totalValue,
          },
          clientsWithBothDealAndWorkOrder: overlap.slice(0, 20).map(wo => ({
            name: wo.name,
            workOrderDetails: wo.columns,
          })),
          sampleDeals:      dealsResult.items.slice(0, 30),
          sampleWorkOrders: woResult.items.slice(0, 30),
        });
      } catch (e) { return toolErr('crossBoardAnalysis', e); }
    },
  },
};
