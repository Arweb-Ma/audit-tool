import crypto from 'node:crypto';
import { AuditResult } from '../types/audit';
import { hasPostgresDatabase, queryPostgres } from './db/postgres';
import { logger } from './logger';

interface StoredAuditRecord {
  data: AuditResult;
  expiresAt: number;
}

const auditRecordStore = new Map<string, StoredAuditRecord>();

// Default expiration: 30 minutes
export const AUDIT_RECORD_TTL_SECONDS = 30 * 60;

/**
 * Creates and stores a server-side audit record keyed by an unguessable auditId.
 */
export function createAuditRecord(result: AuditResult, ttlSeconds = AUDIT_RECORD_TTL_SECONDS): string {
  const auditId = `aud_${crypto.randomUUID().replace(/-/g, '')}`;
  setAuditRecord(auditId, result, ttlSeconds);
  return auditId;
}

/**
 * Associates an AuditResult with a specific auditId.
 */
export function setAuditRecord(auditId: string, result: AuditResult, ttlSeconds = AUDIT_RECORD_TTL_SECONDS): void {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  const recordWithId: AuditResult = { ...result, auditId };
  auditRecordStore.set(auditId, {
    data: recordWithId,
    expiresAt,
  });
}

/**
 * Retrieves a server-verified audit record if it exists and has not expired.
 */
export function getAuditRecord(auditId: string): AuditResult | null {
  if (!auditId || typeof auditId !== 'string') return null;

  const entry = auditRecordStore.get(auditId);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    auditRecordStore.delete(auditId);
    return null;
  }

  return entry.data;
}

/**
 * Writes the audit session to PostgreSQL when DATABASE_URL is configured.
 * The in-memory store remains a fast local cache and a development fallback.
 */
export async function persistAuditRecord(
  auditId: string,
  result: AuditResult,
  ttlSeconds = AUDIT_RECORD_TTL_SECONDS
): Promise<void> {
  if (!hasPostgresDatabase()) return;

  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
  const recordWithId: AuditResult = { ...result, auditId };

  await queryPostgres(
    `INSERT INTO arweb_audit_sessions (audit_id, data, expires_at)
     VALUES ($1, $2::jsonb, $3)
     ON CONFLICT (audit_id)
     DO UPDATE SET data = EXCLUDED.data, expires_at = EXCLUDED.expires_at`,
    [auditId, JSON.stringify(recordWithId), expiresAt]
  );
}

/**
 * Reads an audit session from local memory first, then PostgreSQL. This makes
 * lead verification survive process restarts and multiple application workers.
 */
export async function getPersistentAuditRecord(auditId: string): Promise<AuditResult | null> {
  const inMemory = getAuditRecord(auditId);
  if (inMemory || !hasPostgresDatabase()) return inMemory;

  try {
    const rows = await queryPostgres<{ data: AuditResult; expires_at: Date }>(
      `SELECT data, expires_at
       FROM arweb_audit_sessions
       WHERE audit_id = $1 AND expires_at > NOW()`,
      [auditId]
    );
    const row = rows[0];
    if (!row?.data) return null;

    const expiresAt = new Date(row.expires_at).getTime();
    setAuditRecord(auditId, row.data, Math.max(1, Math.ceil((expiresAt - Date.now()) / 1000)));
    return getAuditRecord(auditId);
  } catch (error) {
    logger.error('Unable to retrieve persisted audit session', { auditId, error: String(error) });
    return null;
  }
}

/**
 * Prunes expired audit records from memory.
 */
export function pruneExpiredAuditRecords(): void {
  const now = Date.now();
  for (const [id, entry] of auditRecordStore.entries()) {
    if (now > entry.expiresAt) {
      auditRecordStore.delete(id);
    }
  }
}

/**
 * For testing purposes: clears all records.
 */
export function clearAuditRecordStore(): void {
  auditRecordStore.clear();
}
