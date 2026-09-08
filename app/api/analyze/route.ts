import { NextRequest, NextResponse } from 'next/server';
import { normalizeTargetUrl, SsrfBlockError } from '@/lib/audit/url';
import { safeFetchTargetHtml } from '@/lib/audit/fetch';
import { fetchRealPageSpeedMetrics } from '@/lib/audit/performance';
import { analyzeSeo } from '@/lib/audit/seo';
import { analyzeIndexability } from '@/lib/audit/indexability';
import { analyzeStructuredData } from '@/lib/audit/schema';
import { analyzeSecurityAndSocial } from '@/lib/audit/security';
import { computeAuditScores } from '@/lib/audit/scoring';
import { generatePrioritizedIssues } from '@/lib/audit/issues';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { getCachedAudit, setCachedAudit } from '@/lib/cache';
import { config } from '@/lib/config';
import { logger } from '@/lib/logger';
import { AuditResult } from '@/types/audit';

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req.headers);

  // 1. Rate limiting check
  const rateLimit = checkRateLimit(clientIp, 'audit', config.audit.rateLimitHourlyAudits);
  if (!rateLimit.success) {
    logger.warn('Audit rate limit exceeded', { ip: clientIp });
    return NextResponse.json(
      {
        error: `Limite d'audits atteinte (${config.audit.rateLimitHourlyAudits} audits/heure). Veuillez réessayer dans ${Math.ceil(
          rateLimit.resetInSeconds / 60
        )} minutes.`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.resetInSeconds),
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const rawUrl = body.url?.trim() || '';

    if (!rawUrl) {
      return NextResponse.json({ error: 'Une adresse URL de site web est requise.' }, { status: 400 });
    }

    // 2. URL normalization & syntax validation
    const targetUrl = normalizeTargetUrl(rawUrl);
    const domain = targetUrl.hostname.replace(/^www\./, '');

    // 3. Check short-term cache (15 min)
    const cached = getCachedAudit(targetUrl.href);
    if (cached) {
      logger.info('Audit served from cache', { domain, url: targetUrl.href });
      return NextResponse.json(cached);
    }

    logger.info('Starting audit analysis', { domain, url: targetUrl.href });

    // 4. Safe HTTP Fetch with SSRF pre-flight DNS check, redirect check, size limit
    const fetchResult = await safeFetchTargetHtml(targetUrl);

    // 5. Concurrent analysis modules
    const baseUrl = new URL(fetchResult.finalUrl);
    const seoMetrics = analyzeSeo(fetchResult.html, baseUrl);
    const schemaMetrics = analyzeStructuredData(fetchResult.html);
    const { security: secMetrics, social: socMetrics } = analyzeSecurityAndSocial(
      fetchResult.html,
      fetchResult.headers,
      fetchResult.finalUrl
    );

    const [indexMetrics, perfMetrics] = await Promise.all([
      analyzeIndexability(
        fetchResult.html,
        fetchResult.headers,
        fetchResult.status,
        fetchResult.finalUrl,
        fetchResult.isRedirected,
        fetchResult.redirectChainCount
      ),
      fetchRealPageSpeedMetrics(fetchResult.finalUrl, fetchResult.ttfbMs, seoMetrics.hasViewport),
    ]);

    // 6. Independent Composite ARWEB Scoring
    const scoringResult = computeAuditScores(
      seoMetrics,
      perfMetrics,
      indexMetrics,
      schemaMetrics,
      secMetrics,
      socMetrics
    );

    // 7. Evidence-based Prioritized Issues
    const issues = generatePrioritizedIssues(
      seoMetrics,
      perfMetrics,
      indexMetrics,
      schemaMetrics,
      secMetrics,
      socMetrics
    );

    const auditResult: AuditResult = {
      url: fetchResult.finalUrl,
      domain,
      timestamp: new Date().toISOString(),
      overallScore: scoringResult.overallScore,
      grade: scoringResult.grade,
      categoryScores: scoringResult.categoryScores,
      metrics: perfMetrics,
      seo: seoMetrics,
      indexability: indexMetrics,
      schema: schemaMetrics,
      security: secMetrics,
      social: socMetrics,
      aiReadiness: scoringResult.aiReadiness,
      issues,
      passedChecksCount: scoringResult.passedChecksCount,
      totalChecksCount: scoringResult.totalChecksCount,
    };

    // Save to cache
    setCachedAudit(targetUrl.href, auditResult);

    logger.info('Audit completed successfully', {
      domain,
      score: auditResult.overallScore,
      grade: auditResult.grade,
      issuesCount: issues.length,
    });

    return NextResponse.json(auditResult);
  } catch (error: any) {
    logger.error('Audit analysis failed', { error: String(error) });

    if (error instanceof SsrfBlockError) {
      return NextResponse.json(
        { error: error.message || 'Accès refusé vers cette cible pour des raisons de sécurité réseau.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Impossible d\'analyser ce site web. Vérifiez l\'URL et réessayez.' },
      { status: 400 }
    );
  }
}
