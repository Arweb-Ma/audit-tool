export const config = {
  arweb: {
    siteUrl: process.env.NEXT_PUBLIC_ARWEB_URL || 'https://arweb.ma',
    contactEmail: process.env.CONTACT_EMAIL || 'contact@arweb.ma',
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212665016504',
    privacyPolicyUrl: process.env.NEXT_PUBLIC_PRIVACY_URL || 'https://arweb.ma/politique-confidentialite/',
  },
  audit: {
    pagespeedApiKey: process.env.PAGESPEED_API_KEY || '',
    fetchTimeoutMs: Number(process.env.FETCH_TIMEOUT_MS) || 10000,
    maxResponseBodyBytes: 2 * 1024 * 1024, // 2MB
    maxRedirectHops: 3,
    userAgent:
      process.env.AUDIT_USER_AGENT ||
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 ArwebAuditEngine/2.0',
    rateLimitHourlyAudits: Number(process.env.RATE_LIMIT_HOURLY_AUDITS) || 10,
    rateLimitHourlyLeads: Number(process.env.RATE_LIMIT_HOURLY_LEADS) || 5,
    cacheTtlSeconds: Number(process.env.AUDIT_CACHE_TTL_SECONDS) || 900, // 15 min
  },
  database: {
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    databaseUrl: process.env.DATABASE_URL || '',
  },
} as const;
