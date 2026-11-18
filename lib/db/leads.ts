import { config } from '../config';
import { LeadRecord, LeadSubmissionPayload } from '../../types/audit';
import { logger } from '../logger';

/**
 * supabase        saved
 * not-configured  no database credentials (fine in local development, an error in production)
 * failed          credentials exist but the insert did not succeed: the lead is NOT stored
 */
export type LeadStorageMode = 'supabase' | 'not-configured' | 'failed';

const RETRY_DELAY_MS = 1500;

async function postWithRetry(endpoint: string, init: RequestInit): Promise<Response> {
  // One retry for network errors and 5xx: a free Supabase project can be slow to wake up.
  try {
    const res = await fetch(endpoint, init);
    if (res.status < 500) return res;
  } catch (err) {
    logger.warn('Supabase request failed, retrying once', { error: String(err) });
  }
  await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
  return fetch(endpoint, init);
}

export async function saveLead(payload: LeadSubmissionPayload): Promise<{ leadId: string; storageMode: LeadStorageMode }> {
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const submittedAt = new Date().toISOString();

  const record: LeadRecord = {
    id: leadId,
    ...payload,
    submittedAt,
    status: 'new',
  };

  // 1. Check if Supabase credentials exist (Free PostgreSQL cloud tier)
  if (config.database.supabaseUrl && config.database.supabaseServiceRoleKey) {
    const baseUrl = config.database.supabaseUrl.replace(/\/$/, '');
    const headers = {
      'Content-Type': 'application/json',
      apikey: config.database.supabaseServiceRoleKey,
      Authorization: `Bearer ${config.database.supabaseServiceRoleKey}`,
      Prefer: 'return=representation',
    };

    const leadData = {
      name: payload.name,
      email: payload.email,
      whatsapp: payload.whatsapp,
      sector: payload.sector,
      website_url: payload.websiteUrl,
      audit_score: payload.auditScore,
      category_scores: payload.categoryScores,
      top_issues: payload.topIssues,
      consent_given: payload.consentGiven,
      status: 'new',
    };

    // Try 'arweb_leads' first, fallback to 'leads' if not found
    for (const tableName of ['arweb_leads', 'leads']) {
      try {
        const endpoint = `${baseUrl}/rest/v1/${tableName}`;
        const res = await postWithRetry(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(leadData),
        });

        if (res.ok) {
          const inserted = await res.json().catch(() => null);
          const finalId = Array.isArray(inserted) && inserted[0]?.id ? inserted[0].id : leadId;
          logger.info('Lead saved to Supabase successfully', {
            table: tableName,
            leadId: finalId,
            website: payload.websiteUrl,
            score: payload.auditScore,
          });
          return { leadId: String(finalId), storageMode: 'supabase' };
        }

        const errBody = await res.text();
        // If 404 table not found, try the next table name
        if (res.status === 404) {
          logger.warn(`Table ${tableName} not found in Supabase, trying next...`);
          continue;
        }

        logger.error(`Failed to insert lead into Supabase (${tableName})`, {
          status: res.status,
          error: errBody,
        });
      } catch (err) {
        logger.error(`Error connecting to Supabase table ${tableName}`, { error: String(err) });
      }
    }

    logger.error('LEAD NOT STORED: every Supabase table failed', {
      website: payload.websiteUrl,
      score: payload.auditScore,
    });
    return { leadId, storageMode: 'failed' };
  }

  // 2. No database configured (local development). Nothing is written to disk.
  logger.warn('Lead not stored: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not configured', {
    leadId,
    website: payload.websiteUrl,
    score: payload.auditScore,
  });

  return { leadId, storageMode: 'not-configured' };
}
