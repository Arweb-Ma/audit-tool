import * as cheerio from 'cheerio';
import { IndexabilityMetrics } from '../../types/audit';
import { config } from '../config';
import { assertSafeDestination } from './url';
import { logger } from '../logger';

export async function analyzeIndexability(
  html: string,
  headers: Headers,
  httpStatus: number,
  finalUrl: string,
  isRedirected: boolean,
  redirectChainCount: number
): Promise<IndexabilityMetrics> {
  const $ = cheerio.load(html || '');

  // 1. Robots meta
  const robotsMetaEl = $('meta[name="robots" i], meta[name="googlebot" i]').first();
  const robotsMeta = (robotsMetaEl.attr('content') || '').toLowerCase();
  const isNoindexInHtml = robotsMeta.includes('noindex');
  const isNofollowInHtml = robotsMeta.includes('nofollow');

  // 2. X-Robots-Tag HTTP header
  const xRobotsTag = (headers.get('x-robots-tag') || '').toLowerCase();
  const isNoindexInHeader = xRobotsTag.includes('noindex');
  const isNofollowInHeader = xRobotsTag.includes('nofollow');

  const isNoindex = isNoindexInHtml || isNoindexInHeader;
  const isNofollow = isNofollowInHtml || isNofollowInHeader;

  // 3. Canonical tag
  const canonicalEl = $('link[rel="canonical" i]').first();
  const canonicalUrl = (canonicalEl.attr('href') || '').trim();
  const hasCanonical = canonicalUrl.length > 0;

  let isCanonicalSelfReferencing = false;
  if (hasCanonical) {
    try {
      const parsedCanonical = new URL(canonicalUrl, finalUrl);
      const parsedFinal = new URL(finalUrl);
      isCanonicalSelfReferencing =
        parsedCanonical.origin === parsedFinal.origin &&
        parsedCanonical.pathname.replace(/\/$/, '') === parsedFinal.pathname.replace(/\/$/, '');
    } catch {
      isCanonicalSelfReferencing = false;
    }
  }

  // 4. Quick probe for robots.txt
  let robotsTxtStatus: IndexabilityMetrics['robotsTxtStatus'] = 'unreachable';
  let sitemapStatus: IndexabilityMetrics['sitemapStatus'] = 'missing';
  let sitemapUrl: string | undefined = undefined;

  try {
    const originUrl = new URL(finalUrl);
    const robotsUrl = new URL('/robots.txt', originUrl.origin);

    await assertSafeDestination(robotsUrl);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(robotsUrl.href, {
      signal: controller.signal,
      headers: {
        'User-Agent': config.audit.userAgent,
      },
    });

    clearTimeout(timer);

    if (res.ok) {
      robotsTxtStatus = 'present';
      const text = await res.text();
      // Look for sitemap directive
      const sitemapMatch = text.match(/sitemap:\s*(\S+)/i);
      if (sitemapMatch && sitemapMatch[1]) {
        sitemapStatus = 'present';
        sitemapUrl = sitemapMatch[1].trim();
      }
    } else if (res.status === 404) {
      robotsTxtStatus = 'missing';
    }
  } catch (err) {
    logger.warn('Error checking robots.txt', { error: String(err), finalUrl });
  }

  // 5. If sitemap was not declared in robots.txt, test /sitemap.xml directly
  if (sitemapStatus === 'missing') {
    try {
      const originUrl = new URL(finalUrl);
      const testSitemapUrl = new URL('/sitemap.xml', originUrl.origin);
      await assertSafeDestination(testSitemapUrl);

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(testSitemapUrl.href, {
        method: 'HEAD',
        signal: controller.signal,
        headers: { 'User-Agent': config.audit.userAgent },
      });

      clearTimeout(timer);

      if (res.ok) {
        sitemapStatus = 'present';
        sitemapUrl = testSitemapUrl.href;
      }
    } catch {
      // Ignore fallback sitemap error
    }
  }

  return {
    robotsMeta,
    isNoindex,
    isNofollow,
    xRobotsTag,
    hasCanonical,
    canonicalUrl,
    isCanonicalSelfReferencing,
    robotsTxtStatus,
    sitemapStatus,
    sitemapUrl,
    httpStatus,
    finalUrl,
    isRedirected,
    redirectChainCount,
  };
}
