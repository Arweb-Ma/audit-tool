import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arweb — Audit de Performance Web & Générateur de Leads',
  description: 'Outil d\'audit gratuit pour analyser la vitesse mobile, le SEO multilingue (FR/EN) et l\'indexation IA (GEO) par Arweb Agence Digitale (arweb.ca).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,600;12..96,700;12..96,800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f9f8f6] text-[#1a1a18] antialiased min-h-screen selection:bg-[#0052cc] selection:text-white">
        {children}
      </body>
    </html>
  );
}
