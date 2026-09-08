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
    try {
      const endpoint = `${config.database.supabaseUrl.replace(/\/$/, '')}/rest/v1/arweb_leads`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: config.database.supabaseServiceRoleKey,
          Authorization: `Bearer ${config.database.supabaseServiceRoleKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          id: leadId,
          name: payload.name,
          email: payload.email,
          whatsapp: payload.whatsapp,
          sector: payload.sector,
          website_url: payload.websiteUrl,
          audit_score: payload.auditScore,
          category_scores: payload.categoryScores,
          top_issues: payload.topIssues,
          consent_given: payload.consentGiven,
          source: 'audit.arweb.ma',
          status: 'new',
          created_at: submittedAt,
        }),
      });

      if (res.ok) {
        logger.info('Lead saved to Supabase successfully', {
          leadId,
          website: payload.websiteUrl,
          score: payload.auditScore,
        });
        return { leadId, storageMode: 'supabase' };
      }

      const errBody = await res.text();
      logger.error('Failed to insert lead into Supabase', { status: res.status, error: errBody });
    } catch (err) {
      logger.error('Error connecting to Supabase database', { error: String(err) });
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
