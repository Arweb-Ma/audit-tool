export const config = {
  arweb: {
    get siteUrl(): string {
      return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_ARWEB_URL || 'https://arweb.ma';
    },
    get contactEmail(): string {
      return process.env.NEXT_PUBLIC_CONTACT_EMAIL || process.env.CONTACT_EMAIL || 'contact@arweb.ma';
    },
    get whatsappNumber(): string {
      return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212665016504';
    },
    get privacyPolicyUrl(): string {
      return process.env.NEXT_PUBLIC_PRIVACY_URL || 'https://arweb.ma/politique-confidentialite/';
    },
  },
  audit: {
    get pagespeedApiKey(): string {
      return process.env.PAGESPEED_API_KEY || '';
    },
    get fetchTimeoutMs(): number {
      return Number(process.env.AUDIT_TIMEOUT_MS || process.env.FETCH_TIMEOUT_MS) || 10000;
    },
    maxResponseBodyBytes: 2 * 1024 * 1024, // 2MB
    maxRedirectHops: 3,
    get userAgent(): string {
      return (
        process.env.AUDIT_USER_AGENT ||
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 ArwebAuditEngine/2.0'
      );
    },
    get rateLimitHourlyAudits(): number {
      return Number(process.env.RATE_LIMIT_AUDITS_PER_HOUR || process.env.RATE_LIMIT_HOURLY_AUDITS) || 10;
    },
    get rateLimitHourlyLeads(): number {
      return Number(process.env.RATE_LIMIT_LEADS_PER_HOUR || process.env.RATE_LIMIT_HOURLY_LEADS) || 5;
    },
    get cacheTtlSeconds(): number {
      return Number(process.env.AUDIT_CACHE_TTL_SECONDS) || 900; // 15 min
    },
    get trustedProxyCount(): number {
      return Number(process.env.TRUSTED_PROXY_COUNT) || 0;
    },
  },
  database: {
    get supabaseUrl(): string {
      return process.env.SUPABASE_URL || '';
    },
    get supabaseServiceRoleKey(): string {
      return process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    },
    get databaseUrl(): string {
      return process.env.DATABASE_URL || '';
    },
  },
};
