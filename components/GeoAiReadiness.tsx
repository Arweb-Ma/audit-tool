'use client';

import React from 'react';
import { Sparkles, Check, X, Cpu } from 'lucide-react';
import { AuditResult } from '../app/api/analyze/route';

interface GeoAiReadinessProps {
  seoAndGeo: AuditResult['seoAndGeo'];
}

export const GeoAiReadiness: React.FC<GeoAiReadinessProps> = ({ seoAndGeo }) => {
  const checkItems = [
    {
      title: 'Données structurées IA (JSON-LD Schema)',
      status: seoAndGeo.hasJsonLdSchema,
      detail: seoAndGeo.hasJsonLdSchema
        ? `Types détectés : ${seoAndGeo.schemaTypes.join(', ') || 'Schéma actif'}`
        : 'Balise JSON-LD non détectée',
      desc: 'Permet à Google AI Overviews, Perplexity et ChatGPT Search de recommander vos services.',
    },
    {
      title: 'Ciblage multilingue & régional (Hreflang)',
      status: seoAndGeo.hasHreflang,
      detail: seoAndGeo.detectedLangs.length > 0 ? `Langues : ${seoAndGeo.detectedLangs.join(', ')}` : 'Langue unique',
      desc: 'Optimisé pour capter des prospects au Maroc et dans la région MENA (FR/EN/AR).',
    },
    {
      title: 'Vignettes de partage WhatsApp & LinkedIn (OpenGraph)',
      status: seoAndGeo.hasOpenGraph,
      detail: seoAndGeo.hasOpenGraph ? 'Balises OpenGraph actives' : 'Balises og:image manquantes',
      desc: 'Affiche un aperçu professionnel lors du partage de vos liens par messagerie ou réseaux.',
    },
    {
      title: 'Métadonnées cartes X / Twitter',
      status: seoAndGeo.hasTwitterCard,
      detail: seoAndGeo.hasTwitterCard ? 'Carte Twitter active' : 'Balise twitter:card non détectée',
      desc: 'Maximise l\'impact visuel et le taux de clic sur vos partages sociaux.',
    },
    {
      title: 'Balises Title & Meta Description Google',
      status: seoAndGeo.hasTitle && seoAndGeo.hasMetaDescription,
      detail: seoAndGeo.hasTitle && seoAndGeo.hasMetaDescription ? 'Balises complètes' : 'Description manquante',
      desc: 'Détermine la clarté de votre offre dans les pages de résultats de recherche (SERP).',
    },
    {
      title: 'Sécurité et certificat SSL (HTTPS)',
      status: seoAndGeo.isHttps,
      detail: seoAndGeo.isHttps ? 'HTTPS Sécurisé' : 'Protocole HTTP Non Sécurisé',
      desc: 'Indispensable pour la confiance de vos visiteurs et le référencement Google.',
    },
  ];

  return (
    <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#dadce0] space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#0b57d0] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Visibilité & Indexation IA</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-[#202124]">
            SEO Multilingue & Préparation Recherche IA
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[#5f6368] bg-[#f0f6ff] px-3.5 py-1.5 rounded-full border border-[#dadce0] font-medium">
          <Cpu className="w-3.5 h-3.5 text-[#0b57d0]" />
          <span>Prêt pour ChatGPT & Google AI</span>
        </div>
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
