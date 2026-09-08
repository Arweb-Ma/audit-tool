'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageSquare, Download, Sparkles, FileText, Mail } from 'lucide-react';
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
      className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#137333]/40 text-[#202124] shadow-card space-y-8"
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#dadce0]">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-[#e6f4ea] border border-[#137333]/30 flex items-center justify-center text-[#137333]">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#137333] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagnostic technique débloqué</span>
            </div>
            <h2 className="text-2xl font-medium tracking-tight text-[#202124]">
              Rapport pour <span className="text-[#0b57d0] font-semibold">{auditResult.domain}</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto button button-compact bg-[#137333] border-[#137333] hover:bg-[#0d5926] text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Échanger sur WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Action Plan Checklist */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[#202124] flex items-center space-x-2">
          <FileText className="w-5 h-5 text-[#0b57d0]" />
          <span>Priorités recommandées par Arweb</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] space-y-2">
            <span className="text-xs font-mono text-[#0b57d0] font-bold uppercase tracking-wider">PHASE 1 · CRÉATION & VITESSE</span>
            <h4 className="text-sm font-bold text-[#202124]">Optimisation Core Web Vitals</h4>
            <p className="text-xs text-[#5f6368] leading-relaxed">
              Compression des ressources critiques, mise en cache CDN et réduction du temps de réponse initial (TTFB).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] space-y-2">
            <span className="text-xs font-mono text-[#0b57d0] font-bold uppercase tracking-wider">PHASE 2 · SEO & IA</span>
            <h4 className="text-sm font-bold text-[#202124]">Données structurées JSON-LD</h4>
            <p className="text-xs text-[#5f6368] leading-relaxed">
              Déploiement des schémas Organization & Service pour capter les recommandations Google AI et ChatGPT.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] space-y-2">
            <span className="text-xs font-mono text-[#137333] font-bold uppercase tracking-wider">PHASE 3 · ANALYTICS</span>
            <h4 className="text-sm font-bold text-[#202124]">Mesure des conversions clés</h4>
            <p className="text-xs text-[#5f6368] leading-relaxed">
              Configuration GA4 et Tag Manager pour relier chaque visiteur à un appel ou une demande de contact.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Box */}
      <div className="p-6 rounded-2xl bg-[#f0f6ff] border border-[#0b57d0]/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-medium text-[#202124]">Prêt à concrétiser ces optimisations ?</h4>
          <p className="text-sm text-[#5f6368] mt-1">
            Écrivez-nous à <a href="mailto:contact@arweb.ma" className="text-[#0b57d0] font-bold underline">contact@arweb.ma</a> ou lancez une discussion directe.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <a
            href="mailto:contact@arweb.ma?subject=Diagnostic%20de%20performance%20Arweb"
            className="button button-compact text-sm w-full sm:w-auto justify-center"
          >
            <Mail className="w-4 h-4 mr-2" />
            <span>Écrire à l'agence</span>
          </a>

          <button
            onClick={() => window.print()}
            className="button button-outline button-compact text-sm w-full sm:w-auto justify-center"
          >
            <Download className="w-4 h-4 text-[#0b57d0] mr-2" />
            <span>Imprimer le rapport</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
