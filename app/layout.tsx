import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { SITE_URL, SITE_NAME } from '@/lib/site';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Audit SEO gratuit & test de vitesse de site web | Arweb',
    template: '%s | Arweb',
  },
  description:
    'Audit SEO gratuit de votre site en 30 secondes : vitesse mobile (Core Web Vitals), balises SEO, indexation Google, Schema.org et sécurité. Sans inscription.',
  applicationName: SITE_NAME,
  icons: { icon: '/favicon.svg' },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_MA',
    siteName: SITE_NAME,
    url: '/',
    title: 'Audit SEO gratuit & test de vitesse de site web',
    description:
      'Score sur 100, Core Web Vitals, balises SEO, indexation et sécurité : votre diagnostic gratuit en 30 secondes.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Audit SEO gratuit Arweb' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audit SEO gratuit & test de vitesse de site web',
    description: 'Votre diagnostic SEO et vitesse mobile gratuit en 30 secondes.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export const viewport: Viewport = {
  themeColor: '#0b57d0',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-MA" className="scroll-smooth">
      <body className="bg-white text-[#202124] antialiased min-h-screen selection:bg-[#0b57d0] selection:text-white">
        {children}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
        {PLAUSIBLE_DOMAIN && (
          <Script defer data-domain={PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
