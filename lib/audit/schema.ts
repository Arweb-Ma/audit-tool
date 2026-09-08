import * as cheerio from 'cheerio';
import { SchemaMetrics } from '../../types/audit';

function extractTypesFromObject(obj: any, collected: Set<string>) {
  if (!obj || typeof obj !== 'object') return;

  if (Array.isArray(obj)) {
    obj.forEach((item) => extractTypesFromObject(item, collected));
    return;
  }

  // Check @type
  if (obj['@type']) {
    if (typeof obj['@type'] === 'string') {
      collected.add(obj['@type']);
    } else if (Array.isArray(obj['@type'])) {
      obj['@type'].forEach((t: any) => typeof t === 'string' && collected.add(t));
    }
  }

  // Check @graph
  if (Array.isArray(obj['@graph'])) {
    obj['@graph'].forEach((item: any) => extractTypesFromObject(item, collected));
  }

  // Recurse on object values to find nested schemas (e.g. publisher, author, offers)
  for (const key of Object.keys(obj)) {
    if (key !== '@context' && typeof obj[key] === 'object') {
      extractTypesFromObject(obj[key], collected);
    }
  }
}

export function analyzeStructuredData(html: string): SchemaMetrics {
  const $ = cheerio.load(html || '');
  const scripts = $('script[type="application/ld+json"]');

  const detectedTypes = new Set<string>();
  const rawBlocksSummary: string[] = [];
  let blockCount = 0;
  let hasParsingError = false;

  scripts.each((idx, el) => {
    blockCount++;
    const content = $(el).html()?.trim();
    if (!content) return;

    try {
      const parsed = JSON.parse(content);
      extractTypesFromObject(parsed, detectedTypes);
      const typesInBlock = new Set<string>();
      extractTypesFromObject(parsed, typesInBlock);
      rawBlocksSummary.push(`Bloc ${idx + 1} : ${Array.from(typesInBlock).join(', ') || 'Schéma sans @type explicite'}`);
    } catch {
      hasParsingError = true;
      rawBlocksSummary.push(`Bloc ${idx + 1} : Erreur de syntaxe JSON`);
    }
  });

  const typesArray = Array.from(detectedTypes);

  const hasOrganizationOrLocalBusiness = typesArray.some((t) =>
    ['Organization', 'LocalBusiness', 'Corporation', 'MedicalBusiness', 'Store'].includes(t)
  );
  const hasBreadcrumbs = typesArray.includes('BreadcrumbList');
  const hasFaq = typesArray.includes('FAQPage');
  const hasProductOrService = typesArray.some((t) => ['Product', 'Service', 'Offer'].includes(t));

  return {
    hasJsonLd: blockCount > 0 && typesArray.length > 0,
    detectedTypes: typesArray,
    blockCount,
    hasParsingError,
    hasOrganizationOrLocalBusiness,
    hasBreadcrumbs,
    hasFaq,
    hasProductOrService,
    rawBlocksSummary,
  };
}
