import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { AgencyCTA } from '@/components/AgencyCTA';
import { AuditApp } from '@/components/AuditApp';
import { LandingContent } from '@/components/content/LandingContent';
import { Faq } from '@/components/content/Faq';
import { RelatedTools } from '@/components/content/RelatedTools';
import { JsonLd, graph, organizationLd, webApplicationLd, faqLd, breadcrumbLd } from '@/components/JsonLd';
import { LANDING_PAGES, getLandingPage, SITE_URL } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return LANDING_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getLandingPage(params.slug);
  if (!page) return {};
  const path = `/${page.slug}`;
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'fr_MA',
      url: path,
      title: page.title,
      description: page.description,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: page.h1 }],
    },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description, images: ['/og.png'] },
  };
}

export default function LandingPageRoute({ params }: { params: { slug: string } }) {
  const page = getLandingPage(params.slug);
  if (!page) notFound();
  const url = `${SITE_URL}/${page.slug}`;

  return (
    <div className="min-h-screen bg-white text-[#202124] flex flex-col font-sans">
      <JsonLd
        data={graph(
          organizationLd,
          webApplicationLd({ url, name: page.h1, description: page.description }),
          faqLd(page.faq),
          breadcrumbLd([
            { name: 'Audit SEO gratuit', url: `${SITE_URL}/` },
            { name: page.navLabel, url },
          ]),
        )}
      />
      <Header />
      <main className="flex-1">
        <AuditApp source={page.slug} hero={{ overline: page.overline, title: page.h1, subtitle: page.subtitle }} />
        <LandingContent page={page} />
        <Faq items={page.faq} />
        <RelatedTools current={page.slug} />
      </main>
      <AgencyCTA />
    </div>
  );
}
