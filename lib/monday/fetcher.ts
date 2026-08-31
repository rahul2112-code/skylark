/* eslint-disable @typescript-eslint/no-explicit-any */
import { mondayClient } from './client';
import { GET_BOARD_ITEMS_PAGE } from './queries';
import { cleanMondayData, type NormalizedItem, type RawItem } from './data-cleaner';

interface PageResult {
  cursor: string | null;
  items: RawItem[];
}

interface BoardPageResponse {
  boards: Array<{
    id: string;
    name: string;
    columns: Array<{ id: string; title: string; type: string }>;
    items_page: PageResult;
  }>;
}

/**
 * Fetch ALL items from a Monday.com board using cursor-based pagination.
 * Stops after maxPages iterations (safety limit).
 */
export async function fetchAllBoardItems(
  boardId: string,
  maxPages = 10
): Promise<{ boardName: string; items: NormalizedItem[] }> {
  let cursor: string | null = null;
  const allRawItems: RawItem[] = [];
  let boardName = '';
  let page = 0;

  do {
    const response: any = await mondayClient.request(GET_BOARD_ITEMS_PAGE, {
      boardId,
      cursor: cursor ?? undefined,
    });

    const board = response.boards[0];
    if (!board) break;

    boardName = board.name;
    allRawItems.push(...board.items_page.items);
    cursor = board.items_page.cursor ?? null;
    page++;
  } while (cursor && page < maxPages);

  return {
    boardName,
    items: cleanMondayData(allRawItems),
  };
}
