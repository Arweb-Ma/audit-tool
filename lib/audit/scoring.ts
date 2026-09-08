import {
  CategoryScores,
  CoreWebVitals,
  IndexabilityMetrics,
  SchemaMetrics,
  SecurityMetrics,
  SeoMetrics,
  SocialMetrics,
  AiReadinessMetrics,
} from '../../types/audit';

export interface ScoreComputationResult {
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  categoryScores: CategoryScores;
  aiReadiness: AiReadinessMetrics;
  passedChecksCount: number;
  totalChecksCount: number;
}

export function computeAuditScores(
  seo: SeoMetrics,
  perf: CoreWebVitals,
  index: IndexabilityMetrics,
  schema: SchemaMetrics,
  sec: SecurityMetrics,
  soc: SocialMetrics
): ScoreComputationResult {
  let passedChecks = 0;
  let totalChecks = 0;

  // 1. Technical SEO Score (Weight: 30%)
  let seoPoints = 0;
  totalChecks += 7;

  if (seo.hasTitle) {
    seoPoints += 25;
    passedChecks++;
  }
  if (seo.titleStatus === 'good') {
    seoPoints += 15;
    passedChecks++;
  } else if (seo.titleStatus === 'warning') {
    seoPoints += 8;
  }

  if (seo.hasMetaDescription) {
    seoPoints += 20;
    passedChecks++;
  }
  if (seo.metaDescriptionStatus === 'good') {
    seoPoints += 10;
    passedChecks++;
  } else if (seo.metaDescriptionStatus === 'warning') {
    seoPoints += 5;
  }

  if (seo.h1Count === 1) {
    seoPoints += 15;
    passedChecks++;
  } else if (seo.h1Count > 1) {
    seoPoints += 10; // Multiple H1s are not catastrophic
  }

  if (seo.hasHtmlLang) {
    seoPoints += 10;
    passedChecks++;
  }
  if (seo.hasFavicon) {
    seoPoints += 5;
    passedChecks++;
  }

  const seoScore = Math.min(100, Math.round(seoPoints));

  // 2. Performance Score (Weight: 25%)
  let perfScore = 0;
  if (perf.available) {
    totalChecks += 5;
    let perfPoints = 0;

    if (perf.lcp.status === 'good') {
      perfPoints += 30;
      passedChecks++;
    } else if (perf.lcp.status === 'needs-improvement') {
      perfPoints += 15;
    }

    if (perf.cls.status === 'good') {
      perfPoints += 25;
      passedChecks++;
    } else if (perf.cls.status === 'needs-improvement') {
      perfPoints += 12;
    }

    if (perf.fcp.status === 'good') {
      perfPoints += 20;
      passedChecks++;
    } else if (perf.fcp.status === 'needs-improvement') {
      perfPoints += 10;
    }

    if (perf.ttfb.status === 'good') {
      perfPoints += 15;
      passedChecks++;
    } else if (perf.ttfb.status === 'needs-improvement') {
      perfPoints += 8;
    }

    if (perf.speedIndex.status === 'good') {
      perfPoints += 10;
      passedChecks++;
    } else if (perf.speedIndex.status === 'needs-improvement') {
      perfPoints += 5;
    }

    perfScore = Math.min(100, Math.round(perfPoints));
  } else {
    // If PageSpeed is unavailable, we still evaluate direct TTFB as a minor signal
    totalChecks += 1;
    if (perf.ttfb.status === 'good') {
      passedChecks++;
      perfScore = 80;
    } else if (perf.ttfb.status === 'needs-improvement') {
      perfScore = 60;
    } else {
      perfScore = 40;
    }
  }

  // 3. Crawlability & Indexability Score (Weight: 15%)
  let indexPoints = 0;
  totalChecks += 6;

  if (index.httpStatus === 200) {
    indexPoints += 25;
    passedChecks++;
  }
  if (!index.isNoindex) {
    indexPoints += 25;
    passedChecks++;
  }
  if (index.hasCanonical) {
    indexPoints += 20;
    passedChecks++;
  }
  if (index.isCanonicalSelfReferencing) {
    indexPoints += 10;
    passedChecks++;
  }
  if (index.robotsTxtStatus === 'present') {
    indexPoints += 10;
    passedChecks++;
  }
  if (index.sitemapStatus === 'present') {
    indexPoints += 10;
    passedChecks++;
  }

  const indexScore = Math.min(100, Math.round(indexPoints));

  // 4. Structured Data / Schema Score (Weight: 10%)
  let schemaPoints = 0;
  totalChecks += 4;

  if (schema.hasJsonLd) {
    schemaPoints += 35;
    passedChecks++;
  }
  if (!schema.hasParsingError && schema.blockCount > 0) {
    schemaPoints += 15;
    passedChecks++;
  }
  if (schema.hasOrganizationOrLocalBusiness) {
    schemaPoints += 25;
    passedChecks++;
  }
  if (schema.hasProductOrService || schema.hasFaq || schema.hasBreadcrumbs) {
    schemaPoints += 25;
    passedChecks++;
  }

  const schemaScore = Math.min(100, Math.round(schemaPoints));

  // 5. Mobile & UX Basics Score (Weight: 10%)
  let mobilePoints = 0;
  totalChecks += 4;

  if (seo.hasViewport) {
    mobilePoints += 40;
    passedChecks++;
  }
  if (seo.imagesPercentWithAlt >= 90) {
    mobilePoints += 30;
    passedChecks++;
  } else if (seo.imagesPercentWithAlt >= 60) {
    mobilePoints += 15;
  }
  if (seo.imagesMissingDimensions === 0 && seo.totalImages > 0) {
    mobilePoints += 15;
    passedChecks++;
  } else if (seo.imagesMissingDimensions < seo.totalImages / 2) {
    mobilePoints += 8;
  }
  if (seo.emptyAnchorLinks === 0) {
    mobilePoints += 15;
    passedChecks++;
  }

  const mobileScore = Math.min(100, Math.round(mobilePoints));

  // 6. Security & Technical Hygiene (Weight: 5%)
  let secPoints = 0;
  totalChecks += 4;

  if (sec.isHttps) {
    secPoints += 40;
    passedChecks++;
  }
  if (sec.hstsHeader) {
    secPoints += 20;
    passedChecks++;
  }
  if (sec.cspHeader || sec.xContentTypeOptionsHeader) {
    secPoints += 30;
    passedChecks++;
  }
  if (sec.mixedContentCount === 0) {
    secPoints += 10;
    passedChecks++;
  }

  const secScore = Math.min(100, Math.round(secPoints));

  // 7. Social & Discoverability (Weight: 5%)
  let socPoints = 0;
  totalChecks += 3;

  if (soc.hasOpenGraph) {
    socPoints += 40;
    passedChecks++;
  }
  if (soc.hasTwitterCard) {
    socPoints += 30;
    passedChecks++;
  }
  if (soc.hasHreflang || soc.detectedLangs.length > 0) {
    socPoints += 30;
    passedChecks++;
  }

  const socScore = Math.min(100, Math.round(socPoints));

  // Composite Weighted Score
  let overall = 0;
  if (perf.available) {
    overall =
      seoScore * 0.3 +
      perfScore * 0.25 +
      indexScore * 0.15 +
      schemaScore * 0.1 +
      mobileScore * 0.1 +
      secScore * 0.05 +
      socScore * 0.05;
  } else {
    // If PageSpeed is unavailable, redistribute the 25% weight across the 6 remaining categories proportionally
    const nonPerfSum =
      seoScore * 0.3 +
      indexScore * 0.15 +
      schemaScore * 0.1 +
      mobileScore * 0.1 +
      secScore * 0.05 +
      socScore * 0.05;
    overall = nonPerfSum / 0.75;
  }

  const finalScore = Math.max(1, Math.min(100, Math.round(overall)));

  // Grade Assignment
  let grade: ScoreComputationResult['grade'] = 'C';
  if (finalScore >= 90) grade = 'A+';
  else if (finalScore >= 80) grade = 'A';
  else if (finalScore >= 70) grade = 'B';
  else if (finalScore >= 55) grade = 'C';
  else if (finalScore >= 40) grade = 'D';
  else grade = 'F';

  // AI & Semantic Search Readiness Qualitative Evaluation
  let aiScore = 0;
  if (schema.hasOrganizationOrLocalBusiness) aiScore += 30;
  if (schema.hasProductOrService) aiScore += 25;
  if (seo.hasMetaDescription && seo.metaDescriptionLength >= 70) aiScore += 15;
  if (seo.h1Count >= 1 && seo.h2Count >= 2) aiScore += 15;
  if (!index.isNoindex && index.sitemapStatus === 'present') aiScore += 15;

  let aiRating: AiReadinessMetrics['rating'] = 'À optimiser';
  let aiSummary =
    'Données sémantiques limitées. Les moteurs de recherche IA (Google AI Overviews, Perplexity, ChatGPT) peinent à extraire précisément vos entités et offres.';

  if (aiScore >= 80) {
    aiRating = 'Fort';
    aiSummary =
      'Excellente structuration sémantique. Vos entités clés, descriptions et schémas permettent une extraction fluide par les moteurs d\'IA.';
  } else if (aiScore >= 60) {
    aiRating = 'Modéré';
    aiSummary =
      'Bonne base sémantique. L\'ajout de schémas d\'offres, de services et de questions fréquentes (FAQ) renforcera votre visibilité sur les requêtes conversationnelles.';
  } else if (aiScore >= 40) {
    aiRating = 'Limité';
    aiSummary =
      'Présence sémantique basique. Des balises essentielles existent mais manquent de données structurées pour être interprétées sans ambiguïté par les IA.';
  }

  const categoryScores: CategoryScores = {
    seo: { score: seoScore, weight: 30, label: 'SEO Technique' },
    performance: { score: perfScore, weight: 25, label: 'Vitesse & Core Web Vitals', available: perf.available },
    indexability: { score: indexScore, weight: 15, label: 'Indexabilité & Exploration' },
    schema: { score: schemaScore, weight: 10, label: 'Données Structurées' },
    mobile: { score: mobileScore, weight: 10, label: 'Ergonomie Mobile' },
    security: { score: secScore, weight: 5, label: 'Sécurité & Hygiène' },
    social: { score: socScore, weight: 5, label: 'Partage & Médias Sociaux' },
  };

  return {
    overallScore: finalScore,
    grade,
    categoryScores,
    aiReadiness: {
      rating: aiRating,
      score: aiScore,
      summary: aiSummary,
      signals: {
        hasStructuredEntity: schema.hasOrganizationOrLocalBusiness,
        hasClearDescription: seo.hasMetaDescription && seo.metaDescriptionLength >= 70,
        hasSemanticHeadings: seo.h1Count >= 1,
        isCrawlable: !index.isNoindex,
        hasContactSignals: schema.detectedTypes.some((t) => ['LocalBusiness', 'Organization', 'ContactPage'].includes(t)),
      },
    },
    passedChecksCount: passedChecks,
    totalChecksCount: totalChecks,
  };
}
