import { Header } from '@/components/Header';
import { AgencyCTA } from '@/components/AgencyCTA';
import { AuditApp } from '@/components/AuditApp';
import { HomeContent } from '@/components/content/HomeContent';
import { Faq } from '@/components/content/Faq';
import { RelatedTools } from '@/components/content/RelatedTools';
import { JsonLd, graph, organizationLd, webApplicationLd, faqLd } from '@/components/JsonLd';
import { HOME_FAQ, SITE_URL } from '@/lib/site';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#202124] flex flex-col font-sans">
      <JsonLd
        data={graph(
          organizationLd,
          webApplicationLd({
            url: `${SITE_URL}/`,
            name: 'Audit SEO gratuit Arweb',
            description:
              'Outil gratuit d’audit SEO et de test de vitesse : Core Web Vitals, balises SEO, indexation, Schema.org et sécurité.',
          }),
          faqLd(HOME_FAQ),
        )}
      />
      <Header />
      <main className="flex-1">
        <AuditApp
          source="home"
          hero={{
            overline: 'Audit SEO gratuit · Maroc & MENA',
            title: (
              <>
                Audit SEO gratuit et <span className="text-[#0b57d0]">test de vitesse</span> de votre site web
              </>
            ),
            subtitle:
              'Découvrez en 30 secondes ce qui freine votre site sur Google : vitesse mobile, balises SEO, indexation et préparation à la recherche IA.',
          }}
        />
        <HomeContent />
        <Faq items={HOME_FAQ} />
        <RelatedTools current="" />
      </main>
      <AgencyCTA />
    </div>
  );
}
