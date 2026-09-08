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
      title: 'Données Structurées Recherche IA (JSON-LD)',
      status: seoAndGeo.hasJsonLdSchema,
      detail: seoAndGeo.hasJsonLdSchema
        ? `Types détectés : ${seoAndGeo.schemaTypes.join(', ') || 'Objet Schéma'}`
        : 'Balise JSON-LD manquante',
      desc: 'Indispensable pour permettre à ChatGPT Search, Gemini et Google AI Overviews d\'extraire vos services.',
    },
    {
      title: 'Ciblage SEO Multilingue & Régional (Hreflang)',
      status: seoAndGeo.hasHreflang,
      detail: seoAndGeo.detectedLangs.length > 0 ? `Langues : ${seoAndGeo.detectedLangs.join(', ')}` : 'Langue unique',
      desc: 'Permet de cibler les acheteurs régionaux en Français, Anglais et Arabe (FR/EN/AR).',
    },
    {
      title: 'Aperçu Partage Réseaux Sociaux (OpenGraph)',
      status: seoAndGeo.hasOpenGraph,
      detail: seoAndGeo.hasOpenGraph ? 'Balises OpenGraph présentes' : 'Balise og:title ou og:image manquante',
      desc: 'Génère une vignette attrayante lors du partage de vos liens sur WhatsApp, LinkedIn & Twitter.',
    },
    {
      title: 'Métadonnées Cartes X / Twitter',
      status: seoAndGeo.hasTwitterCard,
      detail: seoAndGeo.hasTwitterCard ? 'Carte Twitter active' : 'Balise twitter:card manquante',
      desc: 'Maximise le taux de clic lorsque vos liens sont partagés sur les médias sociaux.',
    },
    {
      title: 'Titre & Méta-Description SEO',
      status: seoAndGeo.hasTitle && seoAndGeo.hasMetaDescription,
      detail: seoAndGeo.hasTitle && seoAndGeo.hasMetaDescription ? 'Balises Méta Complètes' : 'Description méta manquante',
      desc: 'Détermine le taux de clic (CTR) dans les résultats de recherche Google.',
    },
    {
      title: 'Protocole Sécurisé HTTPS / SSL',
      status: seoAndGeo.isHttps,
      detail: seoAndGeo.isHttps ? 'HTTPS Sécurisé Actif' : 'Protocole HTTP Non Sécurisé',
      desc: 'Signal de sécurité obligatoire pour la confiance navigateur et le classement SEO.',
    },
  ];

  return (
    <div className="card-light p-6 sm:p-8 rounded-2xl bg-white border border-[#e2e0db] space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#0052cc] uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Préparatif IA & SEO Régional</span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#111110]">
            Indexation Recherche IA & Référencement Multilingue
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[#6b6b69] bg-[#f0ede8] px-3 py-1.5 rounded-full border border-[#e2e0db] font-mono">
          <Cpu className="w-3.5 h-3.5 text-[#0052cc]" />
          <span>Prêt Pour ChatGPT & Gemini Search</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checkItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-3.5 p-4 rounded-xl bg-[#f9f8f6] border border-[#e2e0db] hover:border-[#b0ada6] transition-all"
          >
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                item.status ? 'bg-[#ecfdf5] text-[#059669] border border-[#059669]/30' : 'bg-[#fef2f2] text-[#dc2626] border border-[#dc2626]/30'
              }`}
            >
              {item.status ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-xs sm:text-sm font-bold text-[#111110] truncate">{item.title}</h4>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    item.status ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fef2f2] text-[#dc2626]'
                  }`}
                >
                  {item.status ? 'CONFORME' : 'À CORRIGER'}
                </span>
              </div>
              <p className="text-[11px] text-[#0052cc] font-mono mt-0.5 font-medium">{item.detail}</p>
              <p className="text-[11px] text-[#6b6b69] mt-1 leading-snug">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
