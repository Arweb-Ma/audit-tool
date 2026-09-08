import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arweb — Audit de Performance Web & Générateur de Croissance',
  description: 'Analysez instantanément la vitesse mobile, le SEO multilingue et la mesure des conversions par Arweb — Agence digitale au Maroc & région MENA (arweb.ma).',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="bg-white text-[#202124] antialiased min-h-screen selection:bg-[#0b57d0] selection:text-white">
        {children}
      </body>
    </html>
  );
}
