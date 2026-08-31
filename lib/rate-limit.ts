interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export function checkRateLimit(
  userId: string,
  limit: number = 10,
  windowMs: number = 60000 // 1 minute
): boolean {
  const now = Date.now();
  const key = userId;

  if (!store[key] || store[key].resetTime < now) {
    store[key] = { count: 1, resetTime: now + windowMs };
    return true;
  }

  if (store[key].count >= limit) {
    return false;
  }

  store[key].count++;
  return true;
}
