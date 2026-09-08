import * as cheerio from 'cheerio';
import { SecurityMetrics, SocialMetrics } from '../../types/audit';

export function analyzeSecurityAndSocial(
  html: string,
  headers: Headers,
  finalUrl: string
): { security: SecurityMetrics; social: SocialMetrics } {
  const isHttps = finalUrl.startsWith('https://');

  const hstsHeader = Boolean(headers.get('strict-transport-security'));
  const cspHeader = Boolean(headers.get('content-security-policy'));
  const xContentTypeOptionsHeader = (headers.get('x-content-type-options') || '').toLowerCase().includes('nosniff');
  const referrerPolicyHeader = headers.get('referrer-policy') || '';
  const permissionsPolicyHeader = Boolean(headers.get('permissions-policy'));

  const $ = cheerio.load(html || '');

  // Mixed content check (only relevant on HTTPS)
  let mixedContentCount = 0;
  if (isHttps) {
    $('script[src^="http://"], link[href^="http://"], img[src^="http://"], iframe[src^="http://"]').each(() => {
      mixedContentCount++;
    });
  }

  // Social / OpenGraph / Twitter / Hreflang
  const ogTitle = $('meta[property="og:title" i]').attr('content') || $('meta[name="og:title" i]').attr('content');
  const ogDescription =
    $('meta[property="og:description" i]').attr('content') || $('meta[name="og:description" i]').attr('content');
  const ogImage = $('meta[property="og:image" i]').attr('content') || $('meta[name="og:image" i]').attr('content');
  const hasOpenGraph = Boolean(ogTitle || ogImage);

  const twitterCardType =
    $('meta[name="twitter:card" i]').attr('content') || $('meta[property="twitter:card" i]').attr('content');
  const hasTwitterCard = Boolean(twitterCardType);

  // Hreflang
  const hreflangEls = $('link[rel="alternate" i][hreflang]');
  const detectedLangs: string[] = [];
  const htmlLang = $('html').attr('lang');
  if (htmlLang) {
    detectedLangs.push(htmlLang.toLowerCase());
  }
  hreflangEls.each((_, el) => {
    const lang = $(el).attr('hreflang')?.toLowerCase();
    if (lang && !detectedLangs.includes(lang)) {
      detectedLangs.push(lang);
    }
  });
  const hasHreflang = hreflangEls.length > 0 || detectedLangs.length > 1;

  return {
    security: {
      isHttps,
      hstsHeader,
      cspHeader,
      xContentTypeOptionsHeader,
      referrerPolicyHeader,
      permissionsPolicyHeader,
      mixedContentCount,
    },
    social: {
      hasOpenGraph,
      ogTitle: ogTitle?.trim(),
      ogDescription: ogDescription?.trim(),
      ogImage: ogImage?.trim(),
      hasTwitterCard,
      twitterCardType: twitterCardType?.trim(),
      hasHreflang,
      detectedLangs,
    },
  };
}
