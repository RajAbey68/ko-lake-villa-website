type Key = string;
const store = new Map<Key, { count:number; reset:number }>();

export function rateLimit(key: Key, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const bucket = store.get(key);
  if (!bucket || bucket.reset < now) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (bucket.count >= limit) return { ok: false, remaining: 0, retryAfter: Math.ceil((bucket.reset - now)/1000) };
  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count };
}