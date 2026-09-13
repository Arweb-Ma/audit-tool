import { AuditResult } from '../types/audit';
import { config } from './config';
import { logger } from './logger';

interface CacheEntry {
  data: AuditResult;
  expiresAt: number;
}

const auditCache = new Map<string, CacheEntry>();

export async function getCachedAudit(normalizedUrl: string): Promise<AuditResult | null> {
  const now = Date.now();

  // 1. Fast in-memory check (L1 cache)
  const memEntry = auditCache.get(normalizedUrl);
  if (memEntry) {
    if (now > memEntry.expiresAt) {
      auditCache.delete(normalizedUrl);
    } else {
      return memEntry.data;
    }
  }

  // 2. Supabase-backed persistent cache (L2 cache)
  if (config.database.supabaseUrl && config.database.supabaseServiceRoleKey) {
    try {
      const baseUrl = config.database.supabaseUrl.replace(/\/$/, '');
      const endpoint = `${baseUrl}/rest/v1/arweb_cache?url=eq.${encodeURIComponent(normalizedUrl)}&select=data,expires_at`;
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          apikey: config.database.supabaseServiceRoleKey,
          Authorization: `Bearer ${config.database.supabaseServiceRoleKey}`,
        },
      });

      if (res.ok) {
        const rows = await res.json().catch(() => []);
        if (Array.isArray(rows) && rows.length > 0) {
          const row = rows[0];
          if (row.expires_at && row.expires_at > now && row.data) {
            // Populate in-memory L1 cache for subsequent fast reads
            auditCache.set(normalizedUrl, {
              data: row.data,
              expiresAt: row.expires_at,
            });
            return row.data;
          }
        }
      }
    } catch (err) {
      logger.warn('Error reading audit cache from Supabase, relying on in-memory fallback', {
        error: String(err),
      });
    }
  }

  return null;
}

export async function setCachedAudit(normalizedUrl: string, result: AuditResult): Promise<void> {
  const ttlMs = config.audit.cacheTtlSeconds * 1000;
  const expiresAt = Date.now() + ttlMs;

  // 1. Save to in-memory L1 cache
  auditCache.set(normalizedUrl, {
    data: result,
    expiresAt,
  });

  // 2. Persist to Supabase L2 cache if configured
  if (config.database.supabaseUrl && config.database.supabaseServiceRoleKey) {
    try {
      const baseUrl = config.database.supabaseUrl.replace(/\/$/, '');
      const endpoint = `${baseUrl}/rest/v1/arweb_cache`;
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: config.database.supabaseServiceRoleKey,
          Authorization: `Bearer ${config.database.supabaseServiceRoleKey}`,
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          url: normalizedUrl,
          data: result,
          expires_at: expiresAt,
          created_at: new Date().toISOString(),
        }),
      });
    } catch (err) {
      logger.warn('Error writing audit cache to Supabase, continuing with in-memory', {
        error: String(err),
      });
    }
  }
}
