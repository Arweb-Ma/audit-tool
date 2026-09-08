import assert from 'node:assert';
import { normalizeTargetUrl, isIpAddressSafe, assertSafeDestination } from '../lib/audit/url.ts';
import { analyzeStructuredData } from '../lib/audit/schema.ts';
import { computeAuditScores } from '../lib/audit/scoring.ts';
import { generatePrioritizedIssues } from '../lib/audit/issues.ts';

async function runTests() {
  console.log('🧪 Starting ARWEB Audit Engine Test Suite...\n');

  // --- Test 1: URL Normalization ---
  console.log('Test 1: URL Normalization');
  const url1 = normalizeTargetUrl('arweb.ma');
  assert.strictEqual(url1.href, 'https://arweb.ma/');
  assert.strictEqual(url1.hostname, 'arweb.ma');

  const url2 = normalizeTargetUrl('http://example.com/path?foo=bar');
  assert.strictEqual(url2.href, 'http://example.com/path?foo=bar');
  assert.strictEqual(url2.hostname, 'example.com');
  console.log('  ✓ URL normalization passed\n');

  // --- Test 2: SSRF Blocking ---
  console.log('Test 2: SSRF & Private IP Blocking');
  // Loopback
  assert.strictEqual(isIpAddressSafe('127.0.0.1'), false);
  assert.strictEqual(isIpAddressSafe('127.0.1.5'), false);
  assert.strictEqual(isIpAddressSafe('::1'), false);

  // RFC 1918 Private
  assert.strictEqual(isIpAddressSafe('10.0.0.1'), false);
  assert.strictEqual(isIpAddressSafe('172.16.0.1'), false);
  assert.strictEqual(isIpAddressSafe('172.31.255.255'), false);
  assert.strictEqual(isIpAddressSafe('192.168.1.1'), false);

  // Cloud Metadata (AWS, GCP, Azure, DigitalOcean)
  assert.strictEqual(isIpAddressSafe('169.254.169.254'), false);
  assert.strictEqual(isIpAddressSafe('169.254.1.1'), false);

  // Public IPs should pass
  assert.strictEqual(isIpAddressSafe('8.8.8.8'), true);
  assert.strictEqual(isIpAddressSafe('104.21.5.10'), true);

  // SSRF Hostname Validation
  await assert.rejects(async () => {
    await assertSafeDestination(new URL('http://localhost:3000'));
  }, /interne ou privée/i);

  await assert.rejects(async () => {
    await assertSafeDestination(new URL('http://127.0.0.1'));
  }, /réservée ou privée/i);

  await assert.rejects(async () => {
    await assertSafeDestination(new URL('http://169.254.169.254/latest/meta-data/'));
  }, /réservée ou privée/i);

  assert.throws(() => normalizeTargetUrl('ftp://example.com'), /protocoles HTTP et HTTPS/i);
  console.log('  ✓ SSRF & Private IP blocking passed\n');



// --- Test 3: Schema JSON-LD Parsing ---
console.log('Test 3: Schema JSON-LD Parser');
const htmlWithSchema = `
<!DOCTYPE html>
<html>
<head>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Arweb Digital Agency",
    "url": "https://arweb.ma"
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "Arweb"
      },
      {
        "@type": "Service",
        "name": "Création Web & SEO"
      }
    ]
  }
  </script>
</head>
<body><h1>Hello World</h1></body>
</html>
`;

const schemaMetrics = analyzeStructuredData(htmlWithSchema);
assert.strictEqual(schemaMetrics.hasJsonLd, true);
assert.strictEqual(schemaMetrics.blockCount, 2);
assert.strictEqual(schemaMetrics.hasParsingError, false);
assert.strictEqual(schemaMetrics.hasOrganizationOrLocalBusiness, true);
assert.strictEqual(schemaMetrics.hasProductOrService, true);
assert.ok(schemaMetrics.detectedTypes.includes('Organization'));
assert.ok(schemaMetrics.detectedTypes.includes('WebSite'));
assert.ok(schemaMetrics.detectedTypes.includes('Service'));
console.log('  ✓ JSON-LD graph and array parsing passed\n');

// --- Test 4: Score Fairness & Weight Redistribution ---
console.log('Test 4: Scoring Engine & Fair Redistribution');

// Perfect site with PageSpeed available
const mockPerfAvailable = {
  available: true,
  source: 'lighthouse-lab' as const,
  fieldDataAvailable: false,
  lcp: { value: '1.2s', numVal: 1200, status: 'good' as const, label: 'LCP' },
  cls: { value: '0.02', numVal: 0.02, status: 'good' as const, label: 'CLS' },
  fcp: { value: '0.9s', numVal: 900, status: 'good' as const, label: 'FCP' },
  speedIndex: { value: '1.5s', numVal: 1500, status: 'good' as const, label: 'Speed Index' },
  ttfb: { value: '150ms', numVal: 150, status: 'good' as const, label: 'TTFB' },
  mobileFriendly: true,
};

const mockSeoPerfect = {
  hasTitle: true,
  titleText: 'Arweb - Agence Digitale & Création Web',
  titleLength: 42,
  titleStatus: 'good' as const,
  hasMetaDescription: true,
  metaDescriptionText: 'Développez votre visibilité en ligne avec notre expertise en création web performante et SEO.',
  metaDescriptionLength: 105,
  metaDescriptionStatus: 'good' as const,
  h1Count: 1,
  h1Text: 'Agence Digitale Performante',
  h2Count: 4,
  headingHierarchyValid: true,
  hasViewport: true,
  viewportContent: 'width=device-width, initial-scale=1',
  htmlLang: 'fr',
  hasHtmlLang: true,
  hasFavicon: true,
  totalImages: 10,
  imagesMissingAlt: 0,
  imagesWithEmptyAlt: 0,
  imagesPercentWithAlt: 100,
  imagesMissingDimensions: 0,
  imagesLazyLoaded: 8,
  totalLinks: 20,
  internalLinks: 15,
  externalLinks: 5,
  emptyAnchorLinks: 0,
  externalLinksWithoutNoopener: 0,
};

const mockIndexabilityPerfect = {
  robotsMeta: '',
  isNoindex: false,
  isNofollow: false,
  xRobotsTag: '',
  hasCanonical: true,
  canonicalUrl: 'https://arweb.ma/',
  isCanonicalSelfReferencing: true,
  robotsTxtStatus: 'present' as const,
  sitemapStatus: 'present' as const,
  sitemapUrl: 'https://arweb.ma/sitemap.xml',
  httpStatus: 200,
  finalUrl: 'https://arweb.ma/',
  isRedirected: false,
  redirectChainCount: 0,
};

const mockSecurityPerfect = {
  isHttps: true,
  hstsHeader: true,
  cspHeader: true,
  xContentTypeOptionsHeader: true,
  referrerPolicyHeader: 'strict-origin-when-cross-origin',
  permissionsPolicyHeader: true,
  mixedContentCount: 0,
};

const mockSocialPerfect = {
  hasOpenGraph: true,
  ogTitle: 'Arweb',
  ogDescription: 'Agence',
  ogImage: 'https://arweb.ma/og.jpg',
  hasTwitterCard: true,
  twitterCardType: 'summary_large_image',
  hasHreflang: true,
  detectedLangs: ['fr', 'ar'],
};

const resultWithPerf = computeAuditScores(
  mockSeoPerfect,
  mockPerfAvailable,
  mockIndexabilityPerfect,
  schemaMetrics,
  mockSecurityPerfect,
  mockSocialPerfect
);

assert.ok(resultWithPerf.overallScore >= 90, `Expected high score >= 90, got ${resultWithPerf.overallScore}`);
assert.strictEqual(resultWithPerf.grade, 'A+');
console.log(`  ✓ Perfect site scored ${resultWithPerf.overallScore}/100 (Grade: ${resultWithPerf.grade})`);

// Test when PageSpeed is offline (available: false)
const mockPerfUnavailable = {
  available: false,
  source: 'unavailable' as const,
  fieldDataAvailable: false,
  lcp: { value: 'N/A', status: 'unavailable' as const, label: 'LCP' },
  cls: { value: 'N/A', status: 'unavailable' as const, label: 'CLS' },
  fcp: { value: 'N/A', status: 'unavailable' as const, label: 'FCP' },
  speedIndex: { value: 'N/A', status: 'unavailable' as const, label: 'Speed Index' },
  ttfb: { value: '180ms', numVal: 180, status: 'good' as const, label: 'TTFB' },
  mobileFriendly: true,
};

const resultNoPerf = computeAuditScores(
  mockSeoPerfect,
  mockPerfUnavailable,
  mockIndexabilityPerfect,
  schemaMetrics,
  mockSecurityPerfect,
  mockSocialPerfect
);

// Site should still receive an A / A+ score without artificial penalty
assert.ok(resultNoPerf.overallScore >= 90, `Expected redistributed score >= 90, got ${resultNoPerf.overallScore}`);
console.log(`  ✓ When PageSpeed offline, redistributed score is ${resultNoPerf.overallScore}/100 (No unfair penalty)`);
console.log('  ✓ Scoring calculations passed\n');

// --- Test 5: Factual Issue Generation ---
console.log('Test 5: Factual Issue Generation');
const issues = generatePrioritizedIssues(
  mockSeoPerfect,
  mockPerfAvailable,
  mockIndexabilityPerfect,
  schemaMetrics,
  mockSecurityPerfect,
  mockSocialPerfect
);

// A clean site should produce 0 critical issues
const criticalIssues = issues.filter(i => i.severity === 'critical');
assert.strictEqual(criticalIssues.length, 0, 'Clean site should have 0 critical issues');
console.log(`  ✓ Clean site produced ${issues.length} minor opportunities, 0 critical issues`);

// Now simulate a broken site with missing title, noindex, and HTTP
const brokenIssues = generatePrioritizedIssues(
  { ...mockSeoPerfect, hasTitle: false, titleText: '', h1Count: 0, imagesMissingAlt: 10, totalImages: 10 },
  mockPerfAvailable,
  { ...mockIndexabilityPerfect, isNoindex: true },
  { ...schemaMetrics, hasJsonLd: false, detectedTypes: [] },
  { ...mockSecurityPerfect, isHttps: false },
  { ...mockSocialPerfect, hasOpenGraph: false }
);

  assert.ok(brokenIssues.some(i => i.id === 'issue-noindex'), 'Should detect issue-noindex');
  assert.ok(brokenIssues.some(i => i.id === 'issue-missing-title'), 'Should detect issue-missing-title');
  assert.ok(brokenIssues.some(i => i.id === 'issue-https'), 'Should detect issue-https');
  assert.ok(brokenIssues.some(i => i.id === 'issue-missing-h1'), 'Should detect issue-missing-h1');
  console.log(`  ✓ Broken site correctly flagged ${brokenIssues.length} real technical issues with evidence`);

  console.log('\n🎉 ALL AUDIT ENGINE UNIT TESTS PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});