export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low' | 'opportunity';
export type IssueDifficulty = 'easy' | 'moderate' | 'advanced';
export type IssueCategory =
  | 'performance'
  | 'seo'
  | 'indexability'
  | 'schema'
  | 'mobile'
  | 'security'
  | 'social';

export interface AuditIssue {
  id: string;
  title: string;
  category: IssueCategory;
  severity: IssueSeverity;
  difficulty: IssueDifficulty;
  priority: number; // 1 (highest priority) to 10
  evidence: string; // What was actually detected on the page
  impactExplanation: string; // Factual, technical explanation of impact
  recommendation: string; // Actionable code or configuration instruction
}

export interface MetricItem {
  value: string;
  numVal?: number;
  status: 'good' | 'needs-improvement' | 'poor' | 'unavailable';
  label: string;
  target?: string;
  description?: string;
}

export interface CoreWebVitals {
  available: boolean;
  source: 'lighthouse-lab' | 'unavailable';
  fieldDataAvailable: boolean;
  lcp: MetricItem;
  cls: MetricItem;
  fcp: MetricItem;
  speedIndex: MetricItem;
  ttfb: MetricItem;
  mobileFriendly: boolean;
  directTtfbMs?: number;
  note?: string;
}

export interface SeoMetrics {
  hasTitle: boolean;
  titleText: string;
  titleLength: number;
  titleStatus: 'good' | 'warning' | 'poor';
  hasMetaDescription: boolean;
  metaDescriptionText: string;
  metaDescriptionLength: number;
  metaDescriptionStatus: 'good' | 'warning' | 'poor';
  h1Count: number;
  h1Text: string;
  h2Count: number;
  headingHierarchyValid: boolean;
  hasViewport: boolean;
  viewportContent: string;
  htmlLang: string;
  hasHtmlLang: boolean;
  hasFavicon: boolean;
  totalImages: number;
  imagesMissingAlt: number;
  imagesWithEmptyAlt: number;
  imagesPercentWithAlt: number;
  imagesMissingDimensions: number;
  imagesLazyLoaded: number;
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
  emptyAnchorLinks: number;
  externalLinksWithoutNoopener: number;
}

export interface IndexabilityMetrics {
  robotsMeta: string;
  isNoindex: boolean;
  isNofollow: boolean;
  xRobotsTag: string;
  hasCanonical: boolean;
  canonicalUrl: string;
  isCanonicalSelfReferencing: boolean;
  robotsTxtStatus: 'present' | 'missing' | 'unreachable';
  sitemapStatus: 'present' | 'missing' | 'unreachable';
  sitemapUrl?: string;
  httpStatus: number;
  finalUrl: string;
  isRedirected: boolean;
  redirectChainCount: number;
}

export interface SchemaMetrics {
  hasJsonLd: boolean;
  detectedTypes: string[];
  blockCount: number;
  hasParsingError: boolean;
  hasOrganizationOrLocalBusiness: boolean;
  hasBreadcrumbs: boolean;
  hasFaq: boolean;
  hasProductOrService: boolean;
  rawBlocksSummary: string[];
}

export interface SecurityMetrics {
  isHttps: boolean;
  hstsHeader: boolean;
  cspHeader: boolean;
  xContentTypeOptionsHeader: boolean;
  referrerPolicyHeader: string;
  permissionsPolicyHeader: boolean;
  mixedContentCount: number;
}

export interface SocialMetrics {
  hasOpenGraph: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  hasTwitterCard: boolean;
  twitterCardType?: string;
  hasHreflang: boolean;
  detectedLangs: string[];
}

export interface AiReadinessMetrics {
  rating: 'Fort' | 'Modéré' | 'Limité' | 'À optimiser';
  score: number; // 0-100
  summary: string;
  signals: {
    hasStructuredEntity: boolean;
    hasClearDescription: boolean;
    hasSemanticHeadings: boolean;
    isCrawlable: boolean;
    hasContactSignals: boolean;
  };
}

export interface CategoryScores {
  seo: { score: number; weight: number; label: string };
  performance: { score: number; weight: number; label: string; available: boolean };
  indexability: { score: number; weight: number; label: string };
  schema: { score: number; weight: number; label: string };
  mobile: { score: number; weight: number; label: string };
  security: { score: number; weight: number; label: string };
  social: { score: number; weight: number; label: string };
}

export interface AuditResult {
  url: string;
  domain: string;
  timestamp: string;
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  categoryScores: CategoryScores;
  metrics: CoreWebVitals;
  seo: SeoMetrics;
  indexability: IndexabilityMetrics;
  schema: SchemaMetrics;
  security: SecurityMetrics;
  social: SocialMetrics;
  aiReadiness: AiReadinessMetrics;
  issues: AuditIssue[];
  passedChecksCount: number;
  totalChecksCount: number;
}

export interface LeadSubmissionPayload {
  name: string;
  email: string;
  whatsapp: string;
  sector: string;
  websiteUrl: string;
  auditScore: number;
  categoryScores: Record<string, number>;
  topIssues: Array<{ title: string; severity: string; evidence: string }>;
  consentGiven: boolean;
}

export interface LeadRecord extends LeadSubmissionPayload {
  id: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'qualified' | 'archived';
}
