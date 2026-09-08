import { AuditResult } from '../types/audit';
import { config } from './config';

interface CacheEntry {
  data: AuditResult;
  expiresAt: number;
}

const auditCache = new Map<string, CacheEntry>();

export function getCachedAudit(normalizedUrl: string): AuditResult | null {
  const entry = auditCache.get(normalizedUrl);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    auditCache.delete(normalizedUrl);
    return null;
  }

  return entry.data;
}

export function setCachedAudit(normalizedUrl: string, result: AuditResult): void {
  const ttlMs = config.audit.cacheTtlSeconds * 1000;
  auditCache.set(normalizedUrl, {
    data: result,
    expiresAt: Date.now() + ttlMs,
  });
}
