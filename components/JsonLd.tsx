import { SITE_URL, SITE_NAME, AGENCY_URL, type FaqItem } from '@/lib/site';

/** Renders a JSON-LD <script>. Server component; `<` is escaped to keep the payload inert. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export const organizationLd = {
  '@type': 'Organization',
  '@id': `${AGENCY_URL}/#organization`,
  name: 'Arweb',
  url: AGENCY_URL,
  logo: `${SITE_URL}/logo.svg`,
  email: 'contact@arweb.ma',
  areaServed: ['MA', 'Middle East and North Africa'],
};

export function webApplicationLd(opts: { url: string; name: string; description: string }) {
  return {
    '@type': 'WebApplication',
    '@id': `${opts.url}#app`,
    name: opts.name,
    url: opts.url,
    description: opts.description,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'SEO tool',
    operatingSystem: 'Web',
    inLanguage: 'fr',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'MAD' },
    provider: { '@id': `${AGENCY_URL}/#organization` },
  };
}

export function faqLd(items: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function breadcrumbLd(trail: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: t.url })),
  };
}

export function graph(...nodes: Record<string, unknown>[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export { SITE_NAME };
