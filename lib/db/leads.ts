import { config } from '../config';
import { LeadRecord, LeadSubmissionPayload } from '../../types/audit';
import { logger } from '../logger';

export async function saveLead(payload: LeadSubmissionPayload): Promise<{ leadId: string; storageMode: string }> {
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
        const res = await fetch(endpoint, {
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
  }

  // 2. Safe development fallback: Log structured event without writing plain files to Git
  logger.info('Lead captured (development mode - no external DB credentials configured)', {
    leadId,
    website: payload.websiteUrl,
    score: payload.auditScore,
    sector: payload.sector,
    issuesCount: payload.topIssues?.length || 0,
  });

  return { leadId, storageMode: 'local-safe' };
}
