import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function getCachedBoardData(
  boardId: string,
  query: string,
  ttlSeconds: number = 300 // 5 min default
) {
  if (!process.env.UPSTASH_REDIS_REST_URL) return null; // Fallback if no redis
  const cacheKey = `monday:${boardId}:${query}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return cached; // Upstash redis SDK automatically parses JSON for objects usually, but depends on storage format
    }
  } catch (error) {
    console.warn('Cache read failed:', error);
  }
  return null;
}

export async function setCachedBoardData(
  boardId: string,
  query: string,
  data: any,
  ttlSeconds: number = 300
) {
  if (!process.env.UPSTASH_REDIS_REST_URL) return;
  const cacheKey = `monday:${boardId}:${query}`;
  try {
    await redis.setex(cacheKey, ttlSeconds, data);
  } catch (error) {
    console.warn('Cache write failed:', error);
  }
}

export async function invalidateCache(boardId: string) {
  if (!process.env.UPSTASH_REDIS_REST_URL) return;
  const pattern = `monday:${boardId}:*`;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.warn('Cache invalidation failed:', error);
  }
}
