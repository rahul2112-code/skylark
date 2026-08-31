import { z } from 'zod';

export const ColumnValueSchema = z.object({
  id: z.string(),
  text: z.string().nullable(),
  value: z.string().nullable(),
});

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  column_values: z.array(ColumnValueSchema),
});

export const BoardSchema = z.object({
  id: z.string(),
  name: z.string(),
  items_page: z.object({
    items: z.array(ItemSchema),
  }),
});

export type ColumnValue = z.infer<typeof ColumnValueSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type Board = z.infer<typeof BoardSchema>;
