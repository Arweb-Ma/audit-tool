import { NextRequest, NextResponse } from 'next/server';
import { saveLead } from '@/lib/db/leads';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { getPersistentAuditRecord } from '@/lib/audit-store';
import { config } from '@/lib/config';
import { logger } from '@/lib/logger';
import { LeadSubmissionPayload } from '@/types/audit';

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req.headers);

  // 1. Rate limiting check
  const rateLimit = await checkRateLimit(clientIp, 'lead', config.audit.rateLimitHourlyLeads);
  if (!rateLimit.success) {
    logger.warn('Lead submission rate limit exceeded', { ip: clientIp });
    return NextResponse.json(
      {
        error: `Trop de demandes soumises. Veuillez patienter ${Math.ceil(
          rateLimit.resetInSeconds / 60
        )} minutes avant de soumettre à nouveau.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { auditId, name, email, whatsapp, sector, consentGiven } = body;

    // 2. Server-side audit record verification (Task 3)
    if (!auditId || typeof auditId !== 'string' || auditId.trim().length === 0) {
      return NextResponse.json(
        { error: 'Identifiant d\'audit manquant ou invalide. Veuillez relancer une analyse pour générer votre plan d\'action.' },
        { status: 400 }
      );
    }

    const verifiedAudit = await getPersistentAuditRecord(auditId.trim());
    if (!verifiedAudit) {
      return NextResponse.json(
        { error: 'Session d\'audit expirée ou introuvable. Veuillez relancer une analyse pour débloquer votre plan d\'action.' },
        { status: 400 }
      );
    }

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Veuillez renseigner votre nom complet.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Veuillez renseigner une adresse courriel valide.' }, { status: 400 });
    }

    if (!whatsapp || typeof whatsapp !== 'string' || whatsapp.trim().length < 6) {
      return NextResponse.json({ error: 'Veuillez renseigner un numéro WhatsApp valide.' }, { status: 400 });
    }

    if (!consentGiven) {
      return NextResponse.json(
        { error: 'Veuillez accepter la politique de confidentialité pour recevoir le plan d\'action.' },
        { status: 400 }
      );
    }

    // Populate metrics strictly from the verified server-side audit record
    const payload: LeadSubmissionPayload = {
      auditId: verifiedAudit.auditId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp.trim(),
      sector: sector || 'Général',
      websiteUrl: verifiedAudit.url,
      auditScore: verifiedAudit.overallScore,
      categoryScores: {
        seo: verifiedAudit.categoryScores.seo.score,
        performance: verifiedAudit.categoryScores.performance.score,
        indexability: verifiedAudit.categoryScores.indexability.score,
        schema: verifiedAudit.categoryScores.schema.score,
        mobile: verifiedAudit.categoryScores.mobile.score,
        security: verifiedAudit.categoryScores.security.score,
        social: verifiedAudit.categoryScores.social.score,
      },
      topIssues: (verifiedAudit.issues || []).slice(0, 5).map((iss) => ({
        title: iss.title,
        severity: iss.severity,
        evidence: iss.evidence,
      })),
      consentGiven: Boolean(consentGiven),
    };

    // 2. Persist to Supabase / secure local storage
    const { leadId, storageMode } = await saveLead(payload);

    // 3. Generate WhatsApp direct message tailored to ARWEB
    const cleanDomain = payload.websiteUrl
      ? payload.websiteUrl.replace(/^https?:\/\//, '').split('/')[0]
      : 'mon site';

    const waText = encodeURIComponent(
      `Bonjour ARWEB,\n\nJe viens d'effectuer l'audit de mon site ${cleanDomain}.\nScore ARWEB : ${payload.auditScore}/100.\n\nNom : ${payload.name}\nSecteur : ${payload.sector}\nEmail : ${payload.email}\n\nJe souhaite discuter des recommandations prioritaires.`
    );

    const whatsappNumber = config.arweb.whatsappNumber.replace(/[^0-9]/g, '');
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${waText}`;

    logger.info('Lead processed successfully', {
      leadId,
      storageMode,
      website: payload.websiteUrl,
    });

    return NextResponse.json({
      success: true,
      message: 'Demande enregistrée avec succès. Votre plan d\'action est débloqué.',
      leadId,
      whatsappLink,
      contactEmail: config.arweb.contactEmail,
    });
  } catch (error: any) {
    logger.error('Lead submission exception', { error: String(error) });
    return NextResponse.json({ error: 'Échec du traitement de la demande.' }, { status: 500 });
  }
}
