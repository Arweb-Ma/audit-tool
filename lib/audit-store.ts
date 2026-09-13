import crypto from 'node:crypto';
import { AuditResult } from '../types/audit';

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
