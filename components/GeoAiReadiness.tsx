'use client';

import React from 'react';
import { Sparkles, Check, X, Cpu } from 'lucide-react';
import { SchemaMetrics, SocialMetrics, AiReadinessMetrics, SeoMetrics } from '@/types/audit';

interface GeoAiReadinessProps {
  seo: SeoMetrics;
  schema: SchemaMetrics;
  social: SocialMetrics;
  aiReadiness: AiReadinessMetrics;
}

export const GeoAiReadiness: React.FC<GeoAiReadinessProps> = ({
  seo,
  schema,
  social,
  aiReadiness,
}) => {
  const checkItems = [
    {
      title: 'Données structurées IA (JSON-LD Schema)',
      status: schema.hasJsonLd,
      detail: schema.hasJsonLd
        ? `Types détectés : ${schema.detectedTypes.join(', ') || 'Schéma actif'}`
        : 'Balise JSON-LD non détectée',
      desc: 'Permet à Google AI Overviews, Perplexity et ChatGPT Search de comprendre vos entités.',
    },
    {
      title: 'Ciblage multilingue & régional (Hreflang)',
      status: social.hasHreflang,
      detail: social.detectedLangs.length > 0 ? `Langues : ${social.detectedLangs.join(', ')}` : 'Langue unique',
      desc: 'Optimisé pour capter des prospects au Maroc et dans la région MENA (FR/EN/AR).',
    },
    {
      title: 'Vignettes de partage WhatsApp & LinkedIn (OpenGraph)',
      status: social.hasOpenGraph,
      detail: social.hasOpenGraph ? 'Balises OpenGraph actives' : 'Balises og:image / og:title manquantes',
      desc: 'Affiche un aperçu visuel soigné lors du partage de vos liens par messagerie ou réseaux.',
    },
    {
      title: 'Métadonnées cartes X / Twitter',
      status: social.hasTwitterCard,
      detail: social.hasTwitterCard ? `Carte active (${social.twitterCardType || 'summary'})` : 'Balise twitter:card non détectée',
      desc: 'Optimise l\'affichage de votre marque lors des partages sur Twitter / X.',
    },
    {
      title: 'Balises Title & Meta Description Google',
      status: seo.hasTitle && seo.hasMetaDescription,
      detail: seo.hasTitle && seo.hasMetaDescription ? 'Balises renseignées' : 'Description ou titre manquant',
      desc: 'Détermine la clarté de votre offre dans les pages de résultats de recherche (SERP).',
    },
    {
      title: 'Entité Organisation / Entreprise Locale',
      status: schema.hasOrganizationOrLocalBusiness,
      detail: schema.hasOrganizationOrLocalBusiness ? 'Entité reconnue (@Organization)' : 'Entité non formalisée',
      desc: 'Indispensable pour lier votre marque à son secteur d\'activité et ses coordonnées officielles.',
    },
  ];

  const getRatingBadge = (rating: string) => {
    if (rating === 'Fort') {
      return <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#e6f4ea] text-[#137333]">PRÉPARATION FORTE ({aiReadiness.score}%)</span>;
    }
    if (rating === 'Modéré') {
      return <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#e8f0fe] text-[#0b57d0]">PRÉPARATION MODÉRÉE ({aiReadiness.score}%)</span>;
    }
    if (rating === 'Limité') {
      return <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#fef7e0] text-[#b06000]">PRÉPARATION LIMITÉE ({aiReadiness.score}%)</span>;
    }
    return <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#fce8e6] text-[#b3261e]">À OPTIMISER ({aiReadiness.score}%)</span>;
  };

  return (
    <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#dadce0] space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#0b57d0] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Visibilité Sémantique & Moteurs IA</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-[#202124]">
            SEO Multilingue & Préparation Recherche IA
          </h3>
        </div>
        <div>{getRatingBadge(aiReadiness.rating)}</div>
      </div>

      <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] text-xs text-[#5f6368] leading-relaxed flex items-start space-x-3">
        <Cpu className="w-4 h-4 text-[#0b57d0] mt-0.5 flex-shrink-0" />
        <p>{aiReadiness.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checkItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-3.5 p-4 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] hover:border-[#0b57d0] transition-all"
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                item.status ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-[#fce8e6] text-[#b3261e]'
              }`}
            >
              {item.status ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-[#202124] truncate">{item.title}</h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.status ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-[#fce8e6] text-[#b3261e]'
                  }`}
                >
                  {item.status ? 'CONFORME' : 'À TRAITER'}
                </span>
              </div>
              <p className="text-xs text-[#0b57d0] font-medium mt-0.5">{item.detail}</p>
              <p className="text-xs text-[#5f6368] mt-1 leading-snug">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
