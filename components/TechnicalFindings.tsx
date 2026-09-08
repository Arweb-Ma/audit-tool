'use client';

import React, { useState } from 'react';
import { 
  FileSearch, 
  Image as ImageIcon, 
  Link2, 
  Database,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AuditResult } from '@/types/audit';

interface TechnicalFindingsProps {
  audit: AuditResult;
}

export const TechnicalFindings: React.FC<TechnicalFindingsProps> = ({ audit }) => {
  const [activeTab, setActiveTab] = useState<'meta' | 'headings' | 'images' | 'schema' | 'security'>('meta');
  const [showAllSchema, setShowAllSchema] = useState(false);

  const { seo, indexability, schema, security } = audit;

  return (
    <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#dadce0] shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#0b57d0] uppercase tracking-wider mb-1">
            <FileSearch className="w-4 h-4" />
            <span>Inspection technique factuelle</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-[#202124]">
            Données brutes détectées sur la page
          </h3>
        </div>
        <div className="text-xs text-[#5f6368] font-mono bg-[#f8f9fa] px-3 py-1.5 rounded-full border border-[#dadce0]">
          HTTP {indexability.httpStatus} · {indexability.redirectChainCount} redirection(s)
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#dadce0] pb-3">
        <button
          onClick={() => setActiveTab('meta')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'meta'
              ? 'bg-[#0b57d0] text-white shadow-sm'
              : 'bg-[#f8f9fa] text-[#5f6368] hover:bg-[#e8f0fe] hover:text-[#0b57d0]'
          }`}
        >
          Balises Meta & SEO
        </button>
        <button
          onClick={() => setActiveTab('headings')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'headings'
              ? 'bg-[#0b57d0] text-white shadow-sm'
              : 'bg-[#f8f9fa] text-[#5f6368] hover:bg-[#e8f0fe] hover:text-[#0b57d0]'
          }`}
        >
          Structure Hn ({seo.h1Count} H1, {seo.h2Count} H2)
        </button>
        <button
          onClick={() => setActiveTab('images')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'images'
              ? 'bg-[#0b57d0] text-white shadow-sm'
              : 'bg-[#f8f9fa] text-[#5f6368] hover:bg-[#e8f0fe] hover:text-[#0b57d0]'
          }`}
        >
          Images & Liens ({seo.totalImages} img)
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'schema'
              ? 'bg-[#0b57d0] text-white shadow-sm'
              : 'bg-[#f8f9fa] text-[#5f6368] hover:bg-[#e8f0fe] hover:text-[#0b57d0]'
          }`}
        >
          Schémas JSON-LD ({schema.detectedTypes.length})
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'security'
              ? 'bg-[#0b57d0] text-white shadow-sm'
              : 'bg-[#f8f9fa] text-[#5f6368] hover:bg-[#e8f0fe] hover:text-[#0b57d0]'
          }`}
        >
          En-têtes HTTP & SSL
        </button>
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {/* Meta & SEO Tab */}
        {activeTab === 'meta' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">Balise Title</span>
                <span className="text-xs font-mono font-medium text-[#0b57d0]">{seo.titleLength} caractères (recommandé: 30-65)</span>
              </div>
              <p className="text-sm font-medium text-[#202124] break-words">
                {seo.hasTitle ? seo.titleText : <span className="text-[#b3261e] italic">Aucune balise title détectée</span>}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">Meta Description</span>
                <span className="text-xs font-mono font-medium text-[#0b57d0]">{seo.metaDescriptionLength} caractères (recommandé: 80-160)</span>
              </div>
              <p className="text-sm text-[#202124] leading-relaxed break-words">
                {seo.hasMetaDescription ? (
                  seo.metaDescriptionText
                ) : (
                  <span className="text-[#b3261e] italic">Aucune meta description détectée</span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">URL Canonique</span>
                <p className="text-xs font-mono text-[#202124] break-all">
                  {indexability.hasCanonical ? (
                    indexability.canonicalUrl
                  ) : (
                    <span className="text-[#b06000]">Balise canonical non déclarée</span>
                  )}
                </p>
                {indexability.hasCanonical && (
                  <p className="text-[11px] text-[#5f6368]">
                    {indexability.isCanonicalSelfReferencing ? '✓ Auto-référente (optimal)' : '⚠️ Pointe vers une URL différente'}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">Robots Meta & Langue</span>
                <p className="text-xs font-mono text-[#202124]">
                  Directives : {indexability.robotsMeta || 'Aucune restriction (index, follow)'}
                </p>
                <p className="text-[11px] text-[#5f6368]">
                  Langue déclarée : <span className="font-mono">{seo.htmlLang || 'Non spécifiée'}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Headings Tab */}
        {activeTab === 'headings' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">Balise H1 Principale</span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    seo.h1Count === 1 ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-[#fce8e6] text-[#b3261e]'
                  }`}
                >
                  {seo.h1Count === 1 ? '1 DÉTECTÉ (OPTIMAL)' : `${seo.h1Count} DÉTECTÉ(S)`}
                </span>
              </div>
              <p className="text-base font-semibold text-[#202124]">
                {seo.h1Count > 0 ? `« ${seo.h1Text} »` : <span className="text-[#b3261e] italic">Aucun titre H1 trouvé</span>}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">Sous-titres H2</span>
                <span className="text-xs font-mono text-[#0b57d0] font-bold">{seo.h2Count} balise(s) H2</span>
              </div>
              <p className="text-xs text-[#5f6368]">
                {seo.h2Count >= 2
                  ? '✓ Hiérarchie éditoriale structurée permettant aux moteurs de comprendre les sous-thèmes abordés.'
                  : '⚠️ Faible volume de sous-titres H2. Structure éditoriale à étoffer pour clarifier vos services.'}
              </p>
            </div>
          </div>
        )}

        {/* Images & Links Tab */}
        {activeTab === 'images' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#202124] uppercase tracking-wider">
                <ImageIcon className="w-4 h-4 text-[#0b57d0]" />
                <span>Accessibilité & Attributs Images</span>
              </div>
              <div className="space-y-1.5 text-xs text-[#5f6368]">
                <div className="flex justify-between py-1 border-b border-[#dadce0]">
                  <span>Total images détectées :</span>
                  <span className="font-mono font-bold text-[#202124]">{seo.totalImages}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#dadce0]">
                  <span>Avec texte alternatif :</span>
                  <span className="font-mono font-bold text-[#137333]">{seo.imagesPercentWithAlt}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#dadce0]">
                  <span>Attribut alt manquant :</span>
                  <span className={`font-mono font-bold ${seo.imagesMissingAlt > 0 ? 'text-[#b3261e]' : 'text-[#137333]'}`}>
                    {seo.imagesMissingAlt}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Chargement différé (lazy-load) :</span>
                  <span className="font-mono font-bold text-[#202124]">{seo.imagesLazyLoaded}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#202124] uppercase tracking-wider">
                <Link2 className="w-4 h-4 text-[#0b57d0]" />
                <span>Hygiène des Liens</span>
              </div>
              <div className="space-y-1.5 text-xs text-[#5f6368]">
                <div className="flex justify-between py-1 border-b border-[#dadce0]">
                  <span>Liens internes :</span>
                  <span className="font-mono font-bold text-[#202124]">{seo.internalLinks}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#dadce0]">
                  <span>Liens sortants :</span>
                  <span className="font-mono font-bold text-[#202124]">{seo.externalLinks}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#dadce0]">
                  <span>Ancres vides ou non explicites :</span>
                  <span className={`font-mono font-bold ${seo.emptyAnchorLinks > 0 ? 'text-[#b3261e]' : 'text-[#137333]'}`}>
                    {seo.emptyAnchorLinks}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Liens externes sans noopener :</span>
                  <span className="font-mono font-bold text-[#202124]">{seo.externalLinksWithoutNoopener}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schema Tab */}
        {activeTab === 'schema' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#202124] uppercase tracking-wider">
                  <Database className="w-4 h-4 text-[#0b57d0]" />
                  <span>Entités JSON-LD ({schema.blockCount} bloc(s) détecté(s))</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    schema.hasJsonLd ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-[#fce8e6] text-[#b3261e]'
                  }`}
                >
                  {schema.hasJsonLd ? 'SCHÉMA PRÉSENT' : 'AUCUN SCHÉMA'}
                </span>
              </div>

              {schema.detectedTypes.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {schema.detectedTypes.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-white border border-[#dadce0] text-xs font-mono text-[#0b57d0] font-semibold"
                    >
                      @{t}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#5f6368]">
                  Aucune entité structurée (Organization, LocalBusiness, Service, WebSite) n'a été détectée.
                </p>
              )}
            </div>

            {schema.rawBlocksSummary.length > 0 && (
              <div className="space-y-2">
                <button
                  onClick={() => setShowAllSchema(!showAllSchema)}
                  className="text-xs text-[#0b57d0] font-bold flex items-center space-x-1 hover:underline"
                >
                  <span>{showAllSchema ? 'Masquer le détail JSON-LD' : 'Afficher le détail JSON-LD extrait'}</span>
                  {showAllSchema ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showAllSchema && (
                  <div className="p-4 rounded-xl bg-[#202124] text-white font-mono text-xs overflow-x-auto space-y-2">
                    {schema.rawBlocksSummary.map((b, idx) => (
                      <div key={idx} className="border-b border-white/10 pb-2 last:border-0 last:pb-0">
                        <span className="text-[#8ab4f8]">Bloc #{idx + 1}:</span> {b}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Security & Headers Tab */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">Sécurité Protocole</span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#202124]">Protocole HTTPS :</span>
                  <span className={security.isHttps ? 'text-[#137333] font-bold' : 'text-[#b3261e] font-bold'}>
                    {security.isHttps ? '✓ Actif' : '✗ Non sécurisé'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#202124]">Contenu mixte HTTP/HTTPS :</span>
                  <span className={security.mixedContentCount === 0 ? 'text-[#137333] font-bold' : 'text-[#b3261e] font-bold'}>
                    {security.mixedContentCount === 0 ? '0 ressource' : `${security.mixedContentCount} ressource(s)`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#202124]">HSTS (Strict-Transport-Security) :</span>
                  <span className={security.hstsHeader ? 'text-[#137333] font-bold' : 'text-[#5f6368]'}>
                    {security.hstsHeader ? '✓ Configuré' : 'Non détecté'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">Protection En-têtes HTTP</span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#202124]">Content-Security-Policy (CSP) :</span>
                  <span className={security.cspHeader ? 'text-[#137333] font-bold' : 'text-[#5f6368]'}>
                    {security.cspHeader ? '✓ Présente' : 'Non configurée'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#202124]">X-Content-Type-Options :</span>
                  <span className={security.xContentTypeOptionsHeader ? 'text-[#137333] font-bold' : 'text-[#5f6368]'}>
                    {security.xContentTypeOptionsHeader ? '✓ nosniff' : 'Non configuré'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#202124]">Referrer-Policy :</span>
                  <span className="font-mono text-[#0b57d0] font-semibold">{security.referrerPolicyHeader}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};