'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageSquare, Download, Sparkles, FileText } from 'lucide-react';
import { AuditResult } from '../app/api/analyze/route';

interface LeadSuccessStateProps {
  auditResult: AuditResult;
  whatsappLink: string;
}

export const LeadSuccessState: React.FC<LeadSuccessStateProps> = ({
  auditResult,
  whatsappLink,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-light p-6 sm:p-8 rounded-2xl bg-white border border-[#059669]/30 text-[#1a1a18] shadow-card space-y-8"
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#e2e0db]">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] border border-[#059669]/40 flex items-center justify-center text-[#059669]">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#059669] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Audit Technique Complet Débloqué</span>
            </div>
            <h2 className="font-heading text-2xl font-extrabold text-[#111110]">
              Rapport Prêt Pour <span className="text-[#0052cc] font-mono">{auditResult.domain}</span>
            </h2>
          </div>
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center space-x-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Accéder À Votre Révision Prioritaire</span>
        </a>
      </div>

      {/* Action Plan Checklist */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-bold text-[#111110] flex items-center space-x-2">
          <FileText className="w-5 h-5 text-[#0052cc]" />
          <span>Recommandations d'Action Par L'Agence Arweb.ca</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#f9f8f6] border border-[#e2e0db] space-y-2">
            <span className="text-xs font-mono text-[#0052cc] font-bold">PHASE 1 • IMMÉDIAT</span>
            <h4 className="font-heading text-sm font-bold text-[#111110]">Optimisation LCP & Vitesse Mobile</h4>
            <p className="text-xs text-[#6b6b69] leading-snug">
              Mise en place du cache Next.js Edge, compression des images du Hero et réduction du TTFB de ~60%.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f9f8f6] border border-[#e2e0db] space-y-2">
            <span className="text-xs font-mono text-[#0052cc] font-bold">PHASE 2 • INDEXATION IA</span>
            <h4 className="font-heading text-sm font-bold text-[#111110]">Injection Schémas JSON-LD & GEO</h4>
            <p className="text-xs text-[#6b6b69] leading-snug">
              Déploiement des schémas d'Organization, Service et FAQ pour capter les recommandations ChatGPT & Gemini.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f9f8f6] border border-[#e2e0db] space-y-2">
            <span className="text-xs font-mono text-[#059669] font-bold">PHASE 3 • VIRALITÉ RÉSEAUX</span>
            <h4 className="font-heading text-sm font-bold text-[#111110]">Cartes OpenGraph & SEO Hreflang</h4>
            <p className="text-xs text-[#6b6b69] leading-snug">
              Balises hreflang FR/EN et vignettes OpenGraph haute conversion pour le partage WhatsApp & LinkedIn.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-6 rounded-xl bg-[#e8f0ff]/80 border border-[#0052cc]/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="font-heading text-lg font-bold text-[#111110]">Prêt À Doubler Les Ventes De Votre Site Web ?</h4>
          <p className="text-xs sm:text-sm text-[#6b6b69] mt-1">
            Réservez un échange stratégique de 15 minutes avec un architecte web Arweb.ca pour passer en revue vos corrections.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-blue text-sm w-full sm:w-auto justify-center"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discuter Sur WhatsApp</span>
          </a>

          <button
            onClick={() => window.print()}
            className="btn-outline text-sm w-full sm:w-auto justify-center"
          >
            <Download className="w-4 h-4 text-[#0052cc]" />
            <span>Télécharger le Rapport</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
