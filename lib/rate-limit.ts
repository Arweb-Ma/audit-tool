import { config } from './config';
import { logger } from './logger';

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Clean up old entries periodically to prevent memory leaks
 */
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    record.timestamps = record.timestamps.filter((ts) => now - ts < WINDOW_MS);
    if (record.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

if (cleanupTimer.unref) {
  cleanupTimer.unref();
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
}

function checkRateLimitMemory(
  key: string,
  maxAllowed: number
): RateLimitResult {
  const now = Date.now();

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter timestamps within the current 1-hour window
  record.timestamps = record.timestamps.filter((ts) => now - ts < WINDOW_MS);

  if (record.timestamps.length >= maxAllowed) {
    const oldest = record.timestamps[0];
    const resetInSeconds = Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000));
    return {
      success: false,
      limit: maxAllowed,
      remaining: 0,
      resetInSeconds,
    };
  }

  record.timestamps.push(now);
  const remaining = Math.max(0, maxAllowed - record.timestamps.length);
  const oldest = record.timestamps[0] || now;
  const resetInSeconds = Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000));

  return {
    success: true,
    limit: maxAllowed,
    remaining,
    resetInSeconds,
  };
}

async function checkRateLimitSupabase(
  key: string,
  maxAllowed: number
): Promise<RateLimitResult | null> {
  if (!config.database.supabaseUrl || !config.database.supabaseServiceRoleKey) {
    return null;
  }

  const baseUrl = config.database.supabaseUrl.replace(/\/$/, '');
  const headers = {
    'Content-Type': 'application/json',
    apikey: config.database.supabaseServiceRoleKey,
    Authorization: `Bearer ${config.database.supabaseServiceRoleKey}`,
    Prefer: 'return=representation',
  };

  const now = Date.now();

  try {
    const endpoint = `${baseUrl}/rest/v1/arweb_rate_limits?key=eq.${encodeURIComponent(key)}&select=timestamps`;
    const res = await fetch(endpoint, { method: 'GET', headers });

    if (!res.ok) {
      logger.warn(`Supabase rate limit query failed (status ${res.status}), falling back to in-memory store`);
      return null;
    }

    const rows = await res.json().catch(() => []);
    let timestamps: number[] =
      Array.isArray(rows) && rows[0]?.timestamps && Array.isArray(rows[0].timestamps)
        ? rows[0].timestamps
        : [];

    timestamps = timestamps.filter((ts) => now - ts < WINDOW_MS);

    if (timestamps.length >= maxAllowed) {
      const oldest = timestamps[0] || now;
      const resetInSeconds = Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000));
      return {
        success: false,
        limit: maxAllowed,
        remaining: 0,
        resetInSeconds,
      };
    }

    timestamps.push(now);
    const upsertRes = await fetch(`${baseUrl}/rest/v1/arweb_rate_limits`, {
      method: 'POST',
      headers: {
        ...headers,
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        key,
        timestamps,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!upsertRes.ok) {
      logger.warn(`Supabase rate limit upsert failed (status ${upsertRes.status}), falling back to in-memory store`);
      return null;
    }

    const remaining = Math.max(0, maxAllowed - timestamps.length);
    const oldest = timestamps[0] || now;
    const resetInSeconds = Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000));

    return {
      success: true,
      limit: maxAllowed,
      remaining,
      resetInSeconds,
    };
  } catch (err) {
    logger.warn('Error connecting to Supabase rate limit store, falling back to in-memory', { error: String(err) });
    return null;
  }
}

export async function checkRateLimit(
  identifier: string,
  prefix: 'audit' | 'lead',
  maxAllowed: number
): Promise<RateLimitResult> {
  const key = `${prefix}:${identifier}`;

  if (config.database.supabaseUrl && config.database.supabaseServiceRoleKey) {
    const sbResult = await checkRateLimitSupabase(key, maxAllowed);
    if (sbResult !== null) {
      return sbResult;
    }
  }

  return checkRateLimitMemory(key, maxAllowed);
}

/**
 * Extracts client IP safely from NextRequest headers.
 *
 * Trust Model & Deployment Context:
 * 1. Managed Edge (Netlify, Cloudflare):
 *    - The edge proxy terminates the public connection and injects verified headers:
 *      'x-nf-client-connection-ip' (Netlify) or 'cf-connecting-ip' (Cloudflare).
 *    - These platform headers are injected at the edge and cannot be spoofed by clients.
 * 2. Reverse Proxy / VPS Deployments:
 *    - If behind N trusted reverse proxies (e.g. Nginx, load balancers), configure
 *      the TRUSTED_PROXY_COUNT environment variable (e.g. TRUSTED_PROXY_COUNT=1).
 *    - In this mode, X-Forwarded-For is parsed from the right side:
 *      ips[ips.length - trustedProxyCount], effectively ignoring any attacker-prepended
 *      leftmost spoofed IP addresses.
 * 3. Default Managed Edge Fallback:
 *    - When TRUSTED_PROXY_COUNT is not set, we trust that the hosting edge strips
 *      untrusted incoming headers or uses ips[0] / x-real-ip.
 */
export function getClientIp(headers: Headers): string {
  // 1. Netlify Edge provides the verified client IP
  const netlifyIp = headers.get('x-nf-client-connection-ip');
  if (netlifyIp && netlifyIp.trim()) {
    return netlifyIp.trim();
  }

  // 2. Cloudflare provides the verified client IP
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp && cfIp.trim()) {
    return cfIp.trim();
  }

  // 3. X-Forwarded-For with TRUSTED_PROXY_COUNT safeguard
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',').map((s) => s.trim()).filter(Boolean);
    if (ips.length > 0) {
      const trustedProxyCount = Number(process.env.TRUSTED_PROXY_COUNT);
      if (!isNaN(trustedProxyCount) && trustedProxyCount > 0) {
        // Pick IP from the right side according to number of trusted proxy hops
        const index = Math.max(0, ips.length - trustedProxyCount);
        return ips[index];
      }
      return ips[0];
    }
  }

  // 4. X-Real-IP fallback (e.g., set by single Nginx proxy)
  const realIp = headers.get('x-real-ip');
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }

  return '127.0.0.1';
}
