import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_GEMINI_API_KEY: z.string().min(1).optional(),
  MONDAY_API_TOKEN: z.string().min(1).optional(),
  MONDAY_DEALS_BOARD_ID: z.string().min(1).optional(),
  MONDAY_WORK_ORDERS_BOARD_ID: z.string().min(1).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// We use safeParse to avoid crashing the app at build time if envs are missing
export const env = envSchema.safeParse(process.env);
