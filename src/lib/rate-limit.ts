/**
 * Eenvoudige sliding-window rate limiter in geheugen (per serverless-instantie).
 * Voldoende als eerste verdedigingslinie; voor strikte limieten over alle instanties
 * kunt u dit vervangen door Upstash Redis / Vercel KV.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - recent[0])) / 1000) };
  }
  recent.push(now);
  hits.set(key, recent);
  // Opruimen om geheugengroei te voorkomen
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  }
  return { ok: true, retryAfter: 0 };
}
