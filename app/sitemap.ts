import type { MetadataRoute } from 'next';
import { SITE_URL, LANDING_PAGES } from '@/lib/site';

// Bump when page content changes meaningfully.
const LAST_MODIFIED = new Date('2026-11-20');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 1 },
    ...LANDING_PAGES.map((p) => ({
      url: `${SITE_URL}/${p.slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
